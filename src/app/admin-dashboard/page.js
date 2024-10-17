"use client";

import { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/firebase'; 
import { useRouter } from 'next/navigation';
import Link from 'next/link';  // Import Link from Next.js

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState('');
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const token = await user.getIdTokenResult();
        if (token.claims.admin) {
          setIsAdmin(true);
          setUser(user);
          fetchUsers();  
        } else {
          router.push('/user-dashboard'); // Redirect to user dashboard if not admin
        }
      } else {
        router.push('/'); // Redirect if no user is signed in
      }
      setLoading(false);
    });

    return () => unsubscribe(); 
  }, [router]);

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
    }
  };

  const deleteUser = async (userId) => {
    try {
      await deleteDoc(doc(db, "users", userId));
      setFeedback("User deleted successfully.");
      fetchUsers();  // Refresh user list
    } catch (error) {
      setFeedback("Error deleting user.");
      console.error("Error deleting user:", error);
    }
  };

  const updateUser = async (userId) => {
    try {
      const userDoc = doc(db, "users", userId);
      await updateDoc(userDoc, { role: newRole });
      setEditingUser(null);  
      setNewRole("");  
      setFeedback("User role updated successfully.");
      fetchUsers();  // Refresh user list
    } catch (error) {
      setFeedback("Error updating user role.");
      console.error("Error updating user role:", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>; 
  }

  if (!isAdmin) {
    return <p>Unauthorized access. Redirecting...</p>; 
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user.email}</p>
      {feedback && <p>{feedback}</p>} 

      {/* Link to Assign Workout Plans page */}
      <Link href="/AssignWorkoutPlan">
        Assign Workout Plans
      </Link>

      <h2>Registered Users</h2>
      {users.length > 0 ? (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              <p>Email: {user.email}</p>
              <p>Role: {user.role || 'User'}</p>

              <button onClick={() => deleteUser(user.id)}>Delete</button>
              {editingUser === user.id ? (
                <div>
                  <label>New Role:</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                  >
                    <option value="">Select Role</option>
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                    <option value="Trainer">Trainer</option>
                  </select>
                  <button onClick={() => updateUser(user.id)}>Save</button>
                  <button onClick={() => setEditingUser(null)}>Cancel</button>
                </div>
              ) : (
                <button onClick={() => setEditingUser(user.id)}>Edit</button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
}
