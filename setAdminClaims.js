const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.applicationDefault(),  // Use your service account key file
});

// List of UIDs to set as admin
const adminUids = [
  '4rnskQyaQ0YTicwoUx2N93FP5223',
  'TMjeYIm9vuWO7pF7H0S4tWygzSp1',
  'TWhudUEo6gOuUfTgGn2Z83PnhQs2',
  'Hwv2s46BvYPZVN0mulL4STPIxzh1'
];

// Function to set custom claims for each UID
async function setAdminClaims() {
  for (const uid of adminUids) {
    try {
      await admin.auth().setCustomUserClaims(uid, { isAdmin: true });
      console.log(`User ${uid} has been set as admin.`);
    } catch (error) {
      console.error(`Error setting custom claims for ${uid}:`, error);
    }
  }
  process.exit();  // Exit script after completion
}

// Call the function
setAdminClaims();
