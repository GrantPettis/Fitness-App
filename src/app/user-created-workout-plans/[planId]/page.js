"use client"; // Mark as a Client Component

import { useEffect, useState } from 'react';
import { db, auth } from '@/app/firebase/firebase'; // Import Firestore and auth
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function UserCreatedWorkoutPlanPage({ params }) {
  const { planId } = params; // Get the planId from the URL params
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchWorkoutPlan = async () => {
      try {
        // Check if the user is logged in
        const user = auth.currentUser;
        if (user && planId) {
          console.log(`Fetching workout plan for user: ${user.uid}, planId: ${planId}`); // Debugging log

          const docRef = doc(db, 'users', user.uid, 'createdWorkoutPlans', planId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            console.log("Workout plan data: ", docSnap.data()); // Debugging log
            setWorkoutPlan(docSnap.data());
          } else {
            console.error("No such document found in Firestore!");
          }
        } else {
          console.error("No user is logged in or planId is missing.");
        }
      } catch (error) {
        console.error("Error fetching workout plan:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutPlan();
  }, [planId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!workoutPlan) {
    return <p>No workout plan found.</p>;
  }

  return (
    <div>
      <h1>{workoutPlan.planName}</h1>
      <h2>Exercises</h2>
      <ul>
        {workoutPlan.exercises.map((exercise, index) => (
          <li key={index}>
            <strong>{exercise.name}</strong> <br />
            Sets: {exercise.sets} <br />
            Reps: {exercise.reps} <br />
          </li>
        ))}
      </ul>
    </div>
  );
}
