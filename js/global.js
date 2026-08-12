import {
  signInWithEmail,
  signInWithGoogle,
  createAccount,
  resetPassword,
  listenToAuthState,
  signOutUser,
} from "./auth.js";

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
    initializeSignupModal();
    initializeForgotPasswordModal();
    initializeAuthState();
    initializeAccountDropdown();
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
  const forgotPasswordButton = document.querySelector(".forgot-password");
  const signinButton = document.querySelector(".sign-in-btn");
  const signinModal = document.getElementById("signinModal");
  const closeButton = document.getElementById("closeSigninModal");
  const signupLink = document.querySelector(".signup-link");

  // =========================================
  // INPUTS
  // =========================================

  const emailInput = document.getElementById("signinEmail");
  const passwordInput = document.getElementById("signinPassword");

  // =========================================
  // HIDE ERROR WHILE TYPING
  // =========================================

  [emailInput, passwordInput].forEach((input) => {
    input.addEventListener("input", () => {
      hideSigninError();
    });
  });

  // =========================================
  // BUTTONS
  // =========================================

  const signinSubmitButton = document.querySelector(".signin-submit-btn");
  const googleSigninButton = document.querySelector(".google-signin-btn");
  const passwordToggle = document.getElementById("passwordToggle");

  // =========================================
  // OPEN SIGNUP MODAL
  // =========================================

  signupLink.addEventListener("click", () => {
    signinModal.classList.remove("show");

    const signupModal = document.getElementById("signupModal");

    signupModal.classList.add("show");

    document.body.style.overflow = "hidden";

    document.getElementById("signupName").focus();
  });

  // =========================================
  // OPEN SIGN IN MODAL
  // =========================================

  signinButton.addEventListener("click", () => {
    if (signinButton.classList.contains("logged-in")) {
      return;
    }

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

    hideSigninError();

    // ---------------------------------------
    // VALIDATION
    // ---------------------------------------

    hideSigninError();

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

  // =========================================
  // OPEN FORGOT PASSWORD MODAL
  // =========================================

  forgotPasswordButton.addEventListener("click", () => {
    signinModal.classList.remove("show");

    const forgotModal = document.getElementById("forgotPasswordModal");

    forgotModal.classList.add("show");

    document.body.style.overflow = "hidden";

    document.getElementById("forgotPasswordEmail").focus();
  });
}

// =========================================
// AUTH SESSION
// =========================================

function initializeAuthState() {
  listenToAuthState((user) => {
    if (user) {
      // User is logged in
      updateNavbarAfterLogin(user);

      console.log("User is logged in:", user);
    } else {
      // User is logged out
      resetNavbarAfterLogout();

      console.log("No user is logged in.");
    }
  });
}

// =========================================
// UPDATE NAVBAR AFTER LOGIN
// =========================================

function updateNavbarAfterLogin(user) {
  const signinButton = document.querySelector(".sign-in-btn");

  const accountAvatar = document.querySelector(".account-avatar");

  const accountName = document.querySelector(".account-name");

  const accountEmail = document.querySelector(".account-email");

  if (!signinButton || !user) {
    return;
  }

  // -----------------------------------------
  // USER INFORMATION
  // -----------------------------------------

  const displayName = user.displayName || "Account";

  const email = user.email || "";

  const initial =
    displayName !== "Account"
      ? displayName.charAt(0).toUpperCase()
      : email.charAt(0).toUpperCase();

  // -----------------------------------------
  // UPDATE SIGN IN BUTTON
  // -----------------------------------------

  signinButton.innerHTML = `
        <span class="user-initial">
            ${initial}
        </span>

        <span class="user-name">
            ${displayName}
        </span>
    `;

  signinButton.classList.add("logged-in");

  // -----------------------------------------
  // UPDATE DROPDOWN
  // -----------------------------------------

  if (accountAvatar) {
    accountAvatar.textContent = initial;
  }

  if (accountName) {
    accountName.textContent = displayName;
  }

  if (accountEmail) {
    accountEmail.textContent = email;
  }
}

// =========================================
// UPDATE NAVBAR AFTER LOGIN
// =========================================

function resetNavbarAfterLogout() {
  const signinButton = document.querySelector(".sign-in-btn");

  if (!signinButton) {
    return;
  }

  signinButton.innerHTML = "Sign in";

  signinButton.classList.remove("logged-in");
}

// =========================================
// SIGN UP MODAL
// =========================================

function initializeSignupModal() {
  const signupModal = document.getElementById("signupModal");

  const closeButton = document.getElementById("closeSignupModal");

  const signupName = document.getElementById("signupName");

  const signupEmail = document.getElementById("signupEmail");

  const signupPassword = document.getElementById("signupPassword");

  const confirmPassword = document.getElementById("signupConfirmPassword");

  const signupButton = document.querySelector(".signup-submit-btn");

  const passwordToggle = document.getElementById("signupPasswordToggle");

  const confirmPasswordToggle = document.getElementById(
    "signupConfirmPasswordToggle",
  );

  const backToSignin = document.querySelector(".back-to-signin-btn");

  // =========================================
  // HIDE ERROR WHILE TYPING
  // =========================================

  const signupInputs = [
    signupName,
    signupEmail,
    signupPassword,
    confirmPassword,
  ];

  signupInputs.forEach((input) => {
    input.addEventListener("input", () => {
      hideSignupError();
    });
  });

  // =========================================
  // CLOSE
  // =========================================

  closeButton.addEventListener("click", closeSignupModal);

  // =========================================
  // CLICK OUTSIDE
  // =========================================

  signupModal.addEventListener("click", (event) => {
    if (event.target === signupModal) {
      closeSignupModal();
    }
  });

  // =========================================
  // ESC KEY
  // =========================================

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && signupModal.classList.contains("show")) {
      closeSignupModal();
    }
  });

  // =========================================
  // PASSWORD TOGGLE
  // =========================================

  passwordToggle.addEventListener("click", () => {
    if (signupPassword.type === "password") {
      signupPassword.type = "text";

      passwordToggle.textContent = "Hide";
    } else {
      signupPassword.type = "password";

      passwordToggle.textContent = "Show";
    }
  });

  // =========================================
  // CONFIRM PASSWORD TOGGLE
  // =========================================

  confirmPasswordToggle.addEventListener("click", () => {
    if (confirmPassword.type === "password") {
      confirmPassword.type = "text";

      confirmPasswordToggle.textContent = "Hide";
    } else {
      confirmPassword.type = "password";

      confirmPasswordToggle.textContent = "Show";
    }
  });

  // =========================================
  // BACK TO SIGN IN
  // =========================================

  backToSignin.addEventListener("click", () => {
    closeSignupModal();

    const signinModal = document.getElementById("signinModal");

    signinModal.classList.add("show");

    document.getElementById("signinEmail").focus();
  });

  // =========================================
  // CREATE ACCOUNT
  // =========================================

  signupButton.addEventListener("click", async () => {
    const name = signupName.value.trim();

    const email = signupEmail.value.trim();

    const password = signupPassword.value;

    const confirmPasswordValue = confirmPassword.value;

    // =========================================
    // VALIDATION
    // =========================================

    hideSignupError();

    // -----------------------------------------
    // NAME
    // -----------------------------------------

    if (!name) {
      showSignupError("Please enter your full name.");

      signupName.focus();

      return;
    }

    // -----------------------------------------
    // EMAIL
    // -----------------------------------------

    if (!email) {
      showSignupError("Please enter your email.");

      signupEmail.focus();

      return;
    }

    // -----------------------------------------
    // PASSWORD
    // -----------------------------------------

    if (!password) {
      showSignupError("Please create a password.");

      signupPassword.focus();

      return;
    }

    // -----------------------------------------
    // CONFIRM PASSWORD
    // -----------------------------------------

    if (!confirmPasswordValue) {
      showSignupError("Please confirm your password.");

      confirmPassword.focus();

      return;
    }

    // -----------------------------------------
    // PASSWORD LENGTH
    // -----------------------------------------

    if (password.length < 6) {
      showSignupError("Password must contain at least 6 characters.");

      signupPassword.focus();

      return;
    }

    // -----------------------------------------
    // PASSWORD MATCH
    // -----------------------------------------

    if (password !== confirmPasswordValue) {
      showSignupError("Passwords do not match.");

      confirmPassword.focus();

      return;
    }

    // =====================================
    // DISABLE BUTTON
    // =====================================

    signupButton.disabled = true;

    signupButton.textContent = "Creating account...";

    // =====================================
    // FIREBASE
    // =====================================

    const result = await createAccount(name, email, password);

    // =====================================
    // ENABLE BUTTON
    // =====================================

    signupButton.disabled = false;

    signupButton.textContent = "Create account";

    // =====================================
    // RESULT
    // =====================================

    if (result.success) {
      console.log("Account successfully created:", result.user);

      closeSignupModal();

      updateNavbarAfterLogin(result.user);
    } else {
      showFirebaseSignupError(result.error);
    }
  });

  // =========================================
  // CLOSE FUNCTION
  // =========================================

  function closeSignupModal() {
    signupModal.classList.remove("show");

    document.body.style.overflow = "";
  }
}

