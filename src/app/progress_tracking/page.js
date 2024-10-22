// firebaseConfig.js
//import { initializeApp } from "firebase/app";
//import { getFirestore } from "firebase/firestore";

// Your Firebase configuration (use your own Firebase project credentials)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };


// pages/progress_tracking_page.js
import React, { useState } from 'react';
import { db } from '../firebaseConfig'; // Import Firestore
import { collection, addDoc } from 'firebase/firestore'; // Firestore functions

export default function ProgressTrackingPage() {
    const [formData, setFormData] = useState({
        speed: '',
        muscularEndurance: '',
        strength: '',
        power: '',
        steadyState: '',
        skillAndMovement: '',
        maximalAnaerobicCapacity: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const docRef = await addDoc(collection(db, "exerciseProgress"), formData);
            alert("Progress saved with ID: " + docRef.id);
            // Clear the form after submission
            setFormData({
                speed: '',
                muscularEndurance: '',
                strength: '',
                power: '',
                steadyState: '',
                skillAndMovement: '',
                maximalAnaerobicCapacity: ''
            });
        } catch (e) {
            console.error("Error adding document: ", e);
            alert("Error saving progress.");
        }
    };

    return (
        <div>
            <h1>Progress Tracking Page</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Speed:
                    <input
                        type="text"
                        name="speed"
                        value={formData.speed}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Muscular Endurance:
                    <input
                        type="text"
                        name="muscularEndurance"
                        value={formData.muscularEndurance}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Strength:
                    <input
                        type="text"
                        name="strength"
                        value={formData.strength}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Power:
                    <input
                        type="text"
                        name="power"
                        value={formData.power}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Steady State:
                    <input
                        type="text"
                        name="steadyState"
                        value={formData.steadyState}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Skill and Movement:
                    <input
                        type="text"
                        name="skillAndMovement"
                        value={formData.skillAndMovement}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Maximal Anaerobic Capacity:
                    <input
                        type="text"
                        name="maximalAnaerobicCapacity"
                        value={formData.maximalAnaerobicCapacity}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <button type="submit">Save Progress</button>
            </form>
        </div>
    );
}

//     match /databases/{database}/documents {
//       match /exerciseProgress/{document} {
//         allow read, write: if request.auth != null;
//       }
//     }
//   }
