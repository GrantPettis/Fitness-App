"use client"
import { Firestore, getDoc, collection, getDocs, QuerySnapshot } from 'firebase/firestore';
import Link from 'next/link';
import {useCollection} from "react-firebase-hooks/firestore"
import {db} from '@/app/firebase/firebase'; 
import { useEffect, useState } from 'react';
import classes from '@/app/components/exercise-template.module.css'




async function fetchdatafromFirestore() {
    const QuerySnapshot = await getDocs(collection(db,"Exercises"))

    const data = [];
    QuerySnapshot.forEach(doc => {
        data.push({id: doc.id, ...doc.data()});
    });
    return data;
}
export default function exercises_page(){

    const [data, setData] = useState([]);
    useEffect(() => {
        async function fetchData() {
            const data = await fetchdatafromFirestore();
            setData(data);
            console.log('Fetched Data:', data); // Log the fetched data here
            
        }
        fetchData();
    },[]);
    return <main>
        <h1>exercises_page</h1> 
        <div>
            {data.map((Exercise)=> (
                <div key={Exercise.id} className={classes.button}>
                    <Link href = {'/exercises/${}'} className = {classes.button}>{Exercise.name}</Link>
                    </div>
            ))} 
        </div>
    </main>
}