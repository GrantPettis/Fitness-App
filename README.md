This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.


# **Universal Body & Mind - Project README**

## **Overview**

The Universal Body & Mind project is a fitness application designed to provide workout plans, progress tracking, and personalized user interactions. This document outlines the contributions made by each team member, with a specific focus on tasks for ongoing development and continuity for the next team.

## **Table of Contents**

1. **Project Setup**
2. **Features Developed**
3. **Firebase and Backend Integrations**
4. **Admin Dashboard and User Management**
5. **Progress Tracking and User-Specific Workouts**
6. **Future Recommendations**
7. **Contact Information**

---

### **Project Setup**

The app utilizes **Next.js** for the frontend, leveraging its server-side rendering and routing capabilities, which are well-suited for dynamic applications. **Firebase** powers the backend, providing authentication, real-time database management through Firestore, and secure data storage for workout plans and user interactions. Key setup steps include:

- **Folder Structure**: Organized into folders for components, Firebase configurations, pages, and user-specific workout plans.
- **Environment Variables**: Configuration settings such as API keys and Firebase details are stored in `.env` files to ensure security.
- **GitHub Repository**: Version control is managed on GitHub, with team members using branches and pull requests for collaborative development.

### **Features Developed**

#### **Firebase Integration**
The team implemented Firebase for key backend tasks like authentication, workout plan storage, and data retrieval:

- **Authentication**: Configured Firebase Authentication for secure user login and registration. Developed both Sign-In and Sign-Up pages, ensuring smooth user experiences with Firebase's email/password authentication.
- **Data Storage**: Uploaded over 450 exercises into Firebase Firestore, categorizing them by attributes such as name, sets, reps, primary muscle group, and adaptation type.
- **Real-Time Updates**: Implemented Firebase’s real-time capabilities to keep the app’s data synchronized, especially useful for workout plans and user progress tracking.

#### **Authentication**
The app's authentication flow allows users to securely log in and register:

- **Sign-In/Sign-Up Pages**: Designed and implemented front-end pages for logging in and signing up, with error handling to catch incorrect credentials or registration issues.
- **Role Assignment**: Set up role-based access, with users classified as admins or regular users. This allows for secure and role-specific access to different parts of the app.

#### **Workout Plans**
Created and managed workout plans within Firebase for easy access and updates:

- **Database Structure**: Organized over 450 exercises into Firestore with user-friendly field names and clear data categorization.
- **User Assignment**: Implemented functionality for admins to assign workout plans to individual users. Workout plans display detailed information, including sets, reps, and video links.
- **Custom Workouts**: Developed features allowing users to create and save custom workouts, giving them flexibility and a personalized experience.

#### **Browse Exercises Page**
The **Browse Exercises** page provides users with a comprehensive view of all available exercises:

- **Exercise Display**: Displays all exercises with essential details such as exercise name, primary muscle group, and reps/sets.
- **Navigation to Exercise Details**: Each exercise links to a detailed view page where users can see full exercise information, including video tutorials and adaptation types.
- **Filter and Search Options**: Added functionality for users to filter exercises by primary muscle group, making it easier to find exercises relevant to their goals.

#### **Contact Us Page**
The **Contact Us** page enables users to reach out to support or client contacts directly from the app:

- **Private Message Button**: Implemented a "Send a Message to Our Team" button that opens the user’s default email client, pre-filling the subject and body of the email to streamline contact.
- **Professional Formatting**: Designed the button and page layout for a professional appearance, enhancing user experience.

### **Firebase and Backend Integrations**

#### **Database Setup**
Configured Firebase Firestore for efficient and secure data management:

- **Exercise and Workout Plan Collections**: Created structured collections in Firestore to store exercises and workout plans. This organization enables efficient retrieval and updates.
- **User Data Storage**: Designed a structure to store user-specific data, such as assigned workout plans and progress tracking metrics, under each user's profile.
- **Real-Time Sync**: Leveraged Firebase’s real-time database capabilities to instantly reflect changes made by users or admins, keeping data consistent and up-to-date.

#### **API Key Management**
Ensured security for sensitive project data:

