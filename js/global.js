// =========================================
// IMPORT AUTH FUNCTIONS
// =========================================

import { signInWithEmail, signInWithGoogle } from "./auth.js";

// =========================================
// LOAD NAVBAR
// =========================================

document.addEventListener("DOMContentLoaded", () => {
  loadNavbar();
});

async function loadNavbar() {
  try {
    const response = await fetch("components/navbar.html");

    if (!response.ok) {
      throw new Error("Navbar could not be loaded.");
    }

    const navbarHTML = await response.text();

    document.getElementById("navbar").innerHTML = navbarHTML;

    // Initialize navbar features

    initializeLocationModal();

    initializeSigninModal();
  } catch (error) {
    console.error("Navbar Error:", error);
  }
}

// =========================================
// LOCATION MODAL
// =========================================

function initializeLocationModal() {
  const locationButton = document.querySelector(".location-btn");

  const locationModal = document.getElementById("locationModal");

  const closeButton = document.getElementById("closeLocationModal");

  const locationSearch = document.getElementById("locationSearch");

  const cityOptions = document.querySelectorAll(".city-option");

  // =========================================
  // OPEN MODAL
  // =========================================

  locationButton.addEventListener("click", () => {
    locationModal.classList.add("show");

    document.body.style.overflow = "hidden";

    setTimeout(() => {
      locationSearch.focus();
    }, 200);
  });

  // =========================================
  // CLOSE MODAL
  // =========================================

  closeButton.addEventListener("click", closeLocationModal);

  // =========================================
  // CLICK OUTSIDE
  // =========================================

  locationModal.addEventListener("click", (event) => {
    if (event.target === locationModal) {
      closeLocationModal();
    }
  });

  // =========================================
  // ESC KEY
  // =========================================

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && locationModal.classList.contains("show")) {
      closeLocationModal();
    }
  });

  // =========================================
  // SELECT CITY
  // =========================================

  cityOptions.forEach((city) => {
    city.addEventListener("click", () => {
      const selectedCity = city.dataset.city;

      updateSelectedLocation(selectedCity);

      closeLocationModal();
    });
  });

  // =========================================
  // SEARCH CITIES
  // =========================================

  locationSearch.addEventListener("input", () => {
    const searchValue = locationSearch.value.toLowerCase().trim();

    cityOptions.forEach((city) => {
      const cityName = city.dataset.city.toLowerCase();

      if (cityName.includes(searchValue)) {
        city.style.display = "";
      } else {
        city.style.display = "none";
      }
    });
  });

  // =========================================
  // CLOSE FUNCTION
  // =========================================

  function closeLocationModal() {
    locationModal.classList.remove("show");

    document.body.style.overflow = "";

    locationSearch.value = "";

    cityOptions.forEach((city) => {
      city.style.display = "";
    });
  }

  // =========================================
  // UPDATE LOCATION
  // =========================================

  function updateSelectedLocation(city) {
    const locationText = document.querySelector(".location-btn span");

    locationText.textContent = city;
  }
}

// =========================================
// SIGN IN MODAL
// =========================================

