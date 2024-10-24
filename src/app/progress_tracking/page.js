"use client"; // Ensure this is a client-side component

import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase/firebase';  // Import `db` from your firebase config
import { collection, addDoc, getDocs, query, where, orderBy, doc, deleteDoc, updateDoc } from 'firebase/firestore';  // Import Firestore functions
import { useRouter } from 'next/navigation';  // Import useRouter

const LogProgress = () => {
  const [exercise, setExercise] = useState('');  // New state for exercise
  const [category, setCategory] = useState('Weightlifting');  // Default category
  const [valueType, setValueType] = useState('Weight');
  const [value, setValue] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [goalValue, setGoalValue] = useState('');  // State for goal value
  const [goalSets, setGoalSets] = useState('');  // State for goal sets
  const [goalReps, setGoalReps] = useState('');  // State for goal reps
  const [goalWeight, setGoalWeight] = useState('');  // Optional goal body weight
  const [unit, setUnit] = useState('lbs');  // State for lbs/kg unit
  const [distanceUnit, setDistanceUnit] = useState('miles');  // State for miles/kilometers for swimming and running
  const [goalDistanceUnit, setGoalDistanceUnit] = useState('miles');  // State for goal distance unit
  const [message, setMessage] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');  // Filter by category
  const [dateFilter, setDateFilter] = useState('All');  // Filter by date range
  const [editId, setEditId] = useState(null);  // Track the ID of the entry being edited
  const [progressData, setProgressData] = useState([]);  // State to hold retrieved progress

  const auth = getAuth();
  const currentUser = auth.currentUser;
  const router = useRouter(); // Initialize useRouter

  // Handle filter submit and navigate to progress-results page
  const handleFilterSubmit = () => {
    router.push(`/progress_tracking/progress-results?category=${categoryFilter}&date=${dateFilter}`);
  };

  // Submit progress form (handle both add and edit)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      console.log('User not authenticated');
      setMessage('Please sign in to track your progress.');
      return;
    }

    const userId = currentUser.uid;

    try {
      if (editId) {
        // Update existing progress entry
        const docRef = doc(db, 'users', userId, 'progress', editId);
        await updateDoc(docRef, {
          exercise,
          category,
          valueType,
          value,
          sets: valueType === 'Weight' ? sets : '',
          reps: valueType === 'Weight' ? reps : '',
          goalValue,
          goalSets,
          goalReps,
          goalWeight,
          unit,
          distanceUnit,  // Save distance unit (miles or kilometers)
          goalDistanceUnit,  // Save goal distance unit
        });
        setMessage("Progress updated successfully!");
        setEditId(null);  // Reset edit state
      } else {
        // Add new progress entry
        await addDoc(collection(db, 'users', userId, 'progress'), {
          exercise,
          category,
          valueType,
          value,
          sets: valueType === 'Weight' ? sets : '',
          reps: valueType === 'Weight' ? reps : '',
          goalValue,
          goalSets,
          goalReps,
          goalWeight,
          unit,
          distanceUnit,  // Save distance unit (miles or kilometers)
          goalDistanceUnit,  // Save goal distance unit
          date: new Date(),
        });
        setMessage("Progress added successfully!");
      }

      setExercise('');
      setCategory('Weightlifting');
      setValue('');
      setSets('');
      setReps('');
      setGoalValue('');
      setGoalSets('');
      setGoalReps('');
      setGoalWeight('');
      setUnit('lbs');  // Reset unit
      setDistanceUnit('miles');  // Reset distance unit
      setGoalDistanceUnit('miles');  // Reset goal distance unit
    } catch (error) {
      console.error("Error saving progress: ", error);
      setMessage("Error saving progress. Please try again.");
    }
  };

  // Handle deleting progress entry
  const handleDelete = async (id) => {
    if (!currentUser) return;

    const userId = currentUser.uid;
    try {
      await deleteDoc(doc(db, 'users', userId, 'progress', id));
      setMessage("Progress deleted successfully!");
    } catch (error) {
      console.error("Error deleting progress: ", error);
      setMessage("Error deleting progress. Please try again.");
    }
  };

  // Handle editing progress entry (load data into form)
  const handleEdit = (entry) => {
    setExercise(entry.exercise);
    setCategory(entry.category);
    setValueType(entry.valueType);
    setValue(entry.value);
    setSets(entry.sets || '');
    setReps(entry.reps || '');
    setGoalValue(entry.goalValue || '');
    setGoalSets(entry.goalSets || '');
    setGoalReps(entry.goalReps || '');
    setGoalWeight(entry.goalWeight || '');
    setUnit(entry.unit || 'lbs');
    setDistanceUnit(entry.distanceUnit || 'miles');
    setGoalDistanceUnit(entry.goalDistanceUnit || 'miles');
    setEditId(entry.id);  // Track the entry being edited
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Exercise:</label>
          <input
            type="text"
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
            placeholder="Enter exercise (e.g., Bench Press)"
          />
        </div>

        <div>
          <label>Category:</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Weightlifting">Weightlifting</option>
            <option value="Running">Running</option>
            <option value="Swimming">Swimming</option>
          </select>
        </div>

        <div>
          <label>Value Type:</label>
          <select value={valueType} onChange={(e) => setValueType(e.target.value)}>
            <option value="Weight">Weight</option>
            <option value="Distance">Distance</option>
            <option value="Time">Time</option>
          </select>
        </div>

        <div>
          <label>{valueType}:</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={valueType === 'Weight' ? 'Enter weight' : `Enter ${valueType.toLowerCase()}`}
          />
        </div>

        {/* Unit selector for weight */}
        {valueType === 'Weight' && (
          <div>
            <label>Unit:</label>
            <select value={unit} onChange={(e) => setUnit(e.target.value)}>
              <option value="lbs">lbs</option>
              <option value="kg">kg</option>
            </select>
          </div>
        )}

        {/* Distance Unit selector for running/swimming */}
        {valueType === 'Distance' && (category === 'Running' || category === 'Swimming') && (
          <div>
            <label>Distance Unit:</label>
            <select value={distanceUnit} onChange={(e) => setDistanceUnit(e.target.value)}>
              <option value="miles">Miles</option>
              <option value="kilometers">Kilometers</option>
            </select>
          </div>
        )}

        {valueType === 'Weight' && (
          <>
            <div>
              <label>Sets:</label>
              <input
                type="number"
                value={sets}
                onChange={(e) => setSets(e.target.value)}
                placeholder="Enter sets"
              />
            </div>

            <div>
              <label>Reps:</label>
              <input
                type="number"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                placeholder="Enter reps"
              />
            </div>
          </>
        )}

        <div>
          <label>Goal {valueType}:</label>
          <input
            type="number"
            value={goalValue}
            onChange={(e) => setGoalValue(e.target.value)}
            placeholder={`Enter goal ${valueType}`}
          />
        </div>

        {/* Goal Distance Unit selector for running/swimming */}
        {valueType === 'Distance' && (category === 'Running' || category === 'Swimming') && (
          <div>
            <label>Goal Distance Unit:</label>
            <select value={goalDistanceUnit} onChange={(e) => setGoalDistanceUnit(e.target.value)}>
              <option value="miles">Miles</option>
              <option value="kilometers">Kilometers</option>
            </select>
          </div>
        )}

        {valueType === 'Weight' && (
          <>
            <div>
              <label>Goal Sets:</label>
              <input
                type="number"
                value={goalSets}
                onChange={(e) => setGoalSets(e.target.value)}
                placeholder="Enter goal sets"
              />
            </div>

            <div>
              <label>Goal Reps:</label>
              <input
                type="number"
                value={goalReps}
                onChange={(e) => setGoalReps(e.target.value)}
                placeholder="Enter goal reps"
              />
            </div>
          </>
        )}

        <div>
          <label>Goal Body Weight (optional):</label>
          <input
            type="number"
            value={goalWeight}
            onChange={(e) => setGoalWeight(e.target.value)}
            placeholder="Enter goal body weight"
          />
        </div>

        <button type="submit">{editId ? "Update Progress" : "Submit Progress"}</button>
      </form>
      {message && <p>{message}</p>}

      <div>
        <label>Filter by Category:</label>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="All">All</option>
          <option value="Weightlifting">Weightlifting</option>
          <option value="Running">Running</option>
          <option value="Swimming">Swimming</option>
        </select>
      </div>

      <div>
        <label>Filter by Date:</label>
        <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
          <option value="All">All Time</option>
          <option value="Last Week">Last Week</option>
          <option value="Last Month">Last Month</option>
        </select>
      </div>

      <button onClick={handleFilterSubmit}>Submit Filter</button> {/* Submit Filter Button */}
    </div>
  );
};

export default LogProgress;
