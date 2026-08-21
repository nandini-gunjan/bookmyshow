/* =========================================
   BOOKITBRO
   PAYMENT PAGE
========================================= */
import { auth, db } from "./firebase.js";

import {
  doc,
  setDoc,
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

// =========================================
// DISPLAY BOOKING
// =========================================

function displayBooking() {
  /*
      Check booking type.

      Sports bookings contain:
      bookingType: "sports"

      Movie bookings either contain:
      bookingType: "movie"
      or have no bookingType.
  */

  if (paymentData.bookingType === "sports") {
    displaySportsBooking();
  } else {
    displayMovieBooking();
  }
}

// =========================================
// DISPLAY MOVIE BOOKING
// =========================================

function displayMovieBooking() {
  const movieSection = document.getElementById("movieBookingDetails");

  const sportsSection = document.getElementById("sportsBookingDetails");

  /*
      Show movie section.
  */

  movieSection.style.display = "block";

  sportsSection.style.display = "none";

  /*
      Heading.
  */

  document.getElementById("bookingHeading").textContent = "Your Booking";

  document.getElementById("bookingSubheading").textContent =
    "Review your movie booking details";

  /*
      Movie title.
  */

  document.getElementById("movieTitle").textContent =
    paymentData.movieTitle || "Movie";

  /*
      Movie metadata.
  */

  document.getElementById("movieMeta").textContent =
    `${paymentData.language || "Movie"} • ${paymentData.certificate || "UA"}`;

  /*
      Poster.
  */

  const poster = paymentData.moviePoster || paymentData.poster || "";

  const posterElement = document.getElementById("moviePoster");

  if (poster) {
    posterElement.src = poster;

    posterElement.onerror = () => {
      posterElement.style.display = "none";
    };
  } else {
    posterElement.style.display = "none";
  }

  /*
      Theatre.
  */

  document.getElementById("theatreName").textContent =
    paymentData.theatreName || "Theatre";

  /*
      Screen.
  */

  document.getElementById("screenName").textContent =
    paymentData.screen || "Screen 1";

  /*
      Date.
  */

  document.getElementById("showDate").textContent = formatDate(
    paymentData.date,
  );

  /*
      Showtime.
  */

  document.getElementById("showTime").textContent = paymentData.showTime || "—";

  /*
      Seats.
  */

  const seats = Array.isArray(paymentData.seats) ? paymentData.seats : [];

  document.getElementById("selectedSeats").textContent = seats.length
    ? seats.join(", ")
    : "No seats selected";
}

// =========================================
// DISPLAY SPORTS BOOKING
// =========================================

function displaySportsBooking() {
  const movieSection = document.getElementById("movieBookingDetails");

  const sportsSection = document.getElementById("sportsBookingDetails");

  /*
      Hide movie section.
  */

  movieSection.style.display = "none";

  /*
      Show sports section.
  */

  sportsSection.style.display = "block";

  /*
      Heading.
  */

  document.getElementById("bookingHeading").textContent = "Your Sports Booking";

  document.getElementById("bookingSubheading").textContent =
    "Review your sports event details";

  /*
      Event name.
  */

  document.getElementById("sportsEventName").textContent =
    paymentData.eventName || "Sports Event";

  /*
      League.
  */

  document.getElementById("sportsLeague").textContent =
    paymentData.league || "Sports Event";

  /*
      Sport.
  */

  document.getElementById("sportsSport").textContent =
    paymentData.sport || "Sports";

  /*
      Venue.
  */

  document.getElementById("sportsVenue").textContent =
    paymentData.venue || "Venue";

  /*
      Date.
  */

  document.getElementById("sportsDate").textContent = formatDate(
    paymentData.date,
  );

  /*
      Time.
  */

  document.getElementById("sportsTime").textContent =
    paymentData.showTime || "—";

  /*
      Teams.
  */

  const homeTeam = paymentData.homeTeam || "Home Team";

  const awayTeam = paymentData.awayTeam || "Away Team";

  document.getElementById("sportsTeams").textContent =
    `${homeTeam} VS ${awayTeam}`;

  /*
      Sports poster.
  */

  const poster = paymentData.poster || "";

  const posterElement = document.getElementById("sportsPoster");

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
  /* =====================================
     AMOUNTS
  ====================================== */

  const ticketCount = Number(paymentData.ticketCount) || 0;

  const ticketAmount = Number(paymentData.ticketAmountPayNow) || 0;

  const foodAmount = Number(paymentData.foodAmount) || 0;

  const foodItemCount = Number(paymentData.foodItemCount) || 0;

  const baseAmount = Number(paymentData.baseAmount) || 0;

  const convenienceFee = Number(paymentData.convenienceFee) || 0;

  const gst = Number(paymentData.gst) || 0;

  const totalAmount = Number(paymentData.totalAmount) || 0;

  /* =====================================
     TICKET AMOUNT
  ====================================== */

  const ticketPriceElement = document.getElementById("ticketPrice");

  if (ticketPriceElement) {
    ticketPriceElement.textContent = formatCurrency(ticketAmount);
  }

  /* =====================================
     TICKET COUNT
  ====================================== */

  const ticketCountElement = document.getElementById("ticketCount");

  if (ticketCountElement) {
    ticketCountElement.textContent = `${ticketCount} ticket${
      ticketCount === 1 ? "" : "s"
    }`;
  }

  /* =====================================
     FOOD AMOUNT

     These elements are optional so the
     page will still work until you update
     payment.html.
  ====================================== */

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
    foodCountElement.textContent = `${foodItemCount} item${
      foodItemCount === 1 ? "" : "s"
    }`;
  }

  /* =====================================
     BASE AMOUNT

     Optional display element.
  ====================================== */

  const baseAmountElement = document.getElementById("baseAmount");

  if (baseAmountElement) {
    baseAmountElement.textContent = formatCurrency(baseAmount);
  }

  /* =====================================
     CONVENIENCE FEE
  ====================================== */

  const convenienceFeeElement = document.getElementById("convenienceFee");

  if (convenienceFeeElement) {
    convenienceFeeElement.textContent = formatCurrency(convenienceFee);
  }

  /* =====================================
     GST
  ====================================== */

  const gstElement = document.getElementById("gst");

  if (gstElement) {
    gstElement.textContent = formatCurrency(gst);
  }

  /* =====================================
     TOTAL AMOUNT
  ====================================== */

  const totalAmountElement = document.getElementById("totalAmount");

  if (totalAmountElement) {
    totalAmountElement.textContent = formatCurrency(totalAmount);
  }

  /* =====================================
     PAY BUTTON AMOUNT
  ====================================== */

  const payAmountElement = document.getElementById("payAmount");

  if (payAmountElement) {
    payAmountElement.textContent = formatCurrency(totalAmount);
  }
}