// =========================================
// FORGOT PASSWORD MODAL
// =========================================

function initializeForgotPasswordModal() {
  const forgotModal = document.getElementById("forgotPasswordModal");

  const closeButton = document.getElementById("closeForgotPasswordModal");

  const emailInput = document.getElementById("forgotPasswordEmail");

  const submitButton = document.querySelector(".forgot-submit-btn");

  const backToSignin = document.querySelector(".back-to-signin-from-forgot");

  const message = document.getElementById("forgotPasswordMessage");

  // =========================================
  // CLOSE MODAL
  // =========================================

  closeButton.addEventListener("click", closeForgotModal);

  // =========================================
  // CLICK OUTSIDE
  // =========================================

  forgotModal.addEventListener("click", (event) => {
    if (event.target === forgotModal) {
      closeForgotModal();
    }
  });

  // =========================================
  // ESC KEY
  // =========================================

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && forgotModal.classList.contains("show")) {
      closeForgotModal();
    }
  });

  // =========================================
  // HIDE MESSAGE WHILE TYPING
  // =========================================

  emailInput.addEventListener("input", () => {
    message.textContent = "";

    message.className = "forgot-message";
  });

  // =========================================
  // SEND RESET EMAIL
  // =========================================

  submitButton.addEventListener("click", async () => {
    const email = emailInput.value.trim();

    // -------------------------------
    // VALIDATION
    // -------------------------------

    if (!email) {
      showForgotError("Please enter your email.");

      emailInput.focus();

      return;
    }

    // -------------------------------
    // DISABLE BUTTON
    // -------------------------------

    submitButton.disabled = true;

    submitButton.textContent = "Sending...";

    // -------------------------------
    // FIREBASE
    // -------------------------------

    const result = await resetPassword(email);

    // -------------------------------
    // ENABLE BUTTON
    // -------------------------------

    submitButton.disabled = false;

    submitButton.textContent = "Send reset link";

    // -------------------------------
    // RESULT
    // -------------------------------

    if (result.success) {
      message.textContent =
        "If an account exists with this email, a password reset link has been sent. Please check your inbox and spam folder.";

      message.className = "forgot-message success";

      emailInput.value = "";
    } else {
      showFirebaseForgotError(result.error);
    }
  });

  // =========================================
  // BACK TO SIGN IN
  // =========================================

  backToSignin.addEventListener("click", () => {
    closeForgotModal();

    const signinModal = document.getElementById("signinModal");

    signinModal.classList.add("show");

    document.getElementById("signinEmail").focus();
  });

  // =========================================
  // CLOSE FUNCTION
  // =========================================

  function closeForgotModal() {
    forgotModal.classList.remove("show");

    document.body.style.overflow = "";
  }

  // =========================================
  // ERROR MESSAGE
  // =========================================

  function showForgotError(text) {
    message.textContent = text;

    message.className = "forgot-message error";
  }

  // =========================================
  // FIREBASE ERROR
  // =========================================

  function showFirebaseForgotError(error) {
    let text = "Unable to send reset email. Please try again.";

    switch (error.code) {
      case "auth/invalid-email":
        text = "Please enter a valid email address.";

        break;

      case "auth/user-not-found":
        text =
          "If an account exists with this email, a password reset link has been sent. Please check your inbox and spam folder.";
        break;

      case "auth/network-request-failed":
        text = "Network error. Please check your connection.";

        break;
    }

    showForgotError(text);
  }
}

