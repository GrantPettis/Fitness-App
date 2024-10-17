// Import the Firebase Admin SDK
import admin from 'firebase-admin';
import serviceAccount from '../../serviceAccountKey.json'; // Adjust the path to your service account key file

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount), // Use the imported service account
  });
}

// Function to set admin claims
const setAdminClaim = async (uid) => {
  try {
    await admin.auth().setCustomUserClaims(uid, { isAdmin: true });
    console.log(`User ${uid} has been set as admin.`);
  } catch (error) {
    console.error("Error setting custom claims:", error);
  }
};

// API route to handle requests
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { uid } = req.body; // Get the UID from the request body

    if (!uid) {
      return res.status(400).json({ error: "UID is required." });
    }

    await setAdminClaim(uid); // Set the admin claim

    return res.status(200).json({ message: `User ${uid} has been updated to admin.` });
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
