"use client";

import { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase/firebase'; 
import { useRouter } from 'next/navigation';
import style from '@/app/components/exercise-item.module.css'
import button from '@/app/components/workout-plan-button.module.css'
import dropdown from '@/app/components/dropdown-menu.module.css'

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState('');
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const token = await user.getIdTokenResult();
        if (token.claims.admin) {
          setIsAdmin(true);
          setUser(user);
          fetchUsers();
          fetchWorkoutPlans();
        } else {
          router.push('/user-dashboard');
        }
      } else {
        router.push('/');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const deleteUser = async (userId) => {
    try {
      await deleteDoc(doc(db, "users", userId));
      setFeedback(`User ${userId} deleted successfully.`);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      setFeedback("Error deleting user.");
    }
  };

  const fetchWorkoutPlans = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "workoutPlans"));
      const plansData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || formatSlugToName(doc.id), // Ensure `name` or fallback to slug
          slug: doc.id
        };
      });
      setWorkoutPlans(plansData);
    } catch (error) {
      console.error("Error fetching workout plans:", error);
    }
  };

  const formatSlugToName = (slug) => {
    return slug
      .replace(/-/g, ' ')
      .replace(/\bFree\b/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\b\w/g, char => char.toUpperCase());
  };

  const assignWorkoutPlan = async () => {
    if (!selectedUser || !selectedPlan) {
      setFeedback("Please select both a user and a workout plan.");
      return;
    }
    const selectedPlanData = workoutPlans.find(plan => plan.id === selectedPlan);
    if (!selectedPlanData) {
      setFeedback("Selected workout plan not found.");
      return;
    }

    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: selectedUser,
          planId: selectedPlan,
          uid: user.uid, 
          planName: selectedPlanData.name, // Pass `planName` to API
          slug: selectedPlanData.slug      // Pass `slug` to API
        }),
      });
      const result = await response.json();
      if (result.error) {
        setFeedback(result.error);
      } else {
        setFeedback(`Workout plan assigned successfully to user.`);
      }
    } catch (error) {
      console.error("Error assigning workout plan:", error);
      setFeedback("Error assigning workout plan.");
    }
  };

  if (loading) {
    return <p>Loading...</p>; 
  }

  if (!isAdmin) {
    return <p>Unauthorized access. Redirecting...</p>; 
  }

  const firstName = user.email.split('@')[0].charAt(0).toUpperCase() + user.email.split('@')[0].slice(1);

  return (
    <>
      <header className={style.headerText} style={{ textAlign: 'center' }}>
        <h1>Welcome {firstName}!</h1>
      </header>
      <div>
        <p className={dropdown.title}>Total Users: {users.length}</p>

        <button className={button.button} onClick={() => router.push('/admin-dashboard/users/usersList')}>
          View Users
        </button>

        {feedback && <p>{feedback}</p>} 

        <h2 className={dropdown.title}><u>Assign Workout Plans</u></h2>
        <div>
          <label className={dropdown.title}>Select User:</label>
          <select className={dropdown.nav} value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>{user.email}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={dropdown.title}>Select Workout Plan:</label>
          <select className={dropdown.nav} value={selectedPlan} onChange={(e) => setSelectedPlan(e.target.value)}>
            <option value="">Select a plan</option>
            {workoutPlans.map((plan) => (
              <option key={plan.id} value={plan.id}>{plan.name}</option>
            ))}
          </select>
        </div>

        <button className={button.button} onClick={assignWorkoutPlan}>Assign Plan</button>
      </div>
    </>
  );
}
