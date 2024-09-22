"use client"; // Add this line to declare the component as a Client Component

import { useState } from 'react';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Create the sign-in data object
    const signInData = { email, password };

    // Send the POST request to the backend API (adjust the URL as needed)
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
      // Redirect to a dashboard or show a success message
    } else {
      console.error('Sign-in failed:', result);
      // Handle errors (e.g., display error message)
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
