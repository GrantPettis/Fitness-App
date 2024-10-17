"use client";  // This should be the first line in your file

import { useEffect, useState } from 'react';
import { auth } from '../firebase/firebase';  
import { useRouter } from 'next/navigation';

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // State to check if user is admin
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        const token = await user.getIdTokenResult(); // Get the token to check claims
        setIsAdmin(token.claims.isAdmin || false); // Set admin status based on claims
      } else {
        router.push('/'); // Redirect to home if no user
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, [router]);

  if (!user) {
    return <p>Loading...</p>; // Display loading text
  }

  // Function to handle navigation
  const handleNavigation = (path) => {
    router.push(path); 
  };

  return (
    <div>
      <h1>User Dashboard</h1>
      <p>Welcome, {user.email}!</p>

      {isAdmin && (
        <div>
          <p>You are an Admin.</p>
          <button onClick={() => handleNavigation('/admin-dashboard')}>Go to Admin Dashboard</button> {/* Link to Admin Dashboard */}
        </div>
      )}

      <h2>Filter Menu</h2>
      <button onClick={() => handleNavigation('/exercises')}>Exercises</button>
      <button onClick={() => handleNavigation('/workout-plans')}>Workout Plans</button>
      <button onClick={() => handleNavigation('/progress-tracking')}>Track Your Progress</button>
    </div>
  );
}
