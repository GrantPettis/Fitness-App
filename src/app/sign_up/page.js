"use client";  // Ensure it's a Client Component

import { useState } from 'react';
import { auth, db } from '../firebase/firebase';  // Import Firebase auth and Firestore instance
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';  // Firestore functions

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Create the user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update the user's profile to include their name
      await updateProfile(user, {
        displayName: name,
      });

      console.log('Sign-up successful:', user);

      // Add the user to Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        name: name,
        role: "User"  // Default role as "User"
      });

      console.log('User added to Firestore:', user.uid);

      // Redirect to the homepage after successful sign-up
      window.location.href = '/';  // Redirect to the homepage
    } catch (error) {
      console.error('Error during sign-up:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="sign-up-container">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}
