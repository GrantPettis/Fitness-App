"use client";  // Ensure the component is treated as a Client Component

import Image from 'next/image';  // Import Next.js Image component
import styles from "./page.module.css";
import Link from 'next/link';
import logoImg from '@/app/assets/Logo.PNG';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, getAuth } from 'firebase/auth';  // No signOut import needed now
import { auth } from './firebase/firebase';  // Correct path to firebase.js

export default function Home() {
  const [user, setUser] = useState(null); // State to store user info
  const [isAdmin, setIsAdmin] = useState(false); // State to check if user is an admin
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const auth = getAuth();

    // Listen for changes in the authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // If user is signed in, set user data
        setUser(user);
        
        // Check if user has admin claims
        user.getIdTokenResult().then(idTokenResult => {
          if (idTokenResult.claims.admin) {
            setIsAdmin(true); // User is an admin
          }
        });
      } else {
        // If no user is signed in, set user to null
        setUser(null);
        setIsAdmin(false); // Reset admin state
      }
      setLoading(false);  // Authentication check completed
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, []);

  return (
    <div className={styles.page}>
      {/* Move welcome message to the top */}
      <div className={styles.header}>
        {!loading && user && (
          <>
            <p>Welcome, {user.displayName ? user.displayName : user.email}!</p>
            {isAdmin ? <p>You are on the Admin Dashboard.</p> : <p>You are on the User Dashboard.</p>}
          </>
        )}
      </div>

      <main className={styles.main}>
        <ol>
          <Image className={styles.home} src={logoImg} alt='UBM logo' />
          <p className={styles.page}>Change Your Life, One Step At A Time</p>
        </ol>

        <div className={styles.ctas}>
          {/* Remove the sign-in button from the main page */}
          {/* The button for signing in is not displayed anymore */}
        </div>
      </main>

      <footer className={styles.footer}>
      </footer>
    </div>
  );
}
