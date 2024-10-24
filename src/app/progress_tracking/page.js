"use client"
// firebaseConfig.js
//import { initializeApp } from "firebase/app";
//import { getFirestore } from "firebase/firestore";

// Your Firebase configuration (use your own Firebase project credentials)
// const firebaseConfig = {
//     apiKey: "YOUR_API_KEY",
//     authDomain: "YOUR_AUTH_DOMAIN",
//     projectId: "YOUR_PROJECT_ID",
//     storageBucket: "YOUR_STORAGE_BUCKET",
//     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//     appId: "YOUR_APP_ID"
// };


// pages/progress_tracking_page.js
import { db } from '@/app/firebase/firebase'; // Firestore instance
import { useState, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore'; // Firestore functions

export default function ProgressTrackingPage() {
    const [formData, setFormData] = useState({
        speed: {
            goal: 'Decrease Time',
            name: '40-yard dash',
            reps: '1',
            score: '',
            sets: '3',
        },
        muscularEndurance: [
            {
                goal: 'M: 25 F:15',
                name: 'Push Up',
                reps: 'Fail',
                score: '',
                sets: '1',
            },
            {
                goal: '1 minute',
                name: 'Plank Hold',
                reps: 'Fail',
                score: '',
                sets: '1',
            }
        ],
        strength: [
            {
                goal: '30-60 sec.',
                name: 'Dead Hang',
                reps: '1',
                score: '',
                sets: '1',
            },
            {
                goal: '1/3 Bodyweight',
                name: 'Goblet Squat Hold',
                reps: '30 sec.',
                score: '',
                sets: '1',
            },
            {
                goal: 'Body Weight',
                name: 'Squat/Leg Extension',
                reps: '1',
                score: '',
                sets: '3',
            },
            {
                goal: 'increase Weight',
                name: 'Bench Press',
                reps: '1',
                score: '',
                sets: '3',
            }
        ],
        power: [
            {
                goal: '18-24 in.',
                name: 'Vertical Test',
                reps: '1',
                score: '',
                sets: '3',
            },
            {
                goal: 'Your Height',
                name: 'Broad Jump',
                reps: '1',
                score: '',
                sets: '3',
            }
        ],
        steadyState: {
            goal: 'breathing Control',
            name: 'Walking, Jogging, Biking, Swimming',
            reps: '20-30 minutes',
            score: '',
            sets: '1',
        },
        skillAndMovement: [
            {
                goal: '5',
                name: 'Squat',
                reps: '8',
                score: '',
                sets: '1',
            },
            {
                goal: '5',
                name: 'Push Up',
                reps: '8',
                score: '',
                sets: '1',
            },
            {
                goal: '5',
                name: 'Deadlift',
                reps: '8',
                score: '',
                sets: '1',
            },
            {
                goal: '5',
                name: 'Pull Up',
                reps: '8',
                score: '',
                sets: '1',
            }
        ],
        maximalAnaerobicCapacity: [
            {
                goal: '',
                name: '1 mile walk',
                reps: '1',
                score: 'M:50 F:35',
                sets: '1',
            },
            {
                goal: 'M:50, F:35',
                name: '12 minute Cooper Test',
                reps: '12 minutes',
                score: '',
                sets: '1',
            }
        ]
    });

    // const handleChange = (e) => {
    //     setFormData({
    //         ...formData,
    //         [e.target.name]: e.target.value,
    //     });
    // };

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Implement nested updates for each category
        // (Example: If updating speed's score or any other category's specific field)
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const docRef = await addDoc(collection(db, "exerciseProgress"), formData);
            alert("Progress saved with ID: " + docRef.id);
            // Clear the form after submission or (reset the state to initial form data)
            // setFormData({
            //     speed: '',
            //     muscularEndurance: '',
            //     strength: '',
            //     power: '',
            //     steadyState: '',
            //     skillAndMovement: '',
            //     maximalAnaerobicCapacity: ''
            // });
        } catch (e) {
            console.error("Error adding document: ", e);
            alert("Error saving progress.");
        }
    };

    return (
        <div>
            <h1>Progress Tracking Page</h1>
            <form onSubmit={handleSubmit}>
                {/* Render Speed Section */}
                <h2>Speed</h2>
                <label>
                    Goal:
                    <input
                        type="text"
                        name="goal"
                        value={formData.speed.goal}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Name:
                    <input
                        type="text"
                        name="name"
                        value={formData.speed.name}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Reps:
                    <input
                        type="text"
                        name="reps"
                        value={formData.speed.reps}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Score:
                    <input
                        type="text"
                        name="score"
                        value={formData.speed.score}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Sets:
                    <input
                        type="text"
                        name="sets"
                        value={formData.speed.sets}
                        onChange={handleChange}
                    />
                </label>
                <br />

                {/* <label>
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
                <br /> */}


                 {/* Muscular Endurance, Strength, Power, etc. would follow a similar structure Check*/}
                 {/* You would map through formData for array-based categories  Check*/}




                  {/* <h1>Progress Tracking Page</h1>
                     <form onSubmit={handleSubmit}> */}
                {/*Render Muscularenderance Section*/}
                 <h2>MuscularEndurance</h2>
                <label>
                    Goal:
                    <input
                        type="text"
                        name="goal"
                        value={formData.muscularEndurance.goal}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Name:
                    <input
                        type="text"
                        name="name"
                        value={formData.muscularEndurance.name}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Reps:
                    <input
                        type="text"
                        name="reps"
                        value={formData.muscularEndurance.reps}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Score:
                    <input
                        type="text"
                        name="score"
                        value={formData.muscularEndurance.score}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Sets:
                    <input
                        type="text"
                        name="sets"
                        value={formData.muscularEndurance.sets}
                        onChange={handleChange}
                    />
                </label>
                <br />

                      {/* <h1>Progress Tracking Page</h1>
                     <form onSubmit={handleSubmit}> */}
                      {/* Render Strength Section*/}
                <h2>Strength</h2>
                <label>
                    Goal:
                    <input
                        type="text"
                        name="goal"
                        value={formData.strength.goal}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Name:
                    <input
                        type="text"
                        name="name"
                        value={formData.strength.name}
                        onChange={handleChange}
                            />
                        </label>
                        <br />
                     <label>
                     Reps:
                    <input
                        type="text"
                        name="reps"
                        value={formData.strength.reps}
                        onChange={handleChange}
                             />
                        </label>
                        <br />
                        <label>
                            Score:
                            <input
                                type="text"
                                name="score"
                                value={formData.strength.score}
                                onChange={handleChange}
                            />
                        </label>
                        <br />
                        <label>
                            Sets:
                            <input
                                type="text"
                                name="sets"
                                value={formData.strength.sets}
                                onChange={handleChange}
                            />
                        </label>
                        <br />

        
                      {/* <h1>Progress Tracking Page</h1>
                     <form onSubmit={handleSubmit}> */}
                  {/* Render Power Section */}
                        <h2>Power</h2>
                        <label>
                            Goal:
                            <input
                                type="text"
                                name="goal"
                                value={formData.power.goal}
                                onChange={handleChange}
                            />
                        </label>
                        <br />
                        <label>
                            Name:
                            <input
                                type="text"
                                name="name"
                                value={formData.power.name}
                                onChange={handleChange}
                                    />
                                </label>
                                <br />
                            <label>
                            Reps:
                            <input
                                type="text"
                                name="reps"
                                value={formData.power.reps}
                                onChange={handleChange}
                                    />
                                </label>
                                <br />
                                <label>
                                    Score:
                                    <input
                                        type="text"
                                        name="score"
                                        value={formData.power.score}
                                        onChange={handleChange}
                                    />
                                </label>
                                <br />
                                <label>
                                    Sets:
                                    <input
                                        type="text"
                                        name="sets"
                                        value={formData.power.sets}
                                        onChange={handleChange}
                                    />
                                </label>
                                <br />

                                 {/* Render SteadyState Section */}
                        <h2>SteadyState</h2>
                        <label>
                            Goal:
                            <input
                                type="text"
                                name="goal"
                                value={formData.steadyState.goal}
                                onChange={handleChange}
                            />
                        </label>
                        <br />
                        <label>
                            Name:
                            <input
                                type="text"
                                name="name"
                                value={formData.steadyState.name}
                                onChange={handleChange}
                                    />
                                </label>
                                <br />
                            <label>
                            Reps:
                            <input
                                type="text"
                                name="reps"
                                value={formData.steadyState.reps}
                                onChange={handleChange}
                                    />
                                </label>
                                <br />
                                <label>
                                    Score:
                                    <input
                                        type="text"
                                        name="score"
                                        value={formData.steadyState.score}
                                        onChange={handleChange}
                                    />
                                </label>
                                <br />
                                <label>
                                    Sets:
                                    <input
                                        type="text"
                                        name="sets"
                                        value={formData.steadyState.sets}
                                        onChange={handleChange}
                                    />
                                </label>
                                <br />


                                 {/* Render SkillaAndMovement Section  didn't pop up on client side come back*/} 
                        <h2>SkillAndMovement</h2>
                        <label>
                            Goal:
                            <input
                                type="text"
                                name="goal"
                                value={formData.skillAndMovement.goal}
                                onChange={handleChange}
                            />
                        </label>
                        <br />
                        <label>
                            Name:
                            <input
                                type="text"
                                name="name"
                                value={formData.skillAndMovement.name}
                                onChange={handleChange}
                                    />
                                </label>
                                <br />
                            <label>
                            Reps:
                            <input
                                type="text"
                                name="reps"
                                value={formData.skillAndMovement.reps}
                                onChange={handleChange}
                                    />
                                </label>
                                <br />
                                <label>
                                    Score:
                                    <input
                                        type="text"
                                        name="score"
                                        value={formData.skillAndMovement.score}
                                        onChange={handleChange}
                                    />
                                </label>
                                <br />
                                <label>
                                    Sets:
                                    <input
                                        type="text"
                                        name="sets"
                                        value={formData.skillAndMovement.sets}
                                        onChange={handleChange}
                                    />
                                </label>
                                <br />

                                 {/* Render maximumAnaerobicCapacity Section didn't pop up on the client side come back*/}
                        <h2>maximalAnaerobicCapacity</h2>
                        <label>
                            Goal:
                            <input
                                type="text"
                                name="goal"
                                value={formData.maximalAnaerobicCapacity.goal}
                                onChange={handleChange}
                            />
                        </label>
                        <br />
                        <label>
                            Name:
                            <input
                                type="text"
                                name="name"
                                value={formData.maximalAnaerobicCapacity.name}
                                onChange={handleChange}
                                    />
                                </label>
                                <br />
                            <label>
                            Reps:
                            <input
                                type="text"
                                name="reps"
                                value={formData.maximalAnaerobicCapacity.reps}
                                onChange={handleChange}
                                    />
                                </label>
                                <br />
                                <label>
                                    Score:
                                    <input
                                        type="text"
                                        name="score"
                                        value={formData.maximalAnaerobicCapacity.score}
                                        onChange={handleChange}
                                    />
                                </label>
                                <br />
                                <label>
                                    Sets:
                                    <input
                                        type="text"
                                        name="sets"
                                        value={formData.maximalAnaerobicCapacity.sets}
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
