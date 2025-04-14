import { admin, db } from "../config/firebase-admin.js";

export const registerUser = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const existingUser = await admin.auth().getUserByEmail(email).catch(() => null);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const userRecord = await admin.auth().createUser({ email, password, displayName: name });
    console.log("Firebase user created:", userRecord.uid);

    await db.collection("users").doc(userRecord.uid).set({
      name,
      email,
      createdAt: new Date(),
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const loginUser = async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) return res.status(400).json({ message: "ID token is required" });

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log("Decoded token:", decodedToken);

    // Retrieve user details from Firestore
    const userDoc = await db.collection("users").doc(decodedToken.uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: "User not found in Firestore" });
    }

    return res.status(200).json({
      message: "Login successful",
      user: {
        uid: decodedToken.uid,
        email: userDoc.data().email,
        name: userDoc.data().name,
      },
    });
  } catch (err) {
    console.error("Error verifying token:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
