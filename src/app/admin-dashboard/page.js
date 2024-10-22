"use client"; // This should be the first line in your file

import { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase/firebase'; 
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]); // State for managing users
  const [workoutPlans, setWorkoutPlans] = useState([]); // State for managing workout plans
  const [selectedUser, setSelectedUser] = useState(''); // State for selected user
  const [selectedPlan, setSelectedPlan] = useState(''); // State for selected workout plan
  const [isAdmin, setIsAdmin] = useState(false); // State to check if the user is an admin
  const [loading, setLoading] = useState(true); // Loading state
  const [feedback, setFeedback] = useState(''); // Feedback messages

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const token = await user.getIdTokenResult();
        if (token.claims.admin) {
          setIsAdmin(true);
          setUser(user);
          fetchUsers();  
          fetchWorkoutPlans(); // Fetch workout plans for selection
        } else {
          router.push('/user-dashboard'); // Redirect to user dashboard if not admin
        }
      } else {
        router.push('/'); // Redirect if no user is signed in
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
      fetchUsers(); // Refresh the user list
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
          name: formatSlugToName(data.name || doc.id) // Use the name field or slug
        };
      });
      setWorkoutPlans(plansData); // Save fetched plans to state
    } catch (error) {
      console.error("Error fetching workout plans:", error);
    }
  };

  const formatSlugToName = (slug) => {
    return slug
      .replace(/-/g, ' ')  // Replace hyphens with spaces
      .replace(/\bFree\b/g, '') // Remove the word 'Free' (case-insensitive)
      .replace(/\s+/g, ' ') // Remove any extra spaces
      .trim() // Remove leading and trailing spaces
      .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize the first letter of each word
  };

  const assignWorkoutPlan = async () => {
    if (!selectedUser || !selectedPlan) {
      setFeedback("Please select both a user and a workout plan.");
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
          uid: user.uid // Admin's UID
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

  // Extract the first name from the email
  const firstName = user.email.split('@')[0].charAt(0).toUpperCase() + user.email.split('@')[0].slice(1);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {firstName}!</p> {/* Display the first name only */}
      <p>Total Users: {users.length}</p> {/* Display total users */}

      {/* Button to navigate to the users list */}
      <button onClick={() => router.push('/admin-dashboard/users/usersList')}>
        View Users
      </button>

      {feedback && <p>{feedback}</p>} 

      {/* Assign Workout Plans */}
      <h2>Assign Workout Plans</h2>
      <div>
        <label>Select User:</label>
        <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
          <option value="">Select a user</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>{user.email}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Select Workout Plan:</label>
        <select value={selectedPlan} onChange={(e) => setSelectedPlan(e.target.value)}>
          <option value="">Select a plan</option>
          {workoutPlans.map((plan) => (
            <option key={plan.id} value={plan.id}>{plan.name}</option>
          ))}
        </select>
      </div>

      <button onClick={assignWorkoutPlan}>Assign Plan</button>
    </div>
  );
}
