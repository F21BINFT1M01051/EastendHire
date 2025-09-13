// utils/listenToUserData.js
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { getCredentials } from "./storageHelper";

/**
 * Sets up a real-time listener for the current user based on stored email.
 * @param {function} callback - function that receives updated user data
 * @returns unsubscribe function to stop listening
 */
export const listenToUserData = async (callback) => {
  try {
    const credentials = await getCredentials();
    if (!credentials?.email) {
      console.log("No email stored in AsyncStorage");
      return () => {}; // return dummy unsubscribe
    }

    const usersRef = collection(db, "Users");
    const q = query(usersRef, where("email", "==", credentials.email));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        callback({ id: doc.id, ...doc.data() });
      } else {
        callback(null);
      }
    });

    return unsubscribe;
  } catch (err) {
    console.error("Error listening to user data:", err);
    return () => {}; // return dummy unsubscribe
  }
};
