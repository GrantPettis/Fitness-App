"use client"; // Mark this as a Client Component

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import { db, auth } from '../firebase/firebase'; // Import Firebase auth and db instances
import { collection, addDoc, getDocs } from 'firebase/firestore';
import dropdown from '@/app/components/input-field.module.css';

export default function CreateWorkoutPlan() {
  const router = useRouter(); // Initialize useRouter
  const [planName, setPlanName] = useState('');
  const [exercises, setExercises] = useState([{ name: '', sets: '', reps: '' }]);
  const [userCreatedPlans, setUserCreatedPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState('');

  // Fetch user-created workout plans when the component mounts
  useEffect(() => {
    const fetchUserCreatedPlans = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userWorkoutPlansRef = collection(db, `users/${user.uid}/createdWorkoutPlans`);
          const snapshot = await getDocs(userWorkoutPlansRef);
          const plans = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setUserCreatedPlans(plans);
        } catch (error) {
          console.error("Error fetching user-created plans: ", error);
        }
      }
    };
    fetchUserCreatedPlans();
  }, []);

  const handleExerciseChange = (index, e) => {
    const newExercises = [...exercises];
    newExercises[index][e.target.name] = e.target.value;
    setExercises(newExercises);
  };

  const addExercise = () => {
    setExercises([...exercises, { name: '', sets: '', reps: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get the current user
    const user = auth.currentUser;

    if (user) {
      try {
        // Use the user's UID to save the workout plan under their document in the `createdWorkoutPlans` subcollection
        const userWorkoutPlansRef = collection(db, `users/${user.uid}/createdWorkoutPlans`);
        await addDoc(userWorkoutPlansRef, {
          planName,
          exercises,
          createdAt: new Date(), // Add created date
        });

        // Reset form after submission
        setPlanName('');
        setExercises([{ name: '', sets: '', reps: '' }]);
        alert('Workout plan saved!');

        // Redirect to the workout plans page after saving
        router.push('/workout-plans');
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    } else {
      console.error("No user is currently logged in.");
      alert("You must be logged in to create a workout plan.");
    }
  };

  const handlePlanChange = (e) => {
    setSelectedPlan(e.target.value);
    if (e.target.value) {
      router.push(`/user-created-workout-plans/${e.target.value}`);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Create Workout Plan</h1>
        <input 
          type="text" 
          value={planName} 
          onChange={(e) => setPlanName(e.target.value)} 
          placeholder="Workout Plan Name" 
          required 
        />
        {exercises.map((exercise, index) => (
          <div key={index}>
            <input 
              type="text" 
              name="name" 
              value={exercise.name} 
              onChange={(e) => handleExerciseChange(index, e)} 
              placeholder="Exercise Name" 
              required 
            />
            <input 
              type="text" 
              name="sets" 
              value={exercise.sets} 
              onChange={(e) => handleExerciseChange(index, e)} 
              placeholder="Sets" 
              required 
            />
            <input 
              type="text" 
              name="reps" 
              value={exercise.reps} 
              onChange={(e) => handleExerciseChange(index, e)} 
              placeholder="Reps" 
              required 
            />
          </div>
        ))}
        <button 
          type="button" 
          onClick={addExercise} 
          style={{ marginBottom: '10px', marginRight: '10px' }} // Adds space below and to the right
        >
          Add Another Exercise
        </button>
        <button 
          type="submit" 
          style={{ marginBottom: '10px' }} // Adds space below the button
        >
          Save Workout Plan
        </button>
      </form>

      {/* Dropdown filter for user-created workout plans */}
      <div>
        <h1 className={dropdown.title} style={{ display: 'inline', padding: '2px' }}>Your Workout Plans:</h1>
        <select
          className={dropdown.nav}
          id="user-workout-plan-select"
          value={selectedPlan}
          onChange={handlePlanChange}
          style={{ marginTop: '10px' }} // Adds space above the dropdown
        >
          <option value="">--Select a Plan--</option>
          {userCreatedPlans.map((plan) => (
            <option key={plan.id} value={plan.id}>
              {plan.planName}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
