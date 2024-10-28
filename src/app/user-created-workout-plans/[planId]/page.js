"use client"; // Mark as a Client Component

import { useEffect, useState } from 'react';
import { db, auth } from '@/app/firebase/firebase'; // Import Firestore and auth
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function UserCreatedWorkoutPlanPage({ params }) {
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchWorkoutPlan = async () => {
      try {
        const user = auth.currentUser;
        const { planId } = await params;

        if (user && planId) {
          const docRef = doc(db, 'users', user.uid, 'createdWorkoutPlans', planId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
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
  }, [params]);

  // Delete function
  const handleDelete = async () => {
    try {
      const user = auth.currentUser;
      const { planId } = await params;

      if (user && planId) {
        const docRef = doc(db, 'users', user.uid, 'createdWorkoutPlans', planId);
        await deleteDoc(docRef);
        alert("Workout plan deleted successfully!");

        // Redirect to the create workout plan page after deletion
        router.push('/create-workout-plan');
      }
    } catch (error) {
      console.error("Error deleting workout plan:", error);
      alert("Failed to delete the workout plan.");
    }
  };

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
      <button onClick={handleDelete} style={{ marginTop: '20px', color: 'red' }}>
        Delete Workout Plan
      </button>
    </div>
  );
}
