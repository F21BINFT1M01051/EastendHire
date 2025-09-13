// firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDBSM8FHuoBiXuQDFQoc7ejd70U2EE-9Ek",
  authDomain: "eastendhire-e3f25.firebaseapp.com",
  projectId: "eastendhire-e3f25",
  storageBucket: "eastendhire-e3f25.firebasestorage.app",
  messagingSenderId: "247582126110",
  appId: "1:247582126110:web:491367057bf738fdc3be0f",
  measurementId: "G-8BNN1XXYSV",
};

// initialize the app (only once)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// initialize auth only if it hasn’t been initialized yet
let auth;
try {
  // if Auth already exists, reuse it
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  // if already initialized, get the existing instance
  const { getAuth } = require("firebase/auth");
  auth = getAuth(app);
}

const db = getFirestore(app);

export { app, auth, db };
