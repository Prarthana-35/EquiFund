import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./src/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export const registerUser = async (email, password, name) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      createdAt: new Date(),
    });

    console.log("User added to Firestore successfully");
    return { message: "Signup successful", user };
  } catch (err) {
    console.error("Signup Error:", err);
    throw err;
  }
};

export const loginUser = async (email, password) => {
  try {
    console.log("Logging in user...");
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const idToken = await user.getIdToken(); // Firebase token

    localStorage.setItem("idToken", idToken);
    console.log("Firebase ID Token:", idToken);

    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      throw new Error("User not found in Firestore");
    }

    const response = await fetch("http://localhost:5000/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }), 
    });

    const data = await response.json();
    console.log("Login successful:", data);
    return data;
  } catch (err) {
    console.error("Error logging in:", err);
    throw err;
  }
};