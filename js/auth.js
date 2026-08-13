// =========================================
// FIREBASE AUTHENTICATION
// =========================================

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import { auth } from "./firebase.js";

import {
  doc,
  setDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import { db } from "./firebase.js";

// =========================================
// EMAIL + PASSWORD SIGN IN
// =========================================

async function signInWithEmail(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );

    const user = userCredential.user;

    console.log("User signed in:", user);

    return {
      success: true,
      user: user,
    };
  } catch (error) {
    console.error("Sign in error:", error);

    return {
      success: false,
      error: error,
    };
  }
}

// =========================================
// GOOGLE SIGN IN
// =========================================

async function signInWithGoogle() {
  try {
    // =====================================
    // GOOGLE PROVIDER
    // =====================================

    const provider = new GoogleAuthProvider();

    // =====================================
    // SIGN IN WITH GOOGLE
    // =====================================

    const result = await signInWithPopup(auth, provider);

    const user = result.user;

    // =====================================
    // STORE USER IN FIRESTORE
    // =====================================

    await setDoc(
      doc(db, "users", user.uid),
      {
        uid: user.uid,
        name: user.displayName || "",
        email: user.email || "",
        photoURL: user.photoURL || "",
        provider: "google",
        lastLogin: serverTimestamp(),
      },
      {
        merge: true,
      },
    );

    console.log("Google user signed in and stored:", user);

    return {
      success: true,
      user: user,
    };
  } catch (error) {
    console.error("Google sign in error:", error);

    return {
      success: false,
      error: error,
    };
  }
}

// =========================================
// CREATE ACCOUNT
// =========================================

async function createAccount(name, email, password) {
  try {
    // =====================================
    // CREATE FIREBASE AUTH ACCOUNT
    // =====================================

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    const user = userCredential.user;

    // =====================================
    // SAVE USER'S DISPLAY NAME
    // =====================================

    await updateProfile(user, {
      displayName: name,
    });

    // =====================================
    // CREATE FIRESTORE USER DOCUMENT
    // =====================================

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: name,
      email: user.email,
      provider: "password",
      createdAt: serverTimestamp(),
    });

    console.log("Account and Firestore profile created:", user);

    return {
      success: true,
      user: user,
    };
  } catch (error) {
    console.error("Create account error:", error);

    return {
      success: false,
      error: error,
    };
  }
}

// =========================================
// SEND PASSWORD RESET EMAIL
// =========================================

async function resetPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Password reset error:", error);

    return {
      success: false,
      error: error,
    };
  }
}

// =========================================
// AUTH STATE LISTENER
// =========================================

function listenToAuthState(callback) {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
}

// =========================================
// SIGN OUT
// =========================================

async function signOutUser() {
  try {
    await signOut(auth);

    console.log("User signed out successfully.");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Sign out error:", error);

    return {
      success: false,
      error: error,
    };
  }
}

// =========================================
// EXPORT
// =========================================

export {
  signInWithEmail,
  signInWithGoogle,
  createAccount,
  resetPassword,
  listenToAuthState,
  signOutUser,
};
