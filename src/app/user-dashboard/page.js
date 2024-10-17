"use client";

import { useEffect, useState } from 'react';
import { auth } from '../firebase/firebase';  // Firebase auth
import { useRouter } from 'next/navigation';

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        router.push('/');
      }
    });
  }, [router]);

  if (!user) {
    return <p>Loading...</p>;
  }

  // Function to handle navigation
  const handleNavigation = (path) => {
    router.push(path);  // Redirect to the selected page
  };

  return (
    <div>
      <h1>User Dashboard</h1>
      <p>Welcome, {user.email}!</p>

      <h2>Filter Menu</h2>
      <button onClick={() => handleNavigation('/exercises')}>Exercises</button>
      <button onClick={() => handleNavigation('/workout-plans')}>Workout Plans</button>
      <button onClick={() => handleNavigation('/progress-tracking')}>Track Your Progress</button>
    </div>
  );
}
