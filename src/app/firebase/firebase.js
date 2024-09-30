// Import the functions you need from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
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

// Initialize Firestore (this is where you will store data like exercises)
const db = getFirestore(app);

// You can export `db` so you can use it in other parts of your app
export { db };
