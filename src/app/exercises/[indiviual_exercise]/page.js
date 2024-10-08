"use client"
import { Firestore, getDoc, collection, getDocs, QuerySnapshot } from 'firebase/firestore';
import Link from 'next/link';
import {useCollection} from "react-firebase-hooks/firestore"
import {db} from '@/app/firebase/firebase'; 
import { useEffect, useState } from 'react';

export async function getexercise(slug){
    return db.collection('SELECT * FROM exercises where slug = ?').get(slug)
}

export default function exercisedatailpage ({params}){
    const exercise = getexercise(params.individual_exercise)
    return <h1>Exercise Details</h1>
}