// =========================================
// ACCOUNT DROPDOWN
// =========================================

function initializeAccountDropdown() {
  const accountWrapper = document.querySelector(".account-wrapper");

  const signinButton = document.querySelector(".sign-in-btn");

  const accountDropdown = document.querySelector(".account-dropdown");

  const signOutButton = document.querySelector(".account-logout");

  if (!accountWrapper || !signinButton || !accountDropdown) {
    return;
  }

  // -----------------------------------------
  // OPEN / CLOSE DROPDOWN
  // -----------------------------------------

  signinButton.addEventListener("click", (event) => {
    // Only open dropdown when logged in
    if (!signinButton.classList.contains("logged-in")) {
      return;
    }

    event.stopPropagation();

    accountDropdown.classList.toggle("show");
  });

  // -----------------------------------------
  // CLOSE WHEN CLICKING OUTSIDE
  // -----------------------------------------

  document.addEventListener("click", (event) => {
    if (!accountWrapper.contains(event.target)) {
      accountDropdown.classList.remove("show");
    }
  });

  // -----------------------------------------
  // ESC KEY
  // -----------------------------------------

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      accountDropdown.classList.remove("show");
    }
  });

  // =========================================
  // SIGN OUT
  // =========================================

  signOutButton.addEventListener("click", async () => {
    signOutButton.disabled = true;

    signOutButton.textContent = "Signing out...";

    const result = await signOutUser();

    if (result.success) {
      accountDropdown.classList.remove("show");

      console.log("Signed out.");
    } else {
      signOutButton.disabled = false;

      signOutButton.textContent = "Sign out";

      console.error("Could not sign out:", result.error);
    }
  });
}

