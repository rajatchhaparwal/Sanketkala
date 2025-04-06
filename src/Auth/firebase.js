// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyA4elrqDmSd7IEZNS1mVjI172Mb6wTlxRg",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "sanketkala-ffaa8.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "sanketkala-ffaa8",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "sanketkala-ffaa8.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "735644292140",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:735644292140:web:306bc08317fa5c9d292d89",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-0FNWS4HVPP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication and Firestore
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
export default app;
