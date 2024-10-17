const admin = require('firebase-admin');

// Initialize Firebase Admin SDK with the service account key file
admin.initializeApp({
  credential: admin.credential.cert(require('./universal-body-and-mind-firebase-adminsdk-rysjb-efdebed97a.json')),  // Adjust path as needed
});

// The UID of the user you want to update
const uid = 'ntjP9wDJczekJHX1t4rfATysxc63';  // Replace this with the actual UID

// Set the custom claim 'isAdmin' to true for the specified user
admin.auth().setCustomUserClaims(uid, { isAdmin: true })
  .then(() => {
    console.log('Custom claims updated: User is now an admin.');
  })
  .catch(error => {
    console.error('Error updating custom claims:', error);
  });