// =========================================
// SIGNUP ERROR MESSAGE
// =========================================

function showSignupError(message) {
  const errorElement = document.getElementById("signupError");

  errorElement.textContent = message;

  errorElement.style.display = "block";
}

// =========================================
// HIDE SIGNUP ERROR
// =========================================

function hideSignupError() {
  const errorElement = document.getElementById("signupError");

  errorElement.textContent = "";

  errorElement.style.display = "none";
}

// =========================================
// FIREBASE SIGNUP ERROR HANDLER
// =========================================

function showFirebaseSignupError(error) {
  let message = "Unable to create your account. Please try again.";

  switch (error.code) {
    // -------------------------------------
    // EMAIL ALREADY EXISTS
    // -------------------------------------

    case "auth/email-already-in-use":
      message = "An account already exists with this email.";

      break;

    // -------------------------------------
    // INVALID EMAIL
    // -------------------------------------

    case "auth/invalid-email":
      message = "Please enter a valid email address.";

      break;

    // -------------------------------------
    // WEAK PASSWORD
    // -------------------------------------

    case "auth/weak-password":
      message = "Password is too weak. Please choose a stronger password.";

      break;

    // -------------------------------------
    // NETWORK ERROR
    // -------------------------------------

    case "auth/network-request-failed":
      message = "Network error. Please check your connection.";

      break;
  }

  showSignupError(message);
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

// =========================================
// SHOW SIGN IN ERROR
// =========================================

function showSigninError(message) {
  const errorElement = document.getElementById("signinError");

  errorElement.textContent = message;

  errorElement.style.display = "block";
}

// =========================================
// HIDE SIGN IN ERROR
// =========================================

function hideSigninError() {
  const errorElement = document.getElementById("signinError");

  errorElement.textContent = "";

  errorElement.style.display = "none";
}