function initializeSigninModal() {
  const signinButton = document.querySelector(".sign-in-btn");

  const signinModal = document.getElementById("signinModal");

  const closeButton = document.getElementById("closeSigninModal");

  // =========================================
  // INPUTS
  // =========================================

  const emailInput = document.getElementById("signinEmail");

  const passwordInput = document.getElementById("signinPassword");

  // =========================================
  // BUTTONS
  // =========================================

  const signinSubmitButton = document.querySelector(".signin-submit-btn");

  const googleSigninButton = document.querySelector(".google-signin-btn");

  const passwordToggle = document.getElementById("passwordToggle");

  // =========================================
  // OPEN MODAL
  // =========================================

  signinButton.addEventListener("click", () => {
    signinModal.classList.add("show");

    document.body.style.overflow = "hidden";

    emailInput.focus();
  });

  // =========================================
  // CLOSE MODAL
  // =========================================

  closeButton.addEventListener("click", closeSigninModal);

  // =========================================
  // CLICK OUTSIDE
  // =========================================

  signinModal.addEventListener("click", (event) => {
    if (event.target === signinModal) {
      closeSigninModal();
    }
  });

  // =========================================
  // ESC KEY
  // =========================================

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && signinModal.classList.contains("show")) {
      closeSigninModal();
    }
  });

  // =========================================
  // PASSWORD SHOW / HIDE
  // =========================================

  passwordToggle.addEventListener("click", () => {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";

      passwordToggle.textContent = "Hide";
    } else {
      passwordInput.type = "password";

      passwordToggle.textContent = "Show";
    }
  });

  // =========================================
  // EMAIL SIGN IN
  // =========================================

  signinSubmitButton.addEventListener("click", async () => {
    const email = emailInput.value.trim();

    const password = passwordInput.value;

    // ---------------------------------------
    // VALIDATION
    // ---------------------------------------

    if (!email) {
      showSigninError("Please enter your email.");

      return;
    }

    if (!password) {
      showSigninError("Please enter your password.");

      return;
    }

    // ---------------------------------------
    // DISABLE BUTTON
    // ---------------------------------------

    signinSubmitButton.disabled = true;

    signinSubmitButton.textContent = "Signing in...";

    // ---------------------------------------
    // FIREBASE
    // ---------------------------------------

    const result = await signInWithEmail(email, password);

    // ---------------------------------------
    // ENABLE BUTTON
    // ---------------------------------------

    signinSubmitButton.disabled = false;

    signinSubmitButton.textContent = "Sign in";

    // ---------------------------------------
    // RESULT
    // ---------------------------------------

    if (result.success) {
      console.log("Successfully signed in:", result.user);

      closeSigninModal();

      updateNavbarAfterLogin(result.user);
    } else {
      showFirebaseAuthError(result.error);
    }
  });

  // =========================================
  // GOOGLE SIGN IN
  // =========================================

  googleSigninButton.addEventListener("click", async () => {
    googleSigninButton.disabled = true;

    googleSigninButton.textContent = "Signing in...";

    const result = await signInWithGoogle();

    googleSigninButton.disabled = false;

    googleSigninButton.textContent = "Continue with Google";

    if (result.success) {
      console.log("Google sign in successful:", result.user);

      closeSigninModal();

      updateNavbarAfterLogin(result.user);
    } else {
      showFirebaseAuthError(result.error);
    }
  });

  // =========================================
  // CLOSE FUNCTION
  // =========================================

  function closeSigninModal() {
    signinModal.classList.remove("show");

    document.body.style.overflow = "";
  }
}

// =========================================
// UPDATE NAVBAR AFTER LOGIN
// =========================================

function updateNavbarAfterLogin(user) {
  const signinButton = document.querySelector(".sign-in-btn");

  if (!signinButton) {
    return;
  }

  // Get user's display name

  const displayName = user.displayName;

  // Get first letter

  const initial = displayName
    ? displayName.charAt(0).toUpperCase()
    : user.email.charAt(0).toUpperCase();

  // Change button

  signinButton.innerHTML = `
    <span class="user-initial">
      ${initial}
    </span>
    <span class="user-name">
      ${displayName || "Account"}
    </span>
  `;

  // Mark as logged in

  signinButton.classList.add("logged-in");
}

// =========================================
// SIGN IN ERROR
// =========================================

function showSigninError(message) {
  let errorElement = document.getElementById("signinError");

  // Create error element

  if (!errorElement) {
    errorElement = document.createElement("p");

    errorElement.id = "signinError";

    errorElement.className = "signin-error";

    const content = document.querySelector(".signin-modal-content");

    content.insertBefore(errorElement, content.firstChild);
  }

  errorElement.textContent = message;

  errorElement.style.display = "block";
}

// =========================================
// FIREBASE ERROR HANDLER
// =========================================

function showFirebaseAuthError(error) {
  let message = "Unable to sign in. Please try again.";

  switch (error.code) {
    case "auth/invalid-email":
      message = "Please enter a valid email address.";

      break;

    case "auth/invalid-credential":
      message = "Incorrect email or password.";

      break;

    case "auth/user-disabled":
      message = "This account has been disabled.";

      break;

    case "auth/too-many-requests":
      message = "Too many attempts. Please try again later.";

      break;

    case "auth/popup-closed-by-user":
      message = "Google sign-in was cancelled.";

      break;

    case "auth/popup-blocked":
      message = "Your browser blocked the Google sign-in popup.";

      break;

    case "auth/network-request-failed":
      message = "Network error. Please check your connection.";

      break;
  }

  showSigninError(message);
}
