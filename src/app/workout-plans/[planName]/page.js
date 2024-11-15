"use client"; // Mark this as a Client Component

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase'; // Adjust path to your Firebase config
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import style from '@/app/components/exercise-item.module.css'
import dropdown from '@/app/components/dropdown-menu.module.css'
import button from '@/app/components/workout-plan-button.module.css'
import grid from '@/app/components/exercise-grid.module.css'


export default function WorkoutPlanDetails() {
  const { planName } = useParams();
  const [planDetails, setPlanDetails] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(""); // For both day and category selection
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    if (planName) {
      const fetchPlanDetails = async () => {
        try {
          const docRef = doc(db, 'workoutPlans', planName);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setPlanDetails(docSnap.data());
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching plan details: ", error);
        }
      };
      fetchPlanDetails();
    }
  }, [planName]);

  if (!planDetails) {
    return <p>Loading plan details...</p>;
  }

  // Organize exercises based on the plan
  let organizedExercises = {};

  if (planName === '15-min-full-workouts') {
    // Group by category (Upper Body, Lower Body, Full Body)
    organizedExercises = planDetails.exercises.reduce((acc, exercise) => {
      const { category } = exercise;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(exercise);
      return acc;
    }, {});
  } else {
    // Group by day for other plans
    organizedExercises = planDetails.exercises.reduce((acc, exercise) => {
      const { day } = exercise;
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(exercise);
      return acc;
    }, {});
  }

  // Dropdown for selecting day or category
  const handleFilterChange = (e) => {
    setSelectedFilter(e.target.value);
  };

  // Filter exercises by selected day or category
  const filteredExercises = selectedFilter ? organizedExercises[selectedFilter] : [];

  return (
    <div>
      <header className={style.headerText} style={{ textAlign: 'center' }}>
      <h1>{planDetails.planName}</h1>
        </header>
        <button 
        className= {button.button}
        onClick={() => router.push('/create-workout-plan')}
        style={{ marginBottom: '15px', textAlign: 'right'}} // Adds space below the button
      >
        Create Workout Plan
      </button>

      {/* Dropdown to select day or category */}
      {Object.keys(organizedExercises).length > 0 && (
        <div>
          <label htmlFor="filterSelect" className={dropdown.title}>Select {planName === '15-min-full-workouts' ? 'Category' : 'Day'}:</label>
          <select id="filterSelect" onChange={handleFilterChange} value={selectedFilter} className={dropdown.nav}>
            <option value="">-- Select {planName === '15-min-full-workouts' ? 'Category' : 'Day'} --</option>
            {Object.keys(organizedExercises).map((filter, index) => (
              <option key={index} value={filter}>{filter}</option>
            ))}
          </select>
        </div>
      )}

      {/* Display exercises for the selected day or category */}
      {selectedFilter && filteredExercises.length > 0 ? (
        <div>
          <ul className={grid.exercises}>
            {filteredExercises.map((exercise, index) => (
              <li key={index}>
                <strong>{exercise.name}</strong> <br />
                Sets: {exercise.sets} <br />
                Reps: {exercise.reps} <br />
                Primary Muscle: {exercise.primaryMuscle} <br />
                Adaptation: {exercise.adaptation} <br />
                <a href={exercise.videoURL} target="_blank" rel="noopener noreferrer"><u>Watch Video</u></a>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        selectedFilter && <p>No exercises found for {selectedFilter}.</p>
      )}
    </div>
  );
}
