/* =========================================
   BOOKITBRO
   PAYMENT PAGE
========================================= */

import { auth, db } from "./firebase.js";

import {
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

/* =========================================
   STATE
========================================= */

let paymentData = null;

let selectedMethod = "upi";

/* =========================================
   LOAD PAYMENT DATA
========================================= */

function loadPaymentData() {
  const storedData = sessionStorage.getItem("bookItBroPayment");

  if (!storedData) {
    showPaymentError();
    return false;
  }

  try {
    paymentData = JSON.parse(storedData);

    console.log("Payment Data:", paymentData);

    return true;
  } catch (error) {
    console.error("Unable to read payment data:", error);

    showPaymentError();

    return false;
  }
}

/* =========================================
   DISPLAY BOOKING
========================================= */

function displayBooking() {
  if (paymentData.bookingType === "sports") {
    displaySportsBooking();
  } else {
    displayMovieBooking();
  }
}

/* =========================================
   DISPLAY MOVIE BOOKING
========================================= */

function displayMovieBooking() {
  const movieSection = document.getElementById("movieBookingDetails");
  const sportsSection = document.getElementById("sportsBookingDetails");

  movieSection.style.display = "block";
  sportsSection.style.display = "none";

  document.getElementById("bookingHeading").textContent =
    paymentData.paymentMode === "frozen-confirmation"
      ? "Confirm Your Frozen Ticket"
      : "Your Booking";

  document.getElementById("bookingSubheading").textContent =
    paymentData.paymentMode === "frozen-confirmation"
      ? "Complete the remaining payment to confirm your ticket"
      : "Review your movie booking details";

  document.getElementById("movieTitle").textContent =
    paymentData.movieTitle || "Movie";

  document.getElementById("movieMeta").textContent =
    `${paymentData.language || "Movie"} • ${paymentData.certificate || "UA"}`;

  const poster = paymentData.moviePoster || paymentData.poster || "";

  const posterElement = document.getElementById("moviePoster");

  posterElement.style.display = "";

  if (poster) {
    posterElement.src = poster;

    posterElement.onerror = () => {
      posterElement.style.display = "none";
    };
  } else {
    posterElement.style.display = "none";
  }

  document.getElementById("theatreName").textContent =
    paymentData.theatreName || "Theatre";

  document.getElementById("screenName").textContent =
    paymentData.screen || "Screen 1";

  document.getElementById("showDate").textContent = formatDate(
    paymentData.date,
  );

  document.getElementById("showTime").textContent = paymentData.showTime || "—";

  // =========================================
  // SEATS
  // =========================================

  // For frozen ticket confirmation, show only frozen seats.
  const seats =
    paymentData.paymentMode === "frozen-confirmation"
      ? Array.isArray(paymentData.frozenSeats)
        ? paymentData.frozenSeats
        : []
      : Array.isArray(paymentData.seats)
        ? paymentData.seats
        : [];

  document.getElementById("selectedSeats").textContent = seats.length
    ? seats.join(", ")
    : "No seats selected";
}

/* =========================================
   DISPLAY SPORTS BOOKING
========================================= */

function displaySportsBooking() {
  const movieSection = document.getElementById("movieBookingDetails");
  const sportsSection = document.getElementById("sportsBookingDetails");

  movieSection.style.display = "none";
  sportsSection.style.display = "block";

  document.getElementById("bookingHeading").textContent =
    paymentData.paymentMode === "frozen-confirmation"
      ? "Confirm Your Frozen Ticket"
      : "Your Sports Booking";

  document.getElementById("bookingSubheading").textContent =
    paymentData.paymentMode === "frozen-confirmation"
      ? "Complete the remaining payment to confirm your ticket"
      : "Review your sports event details";

  document.getElementById("sportsEventName").textContent =
    paymentData.eventName ||
    `${paymentData.homeTeam || "Home Team"} VS ${
      paymentData.awayTeam || "Away Team"
    }`;

  document.getElementById("sportsLeague").textContent =
    paymentData.league || "Sports Event";

  document.getElementById("sportsSport").textContent =
    paymentData.sport || "Sports";

  document.getElementById("sportsVenue").textContent =
    paymentData.venue || "Venue";

  document.getElementById("sportsDate").textContent = formatDate(
    paymentData.date,
  );

  document.getElementById("sportsTime").textContent =
    paymentData.showTime || "—";

  const homeTeam = paymentData.homeTeam || "Home Team";
  const awayTeam = paymentData.awayTeam || "Away Team";

  document.getElementById("sportsTeams").textContent =
    `${homeTeam} VS ${awayTeam}`;

  const poster = paymentData.poster || "";
  const posterElement = document.getElementById("sportsPoster");

  posterElement.style.display = "";

  if (poster) {
    posterElement.src = poster;

    posterElement.onerror = () => {
      posterElement.style.display = "none";
    };
  } else {
    posterElement.style.display = "none";
  }
}

/* =========================================
   DISPLAY PRICE
========================================= */

function displayPrice() {
  const isFrozenConfirmation =
    paymentData.paymentMode === "frozen-confirmation";

  const ticketCount =
    paymentData.paymentMode === "frozen-confirmation"
      ? Array.isArray(paymentData.frozenSeats)
        ? paymentData.frozenSeats.length
        : Number(paymentData.frozenSeatCount) || 0
      : Number(paymentData.ticketCount) || 0;

  const ticketAmount = isFrozenConfirmation
    ? Number(paymentData.frozenRemainingAmount || paymentData.totalAmount || 0)
    : Number(paymentData.ticketAmountPayNow || paymentData.baseAmount || 0);

  const foodAmount = isFrozenConfirmation
    ? 0
    : Number(paymentData.foodAmount) || 0;

  const foodItemCount = isFrozenConfirmation
    ? 0
    : Number(paymentData.foodItemCount) || 0;

  const convenienceFee = isFrozenConfirmation
    ? 0
    : Number(paymentData.convenienceFee) || 0;

  const gst = isFrozenConfirmation ? 0 : Number(paymentData.gst) || 0;

  const totalAmount = isFrozenConfirmation
    ? Number(paymentData.frozenRemainingAmount || paymentData.totalAmount || 0)
    : Number(paymentData.totalAmount) || 0;

  const ticketPriceElement = document.getElementById("ticketPrice");

  if (ticketPriceElement) {
    ticketPriceElement.textContent = formatCurrency(ticketAmount);
  }

  const ticketCountElement = document.getElementById("ticketCount");

  if (ticketCountElement) {
    ticketCountElement.textContent = `${ticketCount} ticket${ticketCount === 1 ? "" : "s"}`;
  }

  const foodRow = document.getElementById("foodPaymentRow");
  const foodAmountElement = document.getElementById("foodAmount");
  const foodCountElement = document.getElementById("foodItemCount");

  if (foodRow) {
    foodRow.style.display = foodAmount > 0 ? "flex" : "none";
  }

  if (foodAmountElement) {
    foodAmountElement.textContent = formatCurrency(foodAmount);
  }

  if (foodCountElement) {
    foodCountElement.textContent = `${foodItemCount} item${foodItemCount === 1 ? "" : "s"}`;
  }

  const convenienceFeeElement = document.getElementById("convenienceFee");

  if (convenienceFeeElement) {
    convenienceFeeElement.textContent = formatCurrency(convenienceFee);
  }

  const gstElement = document.getElementById("gst");

  if (gstElement) {
    gstElement.textContent = formatCurrency(gst);
  }

  const totalAmountElement = document.getElementById("totalAmount");

  if (totalAmountElement) {
    totalAmountElement.textContent = formatCurrency(totalAmount);
  }

  const payAmountElement = document.getElementById("payAmount");

  if (payAmountElement) {
    payAmountElement.textContent = formatCurrency(totalAmount);
  }

  /*
    Update Pay button text for frozen tickets.
  */

  const payButton = document.getElementById("payButton");

  if (payButton && isFrozenConfirmation) {
    const payText = payButton.querySelector("span");

    if (payText) {
      payText.textContent = "Confirm & Pay";
    }
  }
}

/* =========================================
   PAYMENT METHOD TABS
========================================= */

function setupPaymentMethods() {
  const buttons = document.querySelectorAll(".method-button");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      selectPaymentMethod(button.dataset.method);
    });
  });
}