- **Environment Variables**: Set up `.env` files to store API keys, Firebase configurations, and other private data. Added `.env` files to `.gitignore` to prevent accidental uploads to GitHub.
- **Team Compliance**: Communicated API key storage practices to team members, reinforcing security best practices and preventing leaks.

#### **Real-Time Data Fetching**
Developed functions to fetch and display user data in real-time:

- **Workout Plan Assignments**: Created functions that retrieve user-specific workout plans from Firebase, displaying them in the user dashboard.
- **Progress Updates**: Real-time synchronization of progress metrics, allowing users and admins to see up-to-date workout completion data and achievements.

### **Admin Dashboard and User Management**

#### **Admin Role Implementation**
Implemented a role-based system to differentiate between admins and regular users:

- **Role Assignment**: Enabled admins to perform exclusive tasks like assigning workouts, viewing user lists, and accessing the Admin Dashboard.
- **Admin-Only Features**: Restricted sensitive actions, such as user management and workout plan assignments, to accounts with admin privileges.

#### **User Management**
Set up a centralized Admin Dashboard for managing user interactions and workout assignments:

- **User List and Management**: Enabled admins to view all registered users, assign specific workout plans, and monitor user activities.
- **Workout Plan Assignment**: Added functionality for admins to select workout plans and assign them to specific users, ensuring that each user’s workout page reflects their assigned plans.

#### **Error Handling and Debugging**
Implemented error handling to enhance reliability and troubleshoot issues:

- **Firebase Functions**: Added error handling in Firebase functions to manage database retrieval and display errors.
- **Debugging Workflow**: Regular debugging to troubleshoot front-end/backend communication issues and resolve any API or database errors.

### **Progress Tracking and User-Specific Workouts**

#### **User-Specific Workout Plans**
Created personalized workout plan displays and tracking features:

- **Assigned Workouts**: Each user can view their assigned workout plans, with relevant data such as sets, reps, and adaptation type.
- **Custom Workouts**: Users can create, save, and modify their own workout plans, which are securely stored in Firebase for future access.

#### **Progress Tracking Enhancements**
Enhanced the progress tracking features for better usability and feedback:

- **Progress Metrics**: Users can view progress metrics tied to each workout plan, with real-time updates to encourage consistency.
- **Intuitive UI**: Added a filter menu to help users navigate through exercises and workout plans more easily, with user-friendly layout improvements.

#### **Customizable Workouts**
Enabled users to create and track custom workouts:

- **Workout Builder**: Developed a feature that lets users build their own workout plans from available exercises, providing flexibility in managing their fitness journey.
- **Data Storage**: Saved custom workouts in Firebase, allowing users to access and track them over multiple sessions.

### **Future Recommendations**

#### **Refine Styling and UI**
- **Additional Styling**: The current UI is functional but could be improved to enhance user experience, particularly in areas like exercise lists and progress tracking.
- **Responsive Design**: Future teams should consider making the app fully responsive for mobile users.

#### **Editing Admin Settings**
For future teams who need to modify or expand admin functionalities, here are key areas to consider:

- **Firebase Admin Role Configuration**: To assign or modify admin roles, ensure you have access to Firebase’s **Authentication** and **Firestore** console. Admin roles are managed by setting custom claims in Firebase, so updates should follow the Firebase [documentation on custom claims](https://firebase.google.com/docs/auth/admin/custom-claims).

- **Updating Admin Permissions**: If additional permissions or features are needed, make updates in the following files:
  - **`admin.js` in `pages/api`**: This file manages admin API routes, including assigning workout plans and user management actions.
  - **Admin Dashboard Components**: Modify components under `src/app/admin-dashboard` for UI changes related to admin functionalities.
  
- **Security Rules**: If you’re adding or updating sensitive admin actions, review and update Firebase **Firestore Security Rules** to ensure only admins have access to these functions.

#### **Documentation for Firebase Schema**
- **Database Schema**: Provide a comprehensive schema of the Firebase database, with descriptions of each collection and field. This documentation will help future developers understand data organization and ease troubleshooting.
