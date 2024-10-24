"use client";  // Ensure it's a Client Component

import { useState } from 'react';
import { signInWithEmailAndPassword, getIdTokenResult, setPersistence, browserLocalPersistence } from 'firebase/auth';
import Link from 'next/link';  // Import Link from Next.js for navigation
import { useRouter } from 'next/navigation';
import { auth } from '../firebase/firebase';  // Import the initialized auth from firebase.js
import form from '@/app/components/text-form-field.module.css'
import button from '@/app/components/workout-plan-button.module.css'
import style from '@/app/components/exercise-item.module.css'

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Set the authentication persistence to local so users stay logged in across sessions
      await setPersistence(auth, browserLocalPersistence);

      // Sign in the user with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log('Sign-in successful:', user);

      // Force a token refresh to get the latest claims
      const idTokenResult = await getIdTokenResult(user, true);
      console.log('idTokenResult.claims:', idTokenResult.claims);  // Log the claims for debugging

      // Corrected claim check
      if (idTokenResult.claims.admin) {
        console.log('User is an admin');
        router.push('/admin-dashboard');  // Redirect to admin dashboard if user is an admin
      } else {
        console.log('User is not an admin');
        router.push('/user-dashboard');  // Redirect to user dashboard if user is not an admin
      }

    } catch (error) {
      console.error('Error during sign-in:', error);
      // Provide a more specific error message to the user
      alert('Sign-in failed. Please check your credentials and try again.');
    }
  };

  return (
    <div className="sign-in-container">
      <header className={style.headerText} style={{ textAlign: 'center' }}>
        <h1>Sign In</h1>
      </header>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            className={form.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            className={form.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className={button.button} type="submit">Sign In</button>
      </form>

      <p>
        Don’t have an account?{' '}
        <Link href="/sign_up" style = {{color: '#0000EE'}} > <u>Sign Up </u></Link>  {/* Link to the Sign-Up page */}
      </p>
    </div>
  );
}