/* =========================================
   SELECT PAYMENT METHOD
========================================= */

function selectPaymentMethod(method) {
  selectedMethod = method;

  document.querySelectorAll(".method-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.method === method);
  });

  document.querySelectorAll(".payment-form").forEach((form) => {
    form.classList.remove("active");
  });

  const selectedForm = document.getElementById(`${method}Form`);

  if (selectedForm) {
    selectedForm.classList.add("active");
  }
}

/* =========================================
   PAYMENT VALIDATION
========================================= */

function validatePayment() {
  if (selectedMethod === "upi") {
    const upi = document.getElementById("upiId").value.trim();

    if (!upi) {
      alert("Please enter your UPI ID.");

      document.getElementById("upiId").focus();

      return false;
    }

    const upiPattern = /^[\w.-]+@[\w.-]+$/;

    if (!upiPattern.test(upi)) {
      alert("Please enter a valid UPI ID.");

      document.getElementById("upiId").focus();

      return false;
    }
  }

  if (selectedMethod === "card") {
    const cardNumber = document
      .getElementById("cardNumber")
      .value.replace(/\s/g, "");

    const cardName = document.getElementById("cardName").value.trim();

    const expiry = document.getElementById("expiry").value.trim();

    const cvv = document.getElementById("cvv").value.trim();

    if (!/^\d{16}$/.test(cardNumber)) {
      alert("Please enter a valid 16-digit card number.");

      document.getElementById("cardNumber").focus();

      return false;
    }

    if (!cardName) {
      alert("Please enter the cardholder name.");

      document.getElementById("cardName").focus();

      return false;
    }

    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      alert("Please enter expiry in MM/YY format.");

      document.getElementById("expiry").focus();

      return false;
    }

    if (!/^\d{3}$/.test(cvv)) {
      alert("Please enter a valid 3-digit CVV.");

      document.getElementById("cvv").focus();

      return false;
    }
  }

  if (selectedMethod === "netbanking") {
    const bank = document.getElementById("bank").value;

    if (!bank) {
      alert("Please select your bank.");

      document.getElementById("bank").focus();

      return false;
    }
  }

  if (selectedMethod === "wallet") {
    const wallet = document.getElementById("wallet").value;

    if (!wallet) {
      alert("Please select a wallet.");

      document.getElementById("wallet").focus();

      return false;
    }
  }

  return true;
}

