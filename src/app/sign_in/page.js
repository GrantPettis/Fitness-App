"use client";

import { useState } from 'react';
import Link from 'next/link';  // Import the Link component for navigation

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const signInData = { email, password };

    const response = await fetch('/api/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signInData),
    });

    const result = await response.json();

    if (response.ok) {
      console.log('Sign-in successful:', result);
    } else {
      console.error('Sign-in failed:', result);
    }
  };

  return (
    <div className="sign-in-container">n
      <h1>
        Sign In 
      </h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:
          </label>
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
        <button type="submit">Sign In</button>
      </form>

      <p>
        Don’t have an account?{' '}
        <Link href="/sign_up">Sign Up</Link>  {/* Link to the Sign-Up page */}
      </p>
    </div>
  );
}
