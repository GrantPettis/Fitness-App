"use client"; // Mark this as a Client Component

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase'; // Adjust path to your Firebase config
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import style from '@/app/components/exercise-item.module.css'


export default function WorkoutPlanDetails() {
  const { planName } = useParams();
  const [planDetails, setPlanDetails] = useState(null);
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

  // Organize exercises based on the plan name
  let organizedExercises = {};

  if (planName === '15-min-full-workouts') {
    // Group by category
    organizedExercises = planDetails.exercises.reduce((acc, exercise) => {
      const { category } = exercise;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(exercise);
      return acc;
    }, {});
  } else if (planName === 'building-speed-and-power-free-plan') {
    // Group by day
    organizedExercises = planDetails.exercises.reduce((acc, exercise) => {
      const { day } = exercise; // Assuming 'day' exists in your exercise data
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(exercise);
      return acc;
    }, {});
  } else if (planName === 'general-health-free-plan' || planName === 'no-equipment-free-plan') {
    // Use as is for General Health and No Equipment Free Plans
    organizedExercises = planDetails.exercises.reduce((acc, exercise) => {
      const { day } = exercise; // Grouping by day for these plans
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(exercise);
      return acc;
    }, {});
  }

  // Ensure organizedExercises has keys
  if (!organizedExercises || typeof organizedExercises !== 'object') {
    return <p>No exercises found for this plan.</p>;
  }

  return (
    <div>
      <header className={style.headerText} style={{ textAlign: 'center' }}>
      <h1>{planDetails.planName}</h1>
        </header>
      <button onClick={() => router.push('/create-workout-plan')}>
        Create New Workout Plan
      </button>
      {planName === '15-min-full-workouts'
        ? Object.keys(organizedExercises).map((key) => (
            <div key={key}>
              <h2>{key}</h2> {/* This is the category */}
              <ul>
                {organizedExercises[key].map((exercise, index) => (
                  <li key={index}>
                    <strong>{exercise.name}</strong> <br />
                    Sets: {exercise.sets} <br />
                    Reps: {exercise.reps} <br />
                    Primary Muscle: {exercise.primaryMuscle} <br />
                    Adaptation: {exercise.adaptation} <br />
                    <a href={exercise.videoURL} target="_blank" rel="noopener noreferrer">Watch Video</a>
                  </li>
                ))}
              </ul>
            </div>
          ))
        : Object.keys(organizedExercises).map((key) => (
            <div key={key}>
              <h2>Exercises for {key}</h2>
              <ul>
                {organizedExercises[key].map((exercise, index) => (
                  <li key={index}>
                    <strong>{exercise.name}</strong> <br />
                    Sets: {exercise.sets} <br />
                    Reps: {exercise.reps} <br />
                    Primary Muscle: {exercise.primaryMuscle} <br />
                    Adaptation: {exercise.adaptation} <br />
                    <a href={exercise.videoURL} target="_blank" rel="noopener noreferrer">Watch Video</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
    </div>
  );
}
