"use client";  // Add this to mark the component as a Client Component

import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';  // Import Firestore functions
import { db, auth } from '../firebase/firebase';  // Correct path to your Firebase setup
import Link from 'next/link';  // Import Link from Next.js

function AssignWorkoutPlan() {
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if the current user is an admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      const user = auth.currentUser;

      if (user) {
        // Force a token refresh to get updated claims
        const idTokenResult = await user.getIdToken(true); // Set 'true' to force refresh
        if (idTokenResult.claims.admin) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);  // User is not an admin
        }
      }
    };

    checkAdminStatus();
  }, []);

  // Fetch workout plans from Firestore
  useEffect(() => {
    const fetchWorkoutPlans = async () => {
      const workoutPlansCollection = collection(db, 'workoutPlans'); // Correct way to get collection reference
      const plansSnapshot = await getDocs(workoutPlansCollection); // Correct way to fetch documents
      setWorkoutPlans(plansSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchWorkoutPlans();
  }, []);

  const handleAssign = async () => {
    try {
      // Fetch user by email to get their userId
      const usersCollection = collection(db, 'users');
      const q = query(usersCollection, where('email', '==', userEmail));  // Correct use of query and where
      const userSnapshot = await getDocs(q);

      if (userSnapshot.empty) {
        setFeedback('User not found');
        return;
      }

      const userId = userSnapshot.docs[0].id;

      // Make a POST request to your API (admin.js) to assign the workout plan
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: auth.currentUser.uid,  // Admin UID from Firebase auth
          userId,                      // User ID fetched by email
          planId: selectedPlan,         // Selected workout plan
        }),
      });

      if (response.ok) {
        setFeedback('Workout plan assigned successfully');
      } else {
        const data = await response.json();
        setFeedback(data.error);
      }
    } catch (error) {
      console.error('Error assigning workout plan:', error);
      setFeedback('An error occurred');
    }
  };

  // If the user is not an admin, show a message
  if (!isAdmin) {
    return <p>You do not have permission to assign workout plans.</p>;
  }

  return (
    <div>
      <h2>Assign Workout Plan to User</h2>

      {/* Link to Assign Workout Plan */}
      <Link href="/AssignWorkoutPlan">
        <a>Assign Workout Plans</a>
      </Link>
      
      {/* Input for the user's email */}
      <input
        type="email"
        placeholder="Enter user email"
        value={userEmail}
        onChange={(e) => setUserEmail(e.target.value)}
      />

      {/* Dropdown for selecting a workout plan */}
      <select onChange={(e) => setSelectedPlan(e.target.value)} value={selectedPlan}>
        <option value="">Select a workout plan</option>
        {workoutPlans.map(plan => (
          <option key={plan.id} value={plan.id}>
            {plan.name}
          </option>
        ))}
      </select>

      {/* Button to assign the workout */}
      <button onClick={handleAssign}>Assign Plan</button>

      {/* Feedback message */}
      <p>{feedback}</p>
    </div>
  );
}

export default AssignWorkoutPlan;
