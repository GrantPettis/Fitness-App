// Import the Firebase Admin SDK
import { db } from '../../src/app/firebase/firebaseAdmin';  // Use Admin SDK, not Client SDK
import { getAuth } from 'firebase-admin/auth';  // Use Admin SDK auth

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { uid, role, userId, planId } = req.body;

    try {
      const adminAuth = getAuth();
      const userRecord = await adminAuth.getUser(uid);

      if (!userRecord.customClaims || userRecord.customClaims.admin !== true) {
        return res.status(403).json({ error: 'Not authorized. Only admins can perform this action.' });
      }
    } catch (error) {
      console.error('Error verifying admin status:', error);
      return res.status(500).json({ error: 'Failed to verify admin status.' });
    }

    if (userId && planId) {
      try {
        const userWorkoutPlanRef = db.collection('users').doc(userId).collection('workoutPlans').doc(planId);
        const workoutPlanRef = db.collection('workoutPlans').doc(planId);

        const workoutPlanSnapshot = await workoutPlanRef.get();
        if (!workoutPlanSnapshot.exists) {
          return res.status(404).json({ error: "Workout plan not found." });
        }

        const workoutData = workoutPlanSnapshot.data();

        // Check if `name` or `planName` exists; fallback to a readable slug if both are missing.
        const planName = workoutData.name || workoutData.planName || formatSlugToName(workoutData.slug);
        const slug = workoutData.slug || planId;

        await userWorkoutPlanRef.set({
          ...workoutData,
          assignedAt: new Date(),
          assignedBy: uid,
          planName: planName,
          slug: slug,
        });

        console.log(`Workout plan ${planId} assigned to user ${userId}. Plan name: ${planName}, Slug: ${slug}`);
        return res.status(200).json({ message: `Workout plan ${planId} assigned to user ${userId}.` });
      } catch (error) {
        console.error("Error assigning workout plan:", error);
        return res.status(500).json({ error: "Failed to assign workout plan." });
      }
    }

    return res.status(400).json({ error: "Invalid request. Provide either uid and role, or userId and planId." });
  } else if (req.method === 'GET') {
    try {
      const usersCollection = db.collection('users');
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

// Helper function to format slug into readable name
function formatSlugToName(slug) {
  return slug
    .replace(/-/g, ' ')        // Replace hyphens with spaces
    .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize each word
}
