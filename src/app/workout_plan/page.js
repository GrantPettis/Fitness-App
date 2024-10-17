"use client"; // Mark this as a Client Component

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Use next/navigation for navigation
import { db } from '../firebase/firebase'; // Correct path to Firebase config
import { collection, getDocs } from 'firebase/firestore'; // Firebase Firestore functions

export default function WorkoutPlanPage() {
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState('');
  const router = useRouter();

  // Fetch predefined workout plans from Firebase on page load
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const plansSnapshot = await getDocs(collection(db, 'workoutPlans'));
        const plans = plansSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setWorkoutPlans(plans); // Set the fetched plans
        console.log('Fetched Plans: ', plans); // Debug: log fetched plans
      } catch (error) {
        console.error('Error fetching workout plans: ', error); // Error handling
      }
    };
    fetchPlans();
  }, []);

  // Handle plan selection and navigate to the plan's page using the slug
  const handlePlanChange = (e) => {
    const selectedSlug = e.target.value;
    console.log('Selected Plan Slug: ', selectedSlug); // Debug: log selected slug

    setSelectedPlan(selectedSlug); // Update selectedPlan state
    if (selectedSlug) {
      router.push(`/workout-plans/${selectedSlug}`); // Navigate using the slug
    }
  };

  return (
    <div>
      <h1>Workout Plan Page</h1>

      {/* Create Workout Plan button with margin */}
      <button
        onClick={() => router.push('/create-workout-plan')}
        style={{ marginBottom: '15px' }} // Adds space below the button
      >
        Create Workout Plan
      </button>

      {/* Dropdown filter for workout plans fetched from Firebase */}
      <div>
        <label htmlFor="workout-plan-select">Choose a workout plan:</label>
        <select
          id="workout-plan-select"
          value={selectedPlan}
          onChange={handlePlanChange}
          style={{ marginTop: '10px' }} // Adds space above the dropdown
        >
          <option value="">--Select a Plan--</option>
          {workoutPlans.map((plan) => (
            <option key={plan.slug} value={plan.slug}>
              {plan.planName} {/* Display the user-friendly plan name */}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
