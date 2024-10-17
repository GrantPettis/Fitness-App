// Import necessary functions from Firebase SDK
import { db } from '../../src/app/firebase/firebase'; 
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { uid, role } = req.body; // Destructure uid and role from the request body

    // Log the incoming request
    console.log("Received POST request:", { uid, role });

    if (!uid || !role) {
      return res.status(400).json({ error: "uid and role are required." });
    }

    try {
      const userDoc = doc(db, "users", uid); // Reference to the user document in Firestore
      await updateDoc(userDoc, { role }); // Update user's role
      console.log(`User ${uid} updated to role ${role}.`); // Log the successful update
      return res.status(200).json({ message: `User ${uid} updated to role ${role}.` });
    } catch (error) {
      console.error("Error updating user role:", error);
      return res.status(500).json({ error: "Failed to update user role." });
    }
  } else if (req.method === 'GET') {
    try {
      const usersCollection = collection(db, 'users'); 
      const snapshot = await getDocs(usersCollection);
      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return res.status(200).json(users); 
    } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ error: "Failed to fetch users." });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
