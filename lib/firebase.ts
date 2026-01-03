// Firebase Configuration - Study with AI App

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCercHWfNAl0OCcp3qgd7xNmL0-xodmJys",
  authDomain: "study-planner-c3f6b.firebaseapp.com",
  projectId: "study-planner-c3f6b",
  storageBucket: "study-planner-c3f6b.firebasestorage.app",
  messagingSenderId: "41985357658",
  appId: "1:41985357658:web:3ad7f0bb86e2b85f316563",
  measurementId: "G-XTTLW540H5"
};

// Initialize Firebase - prevent multiple initializations
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
