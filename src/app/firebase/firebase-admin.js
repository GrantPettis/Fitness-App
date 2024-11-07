// src/app/firebase/firebaseAdmin.js

import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK only if it hasn't been initialized already
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.SERVICE_ACCOUNT_KEY)),  
    databaseURL: 'https://universal-body-and-mind-default-rtdb.firebaseio.com',  // Correct Realtime Database URL
  });
}

const db = admin.firestore();
const auth = admin.auth();

export { db, auth };
