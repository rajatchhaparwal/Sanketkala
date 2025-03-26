// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA4elrqDmSd7IEZNS1mVjI172Mb6wTlxRg",
  authDomain: "sanketkala-ffaa8.firebaseapp.com",
  projectId: "sanketkala-ffaa8",
  storageBucket: "sanketkala-ffaa8.appspot.com",
  messagingSenderId: "735644292140",
  appId: "1:735644292140:web:306bc08317fa5c9d292d89",
  measurementId: "G-0FNWS4HVPP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
