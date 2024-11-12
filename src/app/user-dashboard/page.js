"use client";

import { useEffect, useState } from 'react';
import { auth, db } from '../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import style from '@/app/components/exercise-item.module.css';
import dropdown from '@/app/components/dropdown-menu.module.css';
import button from '@/app/components/workout-plan-button.module.css';

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        const token = await user.getIdTokenResult();
        setIsAdmin(token.claims.isAdmin || false);
        fetchWorkoutPlans(user.uid);
      } else {
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const fetchWorkoutPlans = async (userId) => {
    try {
      const workoutPlansRef = collection(db, 'users', userId, 'workoutPlans');
      const querySnapshot = await getDocs(workoutPlansRef);
      const plansData = querySnapshot.docs.map(doc => {
        console.log("Fetched workout plan data:", doc.data());
        return {
          id: doc.id,  // Use document ID as the plan ID
          planName: doc.data().planName || doc.data().slug || "Unnamed Plan",
          slug: doc.data().slug
        };
      });

      setWorkoutPlans(plansData);
      setLoadingPlans(false);
    } catch (error) {
      console.error("Error fetching workout plans:", error);
      setLoadingPlans(false);
    }
  };

  const handlePlanChange = (e) => {
    const selectedSlug = e.target.value;
    if (selectedSlug) {
      router.push(`/workout_plan/${selectedSlug}`); // Navigate using the slug
    }
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  if (loadingPlans) {
    return <p>Loading workout plans...</p>;
  }

  const firstName = user.email.split('@')[0].charAt(0).toUpperCase() + user.email.split('@')[0].slice(1);

  const handleNavigation = (path) => {
    router.push(path); 
  };

  return (
    <>
      <header className={style.headerText} style={{ textAlign: 'center' }}>
        <h1>Welcome, {firstName}!</h1>
      </header>
      <div>
        {isAdmin && (
          <div>
            <p>You are an Admin.</p>
            <button onClick={() => handleNavigation('/admin-dashboard')}>Go to Admin Dashboard</button>
          </div>
        )}

        <h1 className={dropdown.title} style={{ display: 'inline', padding: '2px' }}>Your Assigned Workout Plans:</h1>
        <select className={dropdown.nav} onChange={handlePlanChange} defaultValue="">
          <option value="">Select a workout plan</option>
          {workoutPlans.map(plan => (
            <option key={plan.id} value={plan.slug}>{plan.planName}</option>
          ))}
        </select>

        <h2>Filter Menu</h2>
        <button className={button.button} onClick={() => handleNavigation('/exercises')}>Exercises</button>
        <button className={button.button} onClick={() => handleNavigation('/workout_plan')}>Workout Plans</button>
        <button className={button.button} onClick={() => handleNavigation('/progress_tracking')}>Track Your Progress</button>

        {/* Send Private Message Button */}
        <button
          className={button.button}
          style={{ marginTop: '20px' }}
          onClick={() => window.location.href = 'mailto:manager@example.com?subject=Private%20Message&body=Hello, I have a question...'}
        >
          Send Private Message
        </button>
      </div>
    </>
  );
}
