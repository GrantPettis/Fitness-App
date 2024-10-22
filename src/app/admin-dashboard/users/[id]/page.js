"use client"; // This should be the first line in your file

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase/firebase'; // Adjust the path as needed

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <p>Loading...</p>; // Show loading text while fetching
  }

  if (users.length === 0) {
    return <p>No users found.</p>; // Show this if no users are retrieved
  }

  return (
    <div>
      <h1>User List</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.email}
            <button onClick={() => deleteUser(user.id)}>Delete User</button> {/* Add delete functionality */}
          </li>
        ))}
      </ul>
    </div>
  );
}
