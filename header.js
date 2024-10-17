"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { auth } from '@/app/firebase/firebase';  // Import Firebase auth instance
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import logoImg from '@/app/assets/Logo.PNG';
import classes from '@/app/components/main-header.module.css';
import MainHeaderBackground from '@/app/components/main-header-background';

export default function Header() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Listen for changes in authentication state
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);  // User is signed in
      } else {
        setUser(null);  // User is signed out
      }
    });

    // Cleanup listener when the component unmounts
    return () => unsubscribe();
  }, []);

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');  // Redirect to homepage after sign out
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      <MainHeaderBackground />
      <header className={classes.header}>
        <Link className={classes.logo} href="/">
          <Image src={logoImg} alt='UBM logo' priority />
        </Link>

        <nav className={classes.nav}>
          <ul>
            <li>
              <Link href="/exercises">Browse Exercises</Link>
            </li>
            <li>
              <Link href="/progress_tracking">Track Your Progress</Link>
            </li>
            <li>
              <Link href="/workout_plan">Workout Plans</Link>
            </li>
            <li>
              <Link href="/contact">Contact Us</Link>
            </li>
            {user ? (
              <li>
                <button onClick={handleSignOut} className={classes.signOutButton}>
                  Sign Out
                </button>
              </li>
            ) : (
              <li>
                <Link href="/sign_in">Sign In</Link>
              </li>
            )}
          </ul>
        </nav>
      </header>
    </>
  );
}
