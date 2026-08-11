// =========================================
// FIREBASE CONFIGURATION
// =========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// Your Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyD0SiyerFDN6CgNEXREw2mRLPFh3lUxg7M",
  authDomain: "bookitbro-303a7.firebaseapp.com",
  projectId: "bookitbro-303a7",
  storageBucket: "bookitbro-303a7.firebasestorage.app",
  messagingSenderId: "973967040340",
  appId: "1:973967040340:web:aa48a87e401441a12af2c1",
  measurementId: "G-EP5ZF8RSTN",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

// Initialize Authentication

const auth = getAuth(app);

// Export Authentication

export { auth };
