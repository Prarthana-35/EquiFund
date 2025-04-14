import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { dirname } from 'path';

// Get current module path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load service account
const serviceAccount = JSON.parse(
  readFileSync(path.join(__dirname, 'serviceAccountKey.json'))
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
}

const db = admin.firestore();
const auth = admin.auth();

const addUsersToFirestore = async () => {
  try {
    const listUsersResult = await auth.listUsers();
    const users = listUsersResult.users;

    for (const user of users) {
      const userRef = db.collection('users').doc(user.uid);
      const userDoc = await userRef.get();
      
      if (!userDoc.exists) {
        await userRef.set({
          email: user.email,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        console.log(`User ${user.email} added to Firestore`);
      }
    }

    console.log('All users processed successfully');
    return { success: true, count: users.length };
  } catch (err) {
    console.error('Error adding users to Firestore:', err);
    throw err;
  }
};

export { admin, db, auth, addUsersToFirestore };