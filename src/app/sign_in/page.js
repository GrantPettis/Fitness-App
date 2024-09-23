"use client";  // Add this lin to ensure the component is treated as a client component

import { useState } from 'react';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Collect form data
    const signInData = { email, password };

    // Send POST request to the API
    const response = await fetch('/api/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signInData),
    });

    // Parse the response as JSON
    const result = await response.json();

    // Log the result in the browser console
    if (response.ok) {
      console.log('Sign-in successful:', result);
    } else {
      console.error('Sign-in failed:', result);
    }
  };

  return (
    <div className="sign-in-container">
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}
