/*Page for User to see the progress tracking results they have entered */
"use client"; 

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'; // Import to handle query parameters
import { getAuth } from 'firebase/auth';
import { db } from '../../firebase/firebase'; // Import Firebase config
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'; // Import Firestore functions
import style from '@/app/components/exercise-item.module.css'
import dropdown from '@/app/components/dropdown-menu.module.css'
import grid from '@/app/components/exercise-grid.module.css'

const ProgressResults = () => {
  const [progressData, setProgressData] = useState([]);
  const searchParams = useSearchParams(); // Hook to get query parameters
  const category = searchParams.get('category') || 'All'; // Get 'category' query param
  const date = searchParams.get('date') || 'All'; // Get 'date' query param

  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (currentUser) {
      const userId = currentUser.uid;

      const fetchFilteredProgress = async () => {
        try {
          let progressQuery = collection(db, 'users', userId, 'progress');

          // Apply filtering by category
          if (category !== 'All') {
            progressQuery = query(progressQuery, where('category', '==', category));
          }

          // Apply date range filtering
          if (date === 'Last Week') {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            progressQuery = query(progressQuery, where('date', '>=', oneWeekAgo));
          } else if (date === 'Last Month') {
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            progressQuery = query(progressQuery, where('date', '>=', oneMonthAgo));
          }

          // Order by date
          progressQuery = query(progressQuery, orderBy('date', 'desc'));

          const querySnapshot = await getDocs(progressQuery);
          const progressList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setProgressData(progressList);  // Store filtered progress in state
        } catch (error) {
          console.error("Error fetching filtered progress data: ", error);
        }
      };

      fetchFilteredProgress();
    }
  }, [currentUser, category, date]); // Re-fetch the data when category or date filter changes

  return (
    <>
    <header className={style.headerText} style={{ textAlign: 'center' }}>
        <h1>Your Results</h1>
      </header>
    <div className={grid.exercises}>
      {progressData.length > 0 ? (
        progressData.map((entry, index) => (
          <div key={index}>
            <p className={dropdown.title}> <b>Exercise: </b> {entry.exercise}</p>
            <p className={dropdown.title}> <b>Category: </b> {entry.category}</p>
            <p className={dropdown.title}> <b>{entry.valueType}:</b> {entry.value} {entry.unit}</p>
            {entry.sets && <p  className={dropdown.title}><b>Sets: </b>  {entry.sets}</p>}
            {entry.reps && <p  className={dropdown.title}> <b>Reps: </b>  {entry.reps}</p>}
            <p  className={dropdown.title}> <b>Goal {entry.valueType}: </b>  {entry.goalValue} {entry.unit}</p>
            {entry.goalSets && <p  className={dropdown.title}> <b>Goal Sets: </b>  {entry.goalSets}</p>}
            {entry.goalReps && <p  className={dropdown.title}> <b>Goal Reps: </b>  {entry.goalReps}</p>}
            {entry.goalWeight && <p  className={dropdown.title}> <b>Goal Body Weight: </b>  {entry.goalWeight} {entry.unit}</p>}
            <p  className={dropdown.title}> <b> Date: </b>  {new Date(entry.date.seconds * 1000).toLocaleDateString()}</p>
          </div>
        ))
      ) : (
        <p>No progress found for the selected filters.</p>
      )}
    </div>
    </>
  );
};

export default ProgressResults;
