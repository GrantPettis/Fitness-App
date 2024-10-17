"use client";

import { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';  // Firestore methods
import { db, auth } from '../firebase/firebase';  // Import Firestore and Auth instances
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);  // Store the authenticated user
  const [users, setUsers] = useState([]);  // Store list of users
  const [isAdmin, setIsAdmin] = useState(false);  // Check if user is admin
  const [editingUser, setEditingUser] = useState(null);  // For editing user roles
  const [newRole, setNewRole] = useState("");  // For setting new roles
  const [loading, setLoading] = useState(true);  // Loading state
  const [feedback, setFeedback] = useState('');  // Feedback message
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Fetch the user's ID token and log the claims
        const token = await user.getIdTokenResult();
        console.log("User token claims:", token.claims);  // Log token claims to check if admin claim is present

        // Check if the user has the admin claim
        if (token.claims.admin) {
          console.log("Admin claim is present!");  // Confirm the admin claim exists
          setIsAdmin(true);  // Set admin state
          setUser(user);  // Set authenticated user
          fetchUsers();  // Fetch users if admin
        } else {
          console.log("User is not an admin.");  // Log if the user is not an admin
          router.push('/');  // Redirect if not an admin
        }
      } else {
        console.log("No user signed in.");  // Log if no user is signed in
        router.push('/');
      }
      setLoading(false);  // Stop loading once the state is determined
    });

    return () => unsubscribe();  // Cleanup on unmount
  }, [router]);

  // Function to fetch users from Firestore
  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log("Users fetched:", usersData);  // Log users fetched
      setUsers(usersData);  // Store users in state
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Function to delete a user
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

  // Function to update a user's role
  const updateUser = async (userId) => {
    try {
      const userDoc = doc(db, "users", userId);
      await updateDoc(userDoc, { role: newRole });
      setEditingUser(null);  // Exit editing mode
      setNewRole("");  // Clear role input
      setFeedback("User role updated successfully.");
      fetchUsers();  // Refresh user list
    } catch (error) {
      setFeedback("Error updating user role.");
      console.error("Error updating user:", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!isAdmin) {
    return <p>Unauthorized access. Redirecting...</p>;  // Block if not admin
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user.email}</p>
      {feedback && <p>{feedback}</p>} {/* Display feedback for admin actions */}

      <h2>Registered Users</h2>
      {users.length > 0 ? (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              <p>Email: {user.email}</p>
              <p>Role: {user.role || 'User'}</p>

              {/* Show delete and edit options for admins */}
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
