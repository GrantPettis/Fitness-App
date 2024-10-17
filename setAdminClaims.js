const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.applicationDefault(),  // Use your service account key file
});

// Set the custom claim 'isAdmin' to true for a specific user by their UID
const uid = 'your-admin-user-uid';  // Replace with your actual user UID

admin.auth().setCustomUserClaims(uid, { isAdmin: true })
  .then(() => {
    console.log('Custom claims set for admin user');
    process.exit();  // Exit script after completion
  })
  .catch(error => {
    console.error('Error setting custom claims:', error);
    process.exit(1);
  });
