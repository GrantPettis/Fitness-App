"use client"; 
import { doc, getDoc } from 'firebase/firestore'; // Firestore functions
import { db } from '@/app/firebase/firebase'; // Firestore instance
import { useState, useEffect } from 'react';




// Fetch exercise data based on slug (document ID)
async function getExercise(slug) {
    if (!slug) {
        console.error('Slug is undefined or null');
        return null;
    }

    try {
        // Check if exercise data is already cached in session storage
        const cachedExercise = sessionStorage.getItem(slug);
        if (cachedExercise) {
            console.log(`Loaded exercise from cache: ${slug}`);
            return JSON.parse(cachedExercise); // Return cached data
        }

        // If not cached, fetch from Firestore
        const docRef = doc(db, "Exercises", slug); // Fetch document based on the slug (document ID)
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Fetched Exercise Data: ", docSnap.data()); // Log fetched data
            const exerciseData = { id: docSnap.id, ...docSnap.data() };
            // Cache the fetched exercise data
            sessionStorage.setItem(slug, JSON.stringify(exerciseData));
            return exerciseData; // Return the exercise data
        } else {
            console.log("No such document found for slug: ", slug); // Log if document isn't found
            return null;
        }
    } catch (error) {
        console.error("Error fetching exercise:", error); // Log Firestore error
        return null;
    }
}

export default function ExerciseDetailPage({ params }) {
    const [exercise, setExercise] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchExercise() {
            const exerciseData = await getExercise(params.individual_exercise); // Use the slug from params
            setExercise(exerciseData);
            setLoading(false);
        }

        fetchExercise(); // Fetch the exercise data
    }, [params.individual_exercise]);

    if (loading) {
        return <p>Loading...</p>; // Show loading state
    }

    if (!exercise) {
        return <p>Exercise not found</p>; // Handle case where no exercise is found
    }

    return (
        <main>
            <h1>{exercise.name}</h1>
            <p>Sets: {exercise.sets}</p>
            <p>Reps: {exercise.reps}</p>
            <p>Primary Muscle: {exercise.primaryMuscle}</p>
            <p>Adaptation: {exercise.adaptation}</p> {/* Changed adaptationType to adaptation */}
            {exercise.videoURL ? (
                <a href={exercise.videoURL} target="_blank" rel="noopener noreferrer">
                    Click Here
                </a>
            ) : (
                <p>No video available</p>
            )}
        </main>
    );
}
