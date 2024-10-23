"use client";
import { Firestore, getDoc, collection, getDocs, QuerySnapshot } from 'firebase/firestore';
import Link from 'next/link';
import { db } from '@/app/firebase/firebase'; 
import { useEffect, useState } from 'react';
import classes from '@/app/components/exercise-template.module.css';
import grid from '@/app/components/exercise-grid.module.css'
import style from '@/app/components/exercise-item.module.css'
import { resolve } from 'styled-jsx/css';
import dropdown from '@/app/components/dropdown-menu.module.css'
import form from '@/app/components/text-form-field.module.css'
const ITEMS_PER_PAGE = 50; // Number of exercises per page

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
    const [currentPage, setCurrentPage] = useState(1); // Track the current page

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
        setCurrentPage(1); // Reset to page 1 when filters are applied
    }, [filter, data]); // Depend on `filter` and `data` to re-apply filtering when either changes

    // Pagination logic
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentExercises = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

    // Handle page change
    const goToPage = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Handle filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilter((prevFilter) => ({
            ...prevFilter,
            [name]: value,
        }));
    };

    return (
        <>
        <header className={style.headerText} style={{ textAlign: 'center' }}>
            <h1>Exercises</h1>
        </header>
        <main className={classes.main}>
            {/* Filter section */}
            <div style={{padding: '8px'}}>
                <h1 className={dropdown.title} style={{ display: 'inline', padding: '2px' }}>Search by Name:</h1>
                    <input
                        className={form.input}
                        type="text"
                        name="searchTerm"
                        value={filter.searchTerm}
                        onChange={handleFilterChange}
                        placeholder="Search exercises..."
                    />
                <h1 className={dropdown.title} style={{ display: 'inline', padding: '2px' }}>Muscle Group:</h1>
                    <select
                        className={dropdown.nav}
                    name="muscleGroup"
                    value={filter.muscleGroup}
                    onChange={handleFilterChange}
                    title='Muscle Group:'
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
            </div>

            {/* Display the current exercises */}
            <div className={grid.exercises}>
                {currentExercises.length > 0 ? (
                    currentExercises.map((Exercise) => (
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

            {/* Pagination controls */}
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}
                        onClick={() => goToPage(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </main>
        </>
    );
}
