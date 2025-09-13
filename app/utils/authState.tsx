import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../firebase";

/**
 * Listen for auth state changes AND live updates to the user's document.
 * @param {(userData: object|null) => void} callback
 * @returns {() => void} unsubscribe function
 */
export const listenToUser = (callback) => {
  let userDocUnsub = null;

  const authUnsub = onAuthStateChanged(auth, (firebaseUser) => {
    console.log("Auth state changed - User:", firebaseUser ? firebaseUser.uid : "null");

    if (userDocUnsub) {
      userDocUnsub();
      userDocUnsub = null;
    }

    if (!firebaseUser) {
      console.log("No user, calling callback with null");
      callback(null);
      return;
    }

    const userRef = doc(db, "Users", firebaseUser.uid);
    console.log("Setting up snapshot listener for user:", firebaseUser.uid);

    userDocUnsub = onSnapshot(
      userRef,
      (snap) => {
        console.log("User doc snapshot received:", snap.exists());
        if (snap.exists()) {
          callback({ uid: firebaseUser.uid, ...snap.data() });
        } else {
          console.log("User document doesn't exist");
          callback(null);
        }
      },
      (err) => {
        console.error("Error listening to user doc:", err);
        callback(null);
      }
    );
  });

  return () => {
    console.log("Unsubscribing from auth listener");
    authUnsub();
    if (userDocUnsub) userDocUnsub();
  };
};