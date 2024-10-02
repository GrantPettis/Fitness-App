"use client"
import { Firestore, getDoc, collection, getDocs, QuerySnapshot } from 'firebase/firestore';
import Link from 'next/link';
import {useCollection} from "react-firebase-hooks/firestore"
import {db} from '@/app/firebase/firebase'; 
import { useEffect, useState } from 'react';


async function fetchdatafromFirestore() {
    const QuesrySnapshot = await getDocs(collection(db,"Exercises"))

    const data = [];
    QuerySnapshot.array.forEach(doc => {
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
            
        }
        fetchData();
    },[]);
    return <main>
        <h1>exercises_page</h1> 
        <div>
            {data.map((Exercise)=> (
                <div key={Exercise.id} className='mb-4'>
                    <p>{Exercise.name}</p>
                    </div>
            ))} 
        </div>
    </main>
}