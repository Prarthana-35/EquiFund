const admin = require('firebase-admin');
const serviceAccount = require('../config/serviceAccountKey.json'); 

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
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
          createdAt: new Date(),
        });
        console.log(`User ${user.email} added to Firestore`);
      } else {
        console.log(`User ${user.email} already exists in Firestore`);
      }
    }

    console.log('All users processed successfully');
  } catch (err) {
    console.error('Error adding users to Firestore:', err);
    throw err;
  }
};

module.exports = { admin, db, auth, addUsersToFirestore };