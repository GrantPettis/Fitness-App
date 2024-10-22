// Import the Firebase Admin SDK
import { db } from '../../src/app/firebase/firebaseAdmin';  // Use Admin SDK, not Client SDK
import { getAuth } from 'firebase-admin/auth';  // Use Admin SDK auth

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { uid, role, userId, planId } = req.body;

    console.log("Received POST request:", { uid, role, userId, planId });

    try {
      const adminAuth = getAuth();  // Use Firebase Admin SDK for auth
      const userRecord = await adminAuth.getUser(uid);

      // Verify admin status
      if (!userRecord.customClaims || userRecord.customClaims.admin !== true) {
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
        const userDoc = db.collection('users').doc(uid);  // Correct Admin SDK usage
        await userDoc.update({ role });  // Use `update` instead of `updateDoc`
        console.log(`User ${uid} updated to role ${role}.`);
        return res.status(200).json({ message: `User ${uid} updated to role ${role}.` });
      } catch (error) {
        console.error("Error updating user role:", error);
        return res.status(500).json({ error: "Failed to update user role." });
      }
    }

    // Handle workout plan assignment
    if (userId && planId) {
      try {
        const userWorkoutPlanRef = db.collection('users').doc(userId).collection('workoutPlans').doc(planId);  // Reference to user's workout plan
        const workoutPlanRef = db.collection('workoutPlans').doc(planId);  // Reference to the workout plan

        const workoutPlanSnapshot = await workoutPlanRef.get();
        if (!workoutPlanSnapshot.exists) {  // Check if the workout plan exists
          return res.status(404).json({ error: "Workout plan not found." });
        }

        // Ensure 'name' field is used
        const workoutData = workoutPlanSnapshot.data();

        const existingPlan = await userWorkoutPlanRef.get();
        if (existingPlan.exists) {  // Check if the workout plan is already assigned
          return res.status(400).json({ error: "Workout plan already assigned to this user." });
        }

        // Assign workout plan
        await userWorkoutPlanRef.set({
          ...workoutData,
          assignedAt: new Date(), // Store the date and time of assignment
          assignedBy: uid, // Store the admin UID
          planName: workoutData.name || "Unnamed Plan", // Use the 'name' field from the workout plan
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
      const usersCollection = db.collection('users');  // Correct Admin SDK usage
      const snapshot = await usersCollection.get();
      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
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
