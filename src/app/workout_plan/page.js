/* Main workout Plan page */
"use client"; // Mark this as a Client Component

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Use next/navigation for navigation
import { db } from '../firebase/firebase'; // Correct path to Firebase config
import { collection, getDocs } from 'firebase/firestore'; // Firebase Firestore functions
import dropdown from '@/app/components/dropdown-menu.module.css'
import style from '@/app/components/exercise-item.module.css'
import button from '@/app/components/workout-plan-button.module.css'
export default function WorkoutPlanPage() {
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [error, setError] = useState('');  // New state for error messages
  const [loading, setLoading] = useState(true);  // Loading state for better UX
  const router = useRouter();

  // Fetch predefined workout plans from Firebase on page load
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);  // Start loading
        const plansSnapshot = await getDocs(collection(db, 'workoutPlans'));
        const plans = plansSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setWorkoutPlans(plans); // Set the fetched plans
        setError('');  // Clear any previous error
        console.log('Fetched Plans: ', plans); // Debug: log fetched plans
      } catch (error) {
        console.error('Error fetching workout plans: ', error); // Error handling
        setError('Failed to load workout plans. Please try again later.');  // Set a user-friendly error message
      } finally {
        setLoading(false);  // Stop loading regardless of success or failure
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
       <header className={style.headerText} style={{ textAlign: 'center' }}>
            <h1>Workout Plans</h1>
        </header>
      {/* Create Workout Plan button with margin */}
      <button 
        className= {button.button}
        onClick={() => router.push('/create-workout-plan')}
        style={{ marginBottom: '15px', textAlign: 'right'}} // Adds space below the button
      >
        Create Workout Plan
      </button>

      {/* Display loading message */}
      {loading && <p>Loading workout plans...</p>}

      {/* Display error message if something went wrong */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Display no plans available message if workout plans are empty */}
      {!loading && !error && workoutPlans.length === 0 && <p>No workout plans available at the moment.</p>}

      {/* Dropdown filter for workout plans fetched from Firebase */}
      <div>
      <h1 className={dropdown.title} style={{ display: 'inline', padding: '2px' }}>Select a Workout Plan: </h1>
        <select 
          className={dropdown.nav}
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
