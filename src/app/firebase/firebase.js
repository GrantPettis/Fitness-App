// Import the functions you need from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";  // Import Firebase Authentication
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration (hard-coded)
const firebaseConfig = {
  apiKey: "AIzaSyDCuQO0w9365S224076cEr9eUEBjga4fTs",
  authDomain: "universal-body-and-mind.firebaseapp.com",
  projectId: "universal-body-and-mind",
  storageBucket: "universal-body-and-mind.appspot.com",
  messagingSenderId: "239984847318",
  appId: "1:239984847318:web:25aeeb1ef882443b8c5c77",
  measurementId: "G-1SNLP33M87"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore (for storing data like exercises)
const db = getFirestore(app);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Initialize Firebase Analytics (optional)
const analytics = getAnalytics(app);

// Export both Firestore, Auth, and Analytics so you can use them elsewhere in your app
export { db, auth, analytics };
