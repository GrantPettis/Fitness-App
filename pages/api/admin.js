// Import necessary functions from Firebase SDK
import { db } from '../../src/app/firebase/firebase'; 
import { collection, getDocs, updateDoc, doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase-admin/auth';  // Import Firebase Admin Authentication

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { uid, role, userId, planId } = req.body; // Destructure uid, role, userId, and planId from the request body

    // Log the incoming request
    console.log("Received POST request:", { uid, role, userId, planId });

    // Verify the user is an admin before proceeding with any role or plan update
    try {
      const adminAuth = getAuth();  // Firebase Admin SDK to verify claims
      const userRecord = await adminAuth.getUser(uid);

      if (!userRecord.customClaims || userRecord.customClaims.admin !== true) {
        // User is not an admin, deny the request
        return res.status(403).json({ error: 'Not authorized. Only admins can perform this action.' });
      }
    } catch (error) {
      console.error('Error verifying admin status:', error);
      return res.status(500).json({ error: 'Failed to verify admin status.' });
    }

    // Handle role updates
    if (role) {
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
    }

    // Handle workout plan assignment
    if (userId && planId) {
      try {
        const userWorkoutPlanRef = doc(db, "users", userId, "workoutPlans", planId); // Reference to the user's workoutPlans subcollection
        const workoutPlanRef = doc(db, "workoutPlans", planId); // Reference to the workout plan in Firestore

        // Fetch the workout plan data
        const workoutPlanSnapshot = await workoutPlanRef.get();
        if (!workoutPlanSnapshot.exists) {
          return res.status(404).json({ error: "Workout plan not found." });
        }

        // Assign the workout plan to the user
        await setDoc(userWorkoutPlanRef, {
          ...workoutPlanSnapshot.data(),
          assignedAt: new Date(),
          assignedBy: uid, // Admin who assigned the workout plan
        });

        console.log(`Workout plan ${planId} assigned to user ${userId}.`);
        return res.status(200).json({ message: `Workout plan ${planId} assigned to user ${userId}.` });
      } catch (error) {
        console.error("Error assigning workout plan:", error);
        return res.status(500).json({ error: "Failed to assign workout plan." });
      }
    }

    return res.status(400).json({ error: "Invalid request. Provide either uid and role, or userId and planId." });
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