/* =========================================
   PROCESS PAYMENT
========================================= */

function processPayment() {
  if (!validatePayment()) {
    return;
  }

  const processingModal = document.getElementById("processingModal");

  processingModal.classList.remove("hidden");

  setTimeout(async () => {
    try {
      processingModal.classList.add("hidden");

      await completePayment();
    } catch (error) {
      processingModal.classList.add("hidden");

      console.error("Payment processing error:", error);

      alert(
        error.message || "Payment could not be completed. Please try again.",
      );
    }
  }, 1800);
}

/* =========================================
   COMPLETE PAYMENT
========================================= */

async function completePayment() {
  if (paymentData.paymentMode === "frozen-confirmation") {
    await confirmFrozenBooking();

    return;
  }

  /*
    Normal booking payment.
  */

  const bookingId = generateBookingId();

  const confirmationData = {
    ...paymentData,

    bookingId,

    bookingStatus: "CONFIRMED",

    paymentStatus: "SUCCESS",

    paymentMethod: selectedMethod,

    paymentDate: new Date().toISOString(),
  };

  await saveBookingToFirebase(confirmationData);

  sessionStorage.setItem(
    "bookItBroConfirmation",
    JSON.stringify(confirmationData),
  );

  showSuccessAndRedirect();
}

/* =========================================
   SAVE NEW BOOKING TO FIREBASE
========================================= */

