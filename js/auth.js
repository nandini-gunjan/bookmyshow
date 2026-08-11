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
// CREATE ACCOUNT
// =========================================

async function createAccount(name, email, password) {
  try {
    // Create Firebase account

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    const user = userCredential.user;

    // Save user's name

    await updateProfile(user, {
      displayName: name,
    });

    console.log("Account created:", user);

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
// EXPORT
// =========================================

export { signInWithEmail, signInWithGoogle, createAccount, resetPassword };
