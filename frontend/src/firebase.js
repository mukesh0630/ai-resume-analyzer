// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAIKwBn9UbfZVMovxb8YyhdENTTiDHzT8U",
  authDomain: "ai-resume-analyzer-ea4bd.firebaseapp.com",
  projectId: "ai-resume-analyzer-ea4bd",
  storageBucket: "ai-resume-analyzer-ea4bd.firebasestorage.app",
  messagingSenderId: "732885016928",
  appId: "1:732885016928:web:6d63db029c9c6857a3be05",
  measurementId: "G-C43NDKQ3LG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);