async function saveBookingToFirebase(confirmationData) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User is not signed in.");
  }

  const bookingRef = doc(
    db,
    "users",
    user.uid,
    "bookings",
    confirmationData.bookingId,
  );

  await setDoc(bookingRef, {
    ...confirmationData,

    userId: user.uid,

    userEmail: user.email || "",

    bookingStatus: "CONFIRMED",

    paymentStatus: "SUCCESS",

    createdAt: serverTimestamp(),

    updatedAt: serverTimestamp(),
  });

  console.log("New booking saved successfully:", confirmationData.bookingId);
}

/* =========================================
   CONFIRM FROZEN BOOKING
========================================= */

async function confirmFrozenBooking() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User is not signed in.");
  }

  const bookingDocumentId =
    paymentData.firestoreDocumentId || paymentData.existingBookingId;

  if (!bookingDocumentId) {
    throw new Error("Frozen booking information was not found.");
  }

  const bookingRef = doc(db, "users", user.uid, "bookings", bookingDocumentId);

  // Remaining amount paid now
  const remainingAmount = Number(
    paymentData.frozenRemainingAmount || paymentData.remainingAmount || 0,
  );

  // Amount already paid during seat freezing
  const advanceAmount = Number(paymentData.frozenAdvanceAmount || 0);

  // Final total paid for frozen seats
  const finalFrozenAmount = remainingAmount + advanceAmount;

  // Previously confirmed seats
  const existingConfirmedSeats = Array.isArray(paymentData.confirmedSeats)
    ? paymentData.confirmedSeats
    : [];

  // Seats that were frozen
  const frozenSeats = Array.isArray(paymentData.frozenSeats)
    ? paymentData.frozenSeats
    : [];

  // Move frozen seats into confirmed seats
  const finalConfirmedSeats = [...existingConfirmedSeats, ...frozenSeats];

  // Prevent duplicate seats
  const uniqueConfirmedSeats = [...new Set(finalConfirmedSeats)];

  // =========================================
  // UPDATE SAME FIRESTORE BOOKING
  // =========================================

  await updateDoc(bookingRef, {
    bookingStatus: "CONFIRMED",

    frozenStatus: "COMPLETED",

    paymentStatus: "SUCCESS",

    paymentMethod: selectedMethod,

    // Move all frozen seats to confirmed
    confirmedSeats: uniqueConfirmedSeats,

    confirmedSeatCount: uniqueConfirmedSeats.length,

    // No seats remain frozen
    frozenSeats: [],

    frozenSeatCount: 0,

    // Payment information
    remainingAmountPaid: remainingAmount,

    frozenRemainingAmount: 0,

    confirmedAmount: finalFrozenAmount,

    totalAmount: finalFrozenAmount,

    paymentDate: new Date().toISOString(),

    updatedAt: serverTimestamp(),
  });

  console.log("Frozen booking confirmed successfully:", bookingDocumentId);

  // =========================================
  // CONFIRMATION PAGE DATA
  // =========================================

  const confirmationData = {
    ...paymentData,

    bookingId:
      paymentData.bookingId ||
      paymentData.existingBookingId ||
      bookingDocumentId,

    firestoreDocumentId: bookingDocumentId,

    bookingStatus: "CONFIRMED",

    frozenStatus: "COMPLETED",

    paymentStatus: "SUCCESS",

    paymentMethod: selectedMethod,

    paymentDate: new Date().toISOString(),

    // Final confirmed seats
    confirmedSeats: uniqueConfirmedSeats,

    confirmedSeatCount: uniqueConfirmedSeats.length,

    // No frozen seats remain
    frozenSeats: [],

    frozenSeatCount: 0,

    remainingAmountPaid: remainingAmount,

    frozenRemainingAmount: 0,

    confirmedAmount: finalFrozenAmount,

    totalAmount: finalFrozenAmount,
  };

  sessionStorage.setItem(
    "bookItBroConfirmation",
    JSON.stringify(confirmationData),
  );

  showSuccessAndRedirect();
}

