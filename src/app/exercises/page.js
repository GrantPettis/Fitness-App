"use client";
import { Firestore, getDoc, collection, getDocs, QuerySnapshot } from 'firebase/firestore';
import Link from 'next/link';
import { db } from '@/app/firebase/firebase'; 
import { useEffect, useState } from 'react';
import classes from '@/app/components/exercise-template.module.css';

// Fetch exercises from Firestore
async function fetchdatafromFirestore() {
    const querySnapshot = await getDocs(collection(db,"Exercises"));
    const data = [];
    querySnapshot.forEach(doc => {
        data.push({id: doc.id, ...doc.data()});
    });
    console.log('Fetched Data:', data); // Log the fetched data to verify
    return data;
}

export default function ExercisesPage() {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [filter, setFilter] = useState({ muscleGroup: '', searchTerm: '' });

    // Fetch exercises from Firestore when the component mounts
    useEffect(() => {
        async function fetchData() {
            const fetchedData = await fetchdatafromFirestore();
            setData(fetchedData);
            setFilteredData(fetchedData); // Initialize with all data
        }
        fetchData();
    }, []); // Only fetch data on component mount

    // Re-apply filtering whenever the filter state changes
    useEffect(() => {
        const filtered = data.filter((exercise) => {
            const matchesMuscleGroup = filter.muscleGroup
                ? exercise.primaryMuscle === filter.muscleGroup
                : true;
                const matchesSearchTerm = filter.searchTerm
                ? exercise.name && exercise.name.toLowerCase().includes(filter.searchTerm.toLowerCase())
                : true;            
            return matchesMuscleGroup && matchesSearchTerm;
        });
        
        console.log('Re-applied Filter:', filter); // Log the current filter state
        console.log('Filtered Exercises:', filtered); // Log the filtered exercises

        setFilteredData(filtered);
    }, [filter, data]); // Depend on `filter` and `data` to re-apply filtering when either changes

    // Handle filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilter((prevFilter) => ({
            ...prevFilter,
            [name]: value,
        }));
    };

    return (
        <main>
            <h1>Exercises Page</h1>

            {/* Filter section */}
            <div className="filter-section">
                <label>
                    Search by Name:
                    <input
                        type="text"
                        name="searchTerm"
                        value={filter.searchTerm}
                        onChange={handleFilterChange}
                        placeholder="Search exercises..."
                    />
                </label>

                <label>
                    Filter by Muscle Group:
                    <select
                        name="muscleGroup"
                        value={filter.muscleGroup}
                        onChange={handleFilterChange}
                    >
                        <option value="">All</option>
                        <option value="Adductors/Abductors">Adductors/Abductors</option>
                        <option value="Ankle">Ankle</option>
                        <option value="Biceps">Biceps</option>
                        <option value="Calves">Calves</option>
                        <option value="Chest">Chest</option>
                        <option value="Core">Core</option>
                        <option value="Full Body">Full Body</option>
                        <option value="Glutes">Glutes</option>
                        <option value="Hamstrings">Hamstrings</option>
                        <option value="Hip Flexor">Hip Flexor</option>
                        <option value="IT Band">IT Band</option>
                        <option value="Hips">Hips</option>
                        <option value="Legs">Legs</option>
                        <option value="Lower Back">Lower Back</option>
                        <option value="Quads">Quads</option>
                        <option value="Shoulders">Shoulders</option>
                        <option value="Triceps">Triceps</option>
                        <option value="Upper Back">Upper Back</option>
                    </select>
                </label>
            </div>

            {/* Display the filtered exercises */}
            <div>
                {filteredData.length > 0 ? (
                    filteredData.map((Exercise) => (
                        <div key={Exercise.id} className={classes.button}>
                            <Link href={`/exercises/${Exercise.id}`} className={classes.button}>
                                {Exercise.name}
                            </Link>
                        </div>
                    ))
                ) : (
                    <p>No exercises found.</p>
                )}
            </div>
        </main>
    );
}
