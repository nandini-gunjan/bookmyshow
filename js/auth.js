// =========================================
// FIREBASE AUTHENTICATION
// =========================================

import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import { auth } from "./firebase.js";

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
    const provider = new GoogleAuthProvider();

    const result = await signInWithPopup(auth, provider);

    const user = result.user;

    console.log("Google user signed in:", user);

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
// EXPORT
// =========================================

export { signInWithEmail, signInWithGoogle };