/* =========================================
   SHOW SUCCESS AND REDIRECT
========================================= */

function showSuccessAndRedirect() {
  const successModal = document.getElementById("successModal");

  if (successModal) {
    successModal.classList.remove("hidden");
  }

  setTimeout(() => {
    window.location.href = "confirmation.html";
  }, 1200);
}

/* =========================================
   FORMAT CURRENCY
========================================= */

function formatCurrency(amount) {
  return `₹${(Number(amount) || 0).toFixed(2)}`;
}

/* =========================================
   FORMAT DATE
========================================= */

function formatDate(dateValue) {
  if (!dateValue) {
    return "—";
  }

  let date;

  /*
    Firestore Timestamp.
  */

  if (typeof dateValue.toDate === "function") {
    date = dateValue.toDate();
  } else {
    date = new Date(dateValue);
  }

  if (Number.isNaN(date.getTime())) {
    return String(dateValue);
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* =========================================
   GENERATE BOOKING ID
========================================= */

function generateBookingId() {
  const timestamp = Date.now().toString().slice(-8);

  const random = Math.floor(100 + Math.random() * 900);

  return `BIB${timestamp}${random}`;
}

/* =========================================
   CARD NUMBER FORMAT
========================================= */

function setupCardNumberFormatting() {
  const input = document.getElementById("cardNumber");

  if (!input) {
    return;
  }

  input.addEventListener("input", () => {
    let value = input.value.replace(/\D/g, "");

    value = value.substring(0, 16);

    const groups = value.match(/.{1,4}/g);

    input.value = groups ? groups.join(" ") : "";
  });
}

/* =========================================
   EXPIRY FORMAT
========================================= */

function setupExpiryFormatting() {
  const input = document.getElementById("expiry");

  if (!input) {
    return;
  }

  input.addEventListener("input", () => {
    let value = input.value.replace(/\D/g, "");

    value = value.substring(0, 4);

    if (value.length >= 3) {
      value = value.substring(0, 2) + "/" + value.substring(2);
    }

    input.value = value;
  });
}

/* =========================================
   CVV FORMAT
========================================= */

function setupCVV() {
  const input = document.getElementById("cvv");

  if (!input) {
    return;
  }

  input.addEventListener("input", () => {
    input.value = input.value.replace(/\D/g, "").substring(0, 3);
  });
}

/* =========================================
   BACK BUTTON
========================================= */

function setupBackButton() {
  const button = document.getElementById("backButton");

  if (!button) {
    return;
  }

  button.addEventListener("click", () => {
    window.history.back();
  });
}

/* =========================================
   PAYMENT ERROR
========================================= */

function showPaymentError() {
  document.body.innerHTML = `
    <div style="
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: #f5f5f7;
      font-family: Arial, sans-serif;
      text-align: center;
    ">

      <div style="max-width: 420px;">

        <div style="
          font-size: 50px;
          margin-bottom: 15px;
        ">
          ⚠️
        </div>

        <h2 style="margin-bottom: 10px;">
          Payment Information Not Found
        </h2>

        <p style="
          color: #777;
          line-height: 1.6;
          margin-bottom: 22px;
        ">
          Your booking information could not be found.
          Please return to the booking summary and try again.
        </p>

        <button
          onclick="history.back()"
          style="
            border: none;
            padding: 12px 24px;
            border-radius: 7px;
            background: #e51937;
            color: white;
            font-weight: 600;
            cursor: pointer;
          "
        >
          Go Back
        </button>

      </div>

    </div>
  `;
}

/* =========================================
   INITIALIZE
========================================= */

function initialize() {
  const loaded = loadPaymentData();

  if (!loaded) {
    return;
  }

  displayBooking();

  displayPrice();

  setupPaymentMethods();

  setupCardNumberFormatting();

  setupExpiryFormatting();

  setupCVV();

  setupBackButton();

  const payButton = document.getElementById("payButton");

  if (payButton) {
    payButton.addEventListener("click", processPayment);
  }
}

/* =========================================
   START
========================================= */

initialize();
