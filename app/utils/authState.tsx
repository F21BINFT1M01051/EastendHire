import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../firebase";

/**
 * Listen for auth state changes AND live updates to the user's document.
 * @param {(userData: object|null) => void} callback
 * @returns {() => void} unsubscribe function
 */
export const listenToUser = (callback) => {
  // Keep a reference to the Firestore unsubscribe so we can clean it up
  let userDocUnsub = null;

  const authUnsub = onAuthStateChanged(auth, (firebaseUser) => {
    // Clean up any old doc listener
    if (userDocUnsub) {
      userDocUnsub();
      userDocUnsub = null;
    }

    if (!firebaseUser) {
      callback(null);
      return;
    }

    const userRef = doc(db, "Users", firebaseUser.uid);

    // Subscribe to document changes
    userDocUnsub = onSnapshot(
      userRef,
      (snap) => {
        if (snap.exists()) {
          callback({ uid: firebaseUser.uid, ...snap.data() });
        } else {
          callback({ uid: firebaseUser.uid, profile: null });
        }
      },
      (err) => {
        console.error("Error listening to user doc:", err);
        callback(null);
      }
    );
  });

  // Return one function to clean up both listeners
  return () => {
    authUnsub();
    if (userDocUnsub) userDocUnsub();
  };
};
