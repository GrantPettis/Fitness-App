"use client";
// src/app/workout_plan/[id]/page.js

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase'; // Adjust the path if necessary

export default function WorkoutPlanDetail() {
  const router = useRouter();
  const { id } = router.query; // Get the plan ID from the URL
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchWorkoutPlan(id); // Fetch workout plan details by ID
    }
  }, [id]);

  const fetchWorkoutPlan = async (planId) => {
    try {
      const planRef = doc(db, 'workoutPlans', planId);
      const planSnapshot = await getDoc(planRef);
      if (planSnapshot.exists()) {
        setWorkoutPlan(planSnapshot.data());
      } else {
        console.log("Workout plan not found.");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching workout plan:", error);
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
      <h1>{workoutPlan.planName || "Unnamed Plan"}</h1> {/* Use planName instead of name */}
      <p>{workoutPlan.description || "No description available."}</p>
      {/* Add more details about the workout plan, like exercises, sets, reps, etc. */}
    </div>
  );
}