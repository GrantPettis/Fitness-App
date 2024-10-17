//changed to .js file using firebase 

// firebaseAdmin.js
import admin from 'firebase-admin';
import serviceAccount from './path-to-your-service-account-key.json'; // make sure this file exists 

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    //databaseURL: 'https://your-firebase-project-id.firebaseio.com' // I dont know if this was necessary
  });
}

const db = admin.firestore();
const auth = admin.auth();

export { db, auth };



// firebaseClient.js
import firebase from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;




// pages/api/admin/dashboard.js
import { auth, db } from '../../../firebaseAdmin';

export default async function handler(req, res) {
  if (req.method === 'GET') {  
    const { userId } = req.headers;

    try {
      // Fetch user info from Firestore
      const userDoc = await db.collection('users').doc(userId).get();
      
      if (!userDoc.exists) {
        return res.status(404).json({ message: 'User not found' });
      }

      const { role } = userDoc.data();

      // Check if the user is an admin
      if (role === 'admin') {
        return res.status(200).json({ message: 'Welcome to the admin dashboard' });
      } else {
        return res.status(403).json({ message: 'Access denied: Not an admin' });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} not allowed`);
  }
}







// pages/api/signup.js
import { auth, db } from '../../firebaseAdmin';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, password } = req.body;

    // Validate sign-up data
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    try {
      // Check if the email is already registered
      const existingUser = await auth.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: 'Email is already registered' });
      }
    } catch (error) {
      // If user does not exist, proceed with sign-up
    }

    try {
      // Create a new user in Firebase Authentication
      const userRecord = await auth.createUser({
        email,
        password,
        displayName: name,
      });

      // Add user details to Firestore (or other DB)
      await db.collection('users').doc(userRecord.uid).set({
        name,
        email,
        role: 'user',  // Default role
      });

      return res.status(201).json({ message: 'Sign-up successful', user: { name, email, uid: userRecord.uid } });
    } catch (error) {
      return res.status(500).json({ message: 'Error during sign-up: ' + error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}





// pages/api/signin.js
import { auth } from '../../firebaseAdmin';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
      // Sign in the user using Firebase Authentication (handled client-side)
      const user = await auth.getUserByEmail(email);
      
      // You would normally handle password checks client-side
      // Simulating password check here for API purposes
      if (user && password === 'password123') {  // Replace with actual logic if necessary
        return res.status(200).json({ message: 'Sign-in successful', user: { email: user.email, uid: user.uid } });
      } else {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
      return res.status(401).json({ message: 'Invalid credentials or user not found' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}

import { useEffect, useState } from 'react';
import firebase from '../firebaseClient';
import { useRouter } from 'next/router';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        router.push('/signin'); // Redirect to sign-in if not authenticated
      }
    });

    return () => unsubscribe();
  }, []);

  if (!user) {
    return <p>Loading...</p>;
  }

  return <h1>Welcome to Admin Dashboard</h1>;
}

