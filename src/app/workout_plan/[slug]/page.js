'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';  // Adjust to the correct relative path

export default function WorkoutPlanDetail() {
  const router = useRouter();
  const { slug } = router.query; // Access the slug from router.query

  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ensure the slug is available before trying to fetch the workout plan
    if (slug) {
      fetchWorkoutPlan(slug);
    }
  }, [slug]); // Trigger the effect whenever slug changes

  const fetchWorkoutPlan = async (slug) => {
    try {
      const planRef = doc(db, "workoutPlans", slug);  // Access the workout plan from Firestore
      const planSnapshot = await getDoc(planRef);

      if (planSnapshot.exists()) {
        setWorkoutPlan(planSnapshot.data());
      } else {
        console.log("Workout plan not found.");
      }
    } catch (error) {
      console.error("Error fetching workout plan:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading workout plan...</p>;
  }

  if (!workoutPlan) {
    return <p>Workout plan not found.</p>;
  }

  return (
    <div>
      <h1>{workoutPlan.planName || "Unnamed Plan"}</h1> {/* Render the plan name */}
      <p>{workoutPlan.description || "No description available for this plan."}</p> {/* Render the plan description */}
      {/* Render more details like exercises, sets, reps, etc. */}
    </div>
  );
}
