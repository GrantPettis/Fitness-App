"use client"; // This should be the first line in your file

import { useEffect, useState } from 'react';
import { auth, db } from '../firebase/firebase'; // Import Firestore instance
import { collection, getDocs } from 'firebase/firestore'; // Firestore methods
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Import Next.js Link for navigation

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // State to check if user is admin
  const [workoutPlans, setWorkoutPlans] = useState([]); // State for storing user's workout plans
  const [loadingPlans, setLoadingPlans] = useState(true); // Loading state for workout plans
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user); // User is signed in
        const token = await user.getIdTokenResult(); // Get the token to check claims
        setIsAdmin(token.claims.isAdmin || false); // Set admin status based on claims
        fetchWorkoutPlans(user.uid); // Fetch workout plans for the logged-in user
      } else {
        router.push('/'); // Redirect to home if no user
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, [router]);

  // Fetch the workout plans assigned to the logged-in user
  const fetchWorkoutPlans = async (userId) => {
    try {
      const workoutPlansRef = collection(db, 'users', userId, 'workoutPlans'); // Reference to user's workout plans
      const querySnapshot = await getDocs(workoutPlansRef);
      const plansData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        planName: doc.data().planName || "Unnamed Plan" // Use planName or default to "Unnamed Plan"
      }));

      setWorkoutPlans(plansData); // Set workout plans in state
      setLoadingPlans(false); // Set loading to false once fetched
    } catch (error) {
      console.error("Error fetching workout plans:", error);
      setLoadingPlans(false); // Stop loading if there's an error
    }
  };

  const handlePlanChange = (e) => {
    const selectedId = e.target.value;
    if (selectedId) {
      router.push(`/workout-plans/${selectedId}`); // Redirect to the selected workout plan details page
    }
  };

  if (!user) {
    return <p>Loading...</p>; // Display loading text for authentication
  }

  if (loadingPlans) {
    return <p>Loading workout plans...</p>; // Display loading text for workout plans
  }

  // Extract the first name from the email
  const firstName = user.email.split('@')[0].charAt(0).toUpperCase() + user.email.split('@')[0].slice(1);

  // Function to handle navigation
  const handleNavigation = (path) => {
    router.push(path); 
  };

  return (
    <div>
      <h1>User Dashboard</h1>
      <p>Welcome, {firstName}!</p> {/* Display the first name only */}

      {isAdmin && (
        <div>
          <p>You are an Admin.</p>
          <button onClick={() => handleNavigation('/admin-dashboard')}>Go to Admin Dashboard</button> {/* Link to Admin Dashboard */}
        </div>
      )}

      <h2>Your Assigned Workout Plans</h2>
      <select onChange={handlePlanChange} defaultValue="">
        <option value="">Select a workout plan</option>
        {workoutPlans.map(plan => (
          <option key={plan.id} value={plan.id}>{plan.planName}</option>
        ))}
      </select>
    </div>
  );
}