/* =========================================
   PAYMENT METHOD TABS
========================================= */

function setupPaymentMethods() {
  const buttons = document.querySelectorAll(".method-button");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const method = button.dataset.method;

      selectPaymentMethod(method);
    });
  });
}

/* =========================================
   SELECT PAYMENT METHOD
========================================= */

function selectPaymentMethod(method) {
  selectedMethod = method;

  /*
        Update buttons
    */

  document.querySelectorAll(".method-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.method === method);
  });

  /*
        Hide all forms
    */

  document.querySelectorAll(".payment-form").forEach((form) => {
    form.classList.remove("active");
  });

  /*
        Show selected form
    */

  const selectedForm = document.getElementById(`${method}Form`);

  if (selectedForm) {
    selectedForm.classList.add("active");
  }
}

/* =========================================
   PAYMENT VALIDATION
========================================= */

function validatePayment() {
  /*
        UPI
    */

  if (selectedMethod === "upi") {
    const upi = document.getElementById("upiId").value.trim();

    if (!upi) {
      alert("Please enter your UPI ID.");

      document.getElementById("upiId").focus();

      return false;
    }

    /*
            Basic UPI format.
        */

    const upiPattern = /^[\w.-]+@[\w.-]+$/;

    if (!upiPattern.test(upi)) {
      alert("Please enter a valid UPI ID.");

      document.getElementById("upiId").focus();

      return false;
    }
  }

  /*
        CARD
    */

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

  /*
        NET BANKING
    */

  if (selectedMethod === "netbanking") {
    const bank = document.getElementById("bank").value;

    if (!bank) {
      alert("Please select your bank.");

      document.getElementById("bank").focus();

      return false;
    }
  }

  /*
        WALLET
    */

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
   FORMAT CURRENCY
========================================= */

function formatCurrency(amount) {
  return `₹${Number(amount).toFixed(2)}`;
}

/* =========================================
   FORMAT DATE
========================================= */

function formatDate(dateString) {
  if (!dateString) {
    return "—";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* =========================================
   PROCESS PAYMENT
========================================= */

function processPayment() {
  /*
        Validate payment first.
    */

  if (!validatePayment()) {
    return;
  }

  const processingModal = document.getElementById("processingModal");

  processingModal.classList.remove("hidden");

  /*
        Demo payment processing.

        We are NOT charging a real
        card / UPI account.
    */

  setTimeout(async () => {
    processingModal.classList.add("hidden");

    await completePayment();
  }, 1800);
}

/* =========================================
   SAVE BOOKING TO FIREBASE
========================================= */

async function saveBookingToFirebase(confirmationData) {
  const user = auth.currentUser;

  /*
      User must be signed in.
  */

  if (!user) {
    throw new Error("User is not signed in.");
  }

  /*
      Create booking document.

      Path:

      users
        └── USER UID
              └── bookings
                    └── BOOKING ID
  */

  const bookingRef = doc(
    db,
    "users",
    user.uid,
    "bookings",
    confirmationData.bookingId,
  );

  /*
      Save complete booking data.
  */

  await setDoc(bookingRef, {
    ...confirmationData,

    userId: user.uid,

    userEmail: user.email || "",

    bookingStatus: "CONFIRMED",

    paymentStatus: "SUCCESS",

    createdAt: serverTimestamp(),

    updatedAt: serverTimestamp(),
  });

  console.log("Booking saved successfully:", confirmationData.bookingId);
}

/* =========================================
   COMPLETE PAYMENT
========================================= */

async function completePayment() {
  try {
    const bookingId = generateBookingId();

    const confirmationData = {
      ...paymentData,
      bookingId,
      bookingStatus: "CONFIRMED",
      paymentStatus: "SUCCESS",
      paymentMethod: selectedMethod,
      paymentDate: new Date().toISOString(),
    };

    console.log("Firebase user:", auth.currentUser);
    console.log("Firebase UID:", auth.currentUser?.uid);
    console.log("Payment data:", paymentData);
    console.log("Confirmation data:", confirmationData);

    await saveBookingToFirebase(confirmationData);

    console.log("Booking saved successfully!");

    sessionStorage.setItem(
      "bookItBroConfirmation",
      JSON.stringify(confirmationData),
    );

    const successModal = document.getElementById("successModal");
    successModal.classList.remove("hidden");

    setTimeout(() => {
      window.location.href = "confirmation.html";
    }, 1200);
  } catch (error) {
    console.error("========== FIRESTORE ERROR ==========");
    console.error("Error object:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    console.error("====================================");

    alert(
      `Booking could not be saved.\n\nCode: ${error.code}\nMessage: ${error.message}`,
    );
  }
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
   CVV
========================================= */

function setupCVV() {
  const input = document.getElementById("cvv");

  input.addEventListener("input", () => {
    input.value = input.value.replace(/\D/g, "").substring(0, 3);
  });
}

/* =========================================
   BACK BUTTON
========================================= */

function setupBackButton() {
  document.getElementById("backButton").addEventListener("click", () => {
    window.history.back();
  });
}

/* =========================================
   PAYMENT ERROR
========================================= */

function showPaymentError() {
  document.body.innerHTML = `

        <div style="
            min-height:100vh;
            display:flex;
            align-items:center;
            justify-content:center;
            padding:20px;
            background:#f5f5f7;
            font-family:Arial,sans-serif;
            text-align:center;
        ">

            <div style="
                max-width:420px;
            ">

                <div style="
                    font-size:50px;
                    margin-bottom:15px;
                ">
                    ⚠️
                </div>

                <h2 style="
                    margin-bottom:10px;
                ">
                    Payment Information Not Found
                </h2>

                <p style="
                    color:#777;
                    line-height:1.6;
                    margin-bottom:22px;
                ">
                    Your booking information could not
                    be found. Please return to the
                    booking summary and try again.
                </p>

                <button
                    onclick="history.back()"
                    style="
                        border:none;
                        padding:12px 24px;
                        border-radius:7px;
                        background:#e51937;
                        color:white;
                        font-weight:600;
                        cursor:pointer;
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
  /*
        Load payment data.
    */

  const loaded = loadPaymentData();

  if (!loaded) {
    return;
  }

  /*
        Display booking.
    */

  displayBooking();

  /*
        Display price.
    */

  displayPrice();

  /*
        Setup payment methods.
    */

  setupPaymentMethods();

  /*
        Setup input formatting.
    */

  setupCardNumberFormatting();

  setupExpiryFormatting();

  setupCVV();

  /*
        Back button.
    */

  setupBackButton();

  /*
        Pay button.
    */

  document
    .getElementById("payButton")
    .addEventListener("click", processPayment);
}

/* =========================================
   START
========================================= */

initialize();
