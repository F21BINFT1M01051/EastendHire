// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDBSM8FHuoBiXuQDFQoc7ejd70U2EE-9Ek",
  authDomain: "eastendhire-e3f25.firebaseapp.com",
  projectId: "eastendhire-e3f25",
  storageBucket: "eastendhire-e3f25.firebasestorage.app",
  messagingSenderId: "247582126110",
  appId: "1:247582126110:web:491367057bf738fdc3be0f",
  measurementId: "G-8BNN1XXYSV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const analytics = getAnalytics(app);
export const db = getFirestore(app);