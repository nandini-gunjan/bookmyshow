// =========================================
// BOOKITBRO
// PAYMENT PAGE
// =========================================

import { auth, db } from "./firebase.js";

import {
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// =========================================
// STATE
// =========================================

let splitFriends = [];

let paymentData = null;

let selectedMethod = "upi";

let selectedPaymentPlan = "full";

let splitPeopleCount = 1;

let splitUpiDetails = null;

// =========================================
// LOAD PAYMENT DATA
// =========================================

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

// =========================================
// DISPLAY SPORTS BOOKING
// =========================================

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

// =========================================
// DISPLAY PRICE
// =========================================

function displayPrice() {
  const isFrozenConfirmation =
    paymentData.paymentMode === "frozen-confirmation";

  // =========================================
  // TICKET COUNT
  // =========================================

  let ticketCount = 0;

  if (isFrozenConfirmation) {
    if (Array.isArray(paymentData.frozenSeats)) {
      ticketCount = paymentData.frozenSeats.length;
    } else {
      ticketCount = Number(paymentData.frozenSeatCount) || 0;
    }
  } else {
    // For normal booking, ALWAYS prefer actual selected seats
    if (Array.isArray(paymentData.seats)) {
      ticketCount = paymentData.seats.length;
    } else if (Array.isArray(paymentData.selectedSeats)) {
      ticketCount = paymentData.selectedSeats.length;
    } else {
      ticketCount = Number(paymentData.ticketCount) || 0;
    }
  }

  // =========================================
  // TICKET AMOUNT
  // =========================================

  const ticketAmount = isFrozenConfirmation
    ? Number(paymentData.frozenRemainingAmount || paymentData.totalAmount || 0)
    : Number(
        paymentData.ticketAmountPayNow ||
          paymentData.baseAmount ||
          paymentData.ticketAmount ||
          0,
      );

  // =========================================
  // FOOD
  // =========================================

  const foodAmount = isFrozenConfirmation
    ? 0
    : Number(paymentData.foodAmount) || 0;

  const foodItemCount = isFrozenConfirmation
    ? 0
    : Number(paymentData.foodItemCount) || 0;

  // =========================================
  // FEES
  // =========================================

  const convenienceFee = isFrozenConfirmation
    ? 0
    : Number(paymentData.convenienceFee) || 0;

  const gst = isFrozenConfirmation ? 0 : Number(paymentData.gst) || 0;

  // =========================================
  // TOTAL
  // =========================================

  const totalAmount = isFrozenConfirmation
    ? Number(paymentData.frozenRemainingAmount || paymentData.totalAmount || 0)
    : Number(paymentData.totalAmount) || 0;

  // =========================================
  // UPDATE TICKET PRICE
  // =========================================

  const ticketPriceElement = document.getElementById("ticketPrice");

  if (ticketPriceElement) {
    ticketPriceElement.textContent = formatCurrency(ticketAmount);
  }

  // =========================================
  // UPDATE TICKET COUNT
  // =========================================

  const ticketCountElement = document.getElementById("ticketCount");

  if (ticketCountElement) {
    ticketCountElement.textContent = `${ticketCount} ticket${ticketCount === 1 ? "" : "s"}`;
  }

  // =========================================
  // UPDATE FOOD
  // =========================================

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

  // =========================================
  // UPDATE CONVENIENCE FEE
  // =========================================

  const convenienceFeeElement = document.getElementById("convenienceFee");

  if (convenienceFeeElement) {
    convenienceFeeElement.textContent = formatCurrency(convenienceFee);
  }

  // =========================================
  // UPDATE GST
  // =========================================

  const gstElement = document.getElementById("gst");

  if (gstElement) {
    gstElement.textContent = formatCurrency(gst);
  }

  // =========================================
  // UPDATE TOTAL
  // =========================================

  const totalAmountElement = document.getElementById("totalAmount");

  if (totalAmountElement) {
    totalAmountElement.textContent = formatCurrency(totalAmount);
  }

  // =========================================
  // UPDATE PAY BUTTON
  // =========================================

  const payAmountElement = document.getElementById("payAmount");

  if (payAmountElement) {
    payAmountElement.textContent = formatCurrency(totalAmount);
  }

  // =========================================
  // FROZEN BOOKING BUTTON
  // =========================================

  const payButton = document.getElementById("payButton");

  if (payButton && isFrozenConfirmation) {
    const payText = payButton.querySelector("span");

    if (payText) {
      payText.textContent = "Confirm & Pay";
    }
  }
}

// =========================================
// PAYMENT PLAN SETUP
// =========================================

function setupPaymentPlans() {
  const planButtons = document.querySelectorAll(".payment-plan");

  planButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectPaymentPlan(button.dataset.plan);
    });
  });
}

// =========================================
// SELECT PAYMENT PLAN
// =========================================

function selectPaymentPlan(plan) {
  selectedPaymentPlan = plan;

  document.querySelectorAll(".payment-plan").forEach((button) => {
    button.classList.toggle("active", button.dataset.plan === plan);
  });

  const splitSection = document.getElementById("splitBillSection");

  const counterSection = document.getElementById("counterPaymentSection");

  if (splitSection) {
    splitSection.classList.toggle("hidden", plan !== "split");
  }

  if (counterSection) {
    counterSection.classList.toggle("hidden", plan !== "counter");
  }

  // =========================================
  // SPLIT BILL
  // =========================================

  if (plan === "split") {
    loadSplitFriends();

    updateSplitPeopleCount();

    updateFriendPaymentInputs();

    updateSplitBillSummary();
  }

  // =========================================
  // COUNTER PAYMENT
  // =========================================

  if (plan === "counter") {
    updateCounterPaymentSummary();
  }

  updatePaymentPrice();
}

// =========================================
// PAYMENT METHOD TABS
// =========================================

function setupPaymentMethods() {
  const buttons = document.querySelectorAll(".method-button");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      selectPaymentMethod(button.dataset.method);
    });
  });
}

// =========================================
// SELECT PAYMENT METHOD
// =========================================

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

// =========================================
// LOAD FRIENDS FOR SPLIT BILL
// =========================================

function loadSplitFriends() {
  const storedFriends = sessionStorage.getItem("bookItBroFriends");

  try {
    splitFriends = storedFriends ? JSON.parse(storedFriends) : [];

    if (!Array.isArray(splitFriends)) {
      splitFriends = [];
    }
  } catch (error) {
    console.error("Unable to load friends:", error);
    splitFriends = [];
  }

  updateSplitPeopleCount();
  updateFriendPaymentInputs();
}

// =========================================
// UPDATE PEOPLE COUNT
// =========================================

function updateSplitPeopleCount() {
  const peopleElement = document.getElementById("splitPeopleCount");

  // Get the actual number of selected seats/people
  let selectedPeople = 0;

  if (Array.isArray(paymentData?.seats)) {
    selectedPeople = paymentData.seats.length;
  } else if (Array.isArray(paymentData?.selectedSeats)) {
    selectedPeople = paymentData.selectedSeats.length;
  } else if (Array.isArray(paymentData?.frozenSeats)) {
    selectedPeople = paymentData.frozenSeats.length;
  } else {
    selectedPeople = Number(paymentData?.ticketCount) || 0;
  }

  // Minimum 1 person
  if (selectedPeople < 1) {
    selectedPeople = 1;
  }

  splitPeopleCount = selectedPeople;

  if (peopleElement) {
    peopleElement.textContent = splitPeopleCount;
  }

  console.log("Selected people:", splitPeopleCount);

  updateSplitBillSummary();
}

// =========================================
// CREATE UPI INPUTS FOR ALL PEOPLE
// =========================================

function updateFriendPaymentInputs() {
  const container = document.getElementById("friendPaymentList");

  if (!container) {
    return;
  }

  container.innerHTML = "";

  // Number of people = selected seats
  const totalPeople = splitPeopleCount;

  if (totalPeople <= 1) {
    container.innerHTML = `
      <p class="no-friends-message">
        No additional people are required for split payment.
      </p>
    `;
    return;
  }

  // Create UPI field for every person except current user
  for (let index = 1; index < totalPeople; index++) {
    const friend = splitFriends[index - 1] || {};

    const friendName =
      friend.name || friend.displayName || `Person ${index + 1}`;

    const friendBox = document.createElement("div");

    friendBox.className = "friend-payment-item";

    friendBox.innerHTML = `
      <div class="friend-payment-header">
        <strong>${friendName}</strong>
        <span>Person ${index + 1}</span>
      </div>

      <label for="friendUpi${index - 1}">
        ${friendName}'s UPI ID
      </label>

      <input
        type="text"
        id="friendUpi${index - 1}"
        class="friend-upi-input"
        data-friend-index="${index - 1}"
        placeholder="example@upi"
        autocomplete="off"
      />
    `;

    container.appendChild(friendBox);
  }

  console.log(
    `Created ${totalPeople - 1} friend UPI fields for ${totalPeople} people.`,
  );
}

// =========================================
// UPDATE SPLIT BILL SUMMARY
// =========================================

function updateSplitBillSummary() {
  const summaryElement = document.getElementById("splitSummary");

  if (!summaryElement) {
    return;
  }

  const ticketAmount = Number(
    paymentData.ticketAmountPayNow || paymentData.baseAmount || 0,
  );

  const convenienceFee = Number(paymentData.convenienceFee || 0);

  const gst = Number(paymentData.gst || 0);

  const sharedAmount = ticketAmount + convenienceFee + gst;

  const amountPerPerson =
    splitPeopleCount > 0 ? sharedAmount / splitPeopleCount : sharedAmount;

  const foodAmount = Number(paymentData.foodAmount || 0);

  summaryElement.innerHTML = `

    <div class="split-summary-row">

      <span>
        Shared Ticket & Booking Cost
      </span>

      <strong>
        ${formatCurrency(sharedAmount)}
      </strong>

    </div>


    <div class="split-summary-row">

      <span>
        Number of People
      </span>

      <strong>
        ${splitPeopleCount}
      </strong>

    </div>


    <div class="split-summary-row">

      <span>
        Each Person Pays for Tickets
      </span>

      <strong>
        ${formatCurrency(amountPerPerson)}
      </strong>

    </div>


    <div class="split-food-note">

      🍿 Food Amount:
      ${formatCurrency(foodAmount)}

      <p>
        Food is not divided equally.
        Each person pays only for the
        food items they ordered.
      </p>

    </div>

  `;
}

// =========================================
// COLLECT SPLIT UPI DETAILS
// =========================================

function collectSplitUpiDetails() {
  if (selectedPaymentPlan !== "split") {
    return null;
  }

  const currentUserUpi =
    document.getElementById("currentUserUpi")?.value.trim() || "";

  const friendUpiDetails = splitFriends.map((friend, index) => {
    const input = document.getElementById(`friendUpi${index}`);

    return {
      friendId: friend.uid || friend.id || null,

      friendName: friend.name || friend.displayName || `Friend ${index + 1}`,

      upiId: input?.value.trim() || "",
    };
  });

  return {
    currentUserUpi,

    friends: friendUpiDetails,
  };
}

// =========================================
// VALIDATE SPLIT UPI DETAILS
// =========================================

function validateSplitUpiDetails() {
  if (selectedPaymentPlan !== "split") {
    return true;
  }

  const upiPattern = /^[\w.-]+@[\w.-]+$/;

  // =========================================
  // CURRENT USER UPI
  // =========================================

  const currentUserUpi = document.getElementById("currentUserUpi");

  if (!currentUserUpi || !currentUserUpi.value.trim()) {
    alert("Please enter your UPI ID.");

    currentUserUpi?.focus();

    return false;
  }

  if (!upiPattern.test(currentUserUpi.value.trim())) {
    alert("Please enter a valid UPI ID.");

    currentUserUpi.focus();

    return false;
  }

  // =========================================
  // FRIEND UPI IDs
  // =========================================

  const friendInputs = document.querySelectorAll(".friend-upi-input");

  for (const input of friendInputs) {
    const upi = input.value.trim();

    if (!upi) {
      alert("Please enter the UPI ID of all friends.");

      input.focus();

      return false;
    }

    if (!upiPattern.test(upi)) {
      alert("Please enter a valid UPI ID for every friend.");

      input.focus();

      return false;
    }
  }

  return true;
}

// =========================================
// FRIEND PAYMENT REQUEST SECTION
// =========================================

function setupFriendPaymentSection() {
  const sendButton = document.getElementById("sendPaymentRequest");

  if (sendButton) {
    sendButton.addEventListener("click", sendPaymentRequests);
  }
}

// =========================================
// SEND PAYMENT REQUESTS
// =========================================

function sendPaymentRequests() {
  alert("Payment request successfully sent to all friends.");
}

// =========================================
// UPDATE COUNTER PAYMENT SUMMARY
// =========================================

function updateCounterPaymentSummary() {
  const totalAmount = Number(paymentData.totalAmount || 0);

  const onlineAmount = totalAmount * 0.25;

  const counterAmount = totalAmount * 0.75;

  const onlineElement = document.getElementById("onlineReservationAmount");

  const counterElement = document.getElementById("counterRemainingAmount");

  if (onlineElement) {
    onlineElement.textContent = formatCurrency(onlineAmount);
  }

  if (counterElement) {
    counterElement.textContent = formatCurrency(counterAmount);
  }
}

// =========================================
// UPDATE PAYMENT PRICE
// =========================================

function updatePaymentPrice() {
  const originalTotal = Number(paymentData.totalAmount || 0);

  let amountToPay = originalTotal;

  // =========================================
  // FULL PAYMENT
  // =========================================

  if (selectedPaymentPlan === "full") {
    amountToPay = originalTotal;
  }

  // =========================================
  // SPLIT BILL
  // =========================================

  if (selectedPaymentPlan === "split") {
    const ticketAmount = Number(
      paymentData.ticketAmountPayNow || paymentData.baseAmount || 0,
    );

    const convenienceFee = Number(paymentData.convenienceFee || 0);

    const gst = Number(paymentData.gst || 0);

    const sharedAmount = ticketAmount + convenienceFee + gst;

    const foodAmount = Number(paymentData.currentUserFoodAmount || 0);

    amountToPay = sharedAmount / splitPeopleCount + foodAmount;
  }

  // =========================================
  // 25% ONLINE
  // =========================================

  if (selectedPaymentPlan === "counter") {
    amountToPay = originalTotal * 0.25;
  }

  const totalAmountElement = document.getElementById("totalAmount");

  const payAmountElement = document.getElementById("payAmount");

  if (totalAmountElement) {
    totalAmountElement.textContent = formatCurrency(amountToPay);
  }

  if (payAmountElement) {
    payAmountElement.textContent = formatCurrency(amountToPay);
  }

  updatePayButtonText();
}

// =========================================
// UPDATE PAY BUTTON TEXT
// =========================================

function updatePayButtonText() {
  const payButton = document.getElementById("payButton");

  if (!payButton) {
    return;
  }

  const payText = payButton.querySelector("span");

  if (!payText) {
    return;
  }

  if (selectedPaymentPlan === "full") {
    payText.textContent = "Pay";
  }

  if (selectedPaymentPlan === "split") {
    payText.textContent = "Pay My Share";
  }

  if (selectedPaymentPlan === "counter") {
    payText.textContent = "Pay 25% & Reserve";
  }

  if (paymentData.paymentMode === "frozen-confirmation") {
    payText.textContent = "Confirm & Pay";
  }
}

// =========================================
// PAYMENT VALIDATION
// =========================================

function validatePayment() {
  // =========================================
  // SPLIT BILL
  // =========================================

  if (selectedPaymentPlan === "split") {
    if (!validateSplitUpiDetails()) {
      return false;
    }

    splitUpiDetails = collectSplitUpiDetails();
  }

  // =========================================
  // UPI
  // =========================================

  if (selectedMethod === "upi" && selectedPaymentPlan !== "split") {
    const upiInput = document.getElementById("upiId");

    if (!upiInput || !upiInput.value.trim()) {
      alert("Please enter your UPI ID.");

      upiInput?.focus();

      return false;
    }

    const upiPattern = /^[\w.-]+@[\w.-]+$/;

    if (!upiPattern.test(upiInput.value.trim())) {
      alert("Please enter a valid UPI ID.");

      upiInput.focus();

      return false;
    }
  }

  // =========================================
  // CARD
  // =========================================

  if (selectedMethod === "card") {
    const cardNumber = document.getElementById("cardNumber");

    const cardName = document.getElementById("cardName");

    const expiry = document.getElementById("expiry");

    const cvv = document.getElementById("cvv");

    if (
      !cardNumber?.value.trim() ||
      !cardName?.value.trim() ||
      !expiry?.value.trim() ||
      !cvv?.value.trim()
    ) {
      alert("Please fill in all card details.");

      return false;
    }

    const cardDigits = cardNumber.value.replace(/\D/g, "");

    if (cardDigits.length !== 16) {
      alert("Please enter a valid 16-digit card number.");

      cardNumber.focus();

      return false;
    }

    if (!/^\d{2}\/\d{2}$/.test(expiry.value)) {
      alert("Please enter expiry in MM/YY format.");

      expiry.focus();

      return false;
    }

    if (!/^\d{3}$/.test(cvv.value)) {
      alert("Please enter a valid 3-digit CVV.");

      cvv.focus();

      return false;
    }
  }

  // =========================================
  // NET BANKING
  // =========================================

  if (selectedMethod === "netbanking") {
    const bank = document.getElementById("bank");

    if (!bank?.value) {
      alert("Please select your bank.");

      bank?.focus();

      return false;
    }
  }

  // =========================================
  // WALLET
  // =========================================

  if (selectedMethod === "wallet") {
    const wallet = document.getElementById("wallet");

    if (!wallet?.value) {
      alert("Please select your wallet.");

      wallet?.focus();

      return false;
    }
  }

  return true;
}

// =========================================
// PROCESS PAYMENT
// =========================================

function processPayment() {
  if (!validatePayment()) {
    return;
  }

  const processingModal = document.getElementById("processingModal");

  if (processingModal) {
    processingModal.classList.remove("hidden");
  }

  setTimeout(async () => {
    try {
      if (processingModal) {
        processingModal.classList.add("hidden");
      }

      await completePayment();
    } catch (error) {
      if (processingModal) {
        processingModal.classList.add("hidden");
      }

      console.error("Payment processing error:", error);

      alert(
        error.message || "Payment could not be completed. Please try again.",
      );
    }
  }, 1800);
}

// =========================================
// COMPLETE PAYMENT
// =========================================

async function completePayment() {
  // =========================================
  // FROZEN BOOKING
  // =========================================

  if (paymentData.paymentMode === "frozen-confirmation") {
    await confirmFrozenBooking();

    return;
  }

  const bookingId = generateBookingId();

  const originalTotal = Number(paymentData.totalAmount || 0);

  let amountPaid = originalTotal;

  let remainingAtCounter = 0;

  // =========================================
  // 25% ONLINE PAYMENT
  // =========================================

  if (selectedPaymentPlan === "counter") {
    amountPaid = originalTotal * 0.25;

    remainingAtCounter = originalTotal * 0.75;
  }

  // =========================================
  // SPLIT BILL
  // =========================================

  if (selectedPaymentPlan === "split") {
    const ticketAmount = Number(
      paymentData.ticketAmountPayNow || paymentData.baseAmount || 0,
    );

    const convenienceFee = Number(paymentData.convenienceFee || 0);

    const gst = Number(paymentData.gst || 0);

    const sharedAmount = ticketAmount + convenienceFee + gst;

    const currentUserFoodAmount = Number(
      paymentData.currentUserFoodAmount || 0,
    );

    amountPaid = sharedAmount / splitPeopleCount + currentUserFoodAmount;

    splitUpiDetails = collectSplitUpiDetails();
  }

  // =========================================
  // CONFIRMATION DATA
  // =========================================

  const confirmationData = {
    ...paymentData,

    bookingId,

    bookingStatus: selectedPaymentPlan === "counter" ? "RESERVED" : "CONFIRMED",

    paymentStatus: selectedPaymentPlan === "counter" ? "PARTIAL" : "SUCCESS",

    paymentMethod: selectedMethod,

    paymentPlan: selectedPaymentPlan,

    splitPeopleCount: selectedPaymentPlan === "split" ? splitPeopleCount : null,

    splitUpiDetails: selectedPaymentPlan === "split" ? splitUpiDetails : null,

    amountPaid,

    remainingAtCounter,

    totalAmount: originalTotal,

    paymentDate: new Date().toISOString(),
  };

  await saveBookingToFirebase(confirmationData);

  sessionStorage.setItem(
    "bookItBroConfirmation",
    JSON.stringify(confirmationData),
  );

  showSuccessAndRedirect();
}

// =========================================
// SAVE NEW BOOKING TO FIREBASE
// =========================================

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

    createdAt: serverTimestamp(),

    updatedAt: serverTimestamp(),
  });

  console.log("Booking saved successfully:", confirmationData.bookingId);
}

// =========================================
// CONFIRM FROZEN BOOKING
// =========================================

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

  // =========================================
  // REMAINING PAYMENT
  // =========================================

  const remainingAmount = Number(
    paymentData.frozenRemainingAmount || paymentData.remainingAmount || 0,
  );

  // =========================================
  // ADVANCE PAYMENT
  // =========================================

  const advanceAmount = Number(paymentData.frozenAdvanceAmount || 0);

  const finalFrozenAmount = remainingAmount + advanceAmount;

  // =========================================
  // EXISTING CONFIRMED SEATS
  // =========================================

  const existingConfirmedSeats = Array.isArray(paymentData.confirmedSeats)
    ? paymentData.confirmedSeats
    : [];

  // =========================================
  // FROZEN SEATS
  // =========================================

  const frozenSeats = Array.isArray(paymentData.frozenSeats)
    ? paymentData.frozenSeats
    : [];

  // =========================================
  // MOVE FROZEN → CONFIRMED
  // =========================================

  const finalConfirmedSeats = [...existingConfirmedSeats, ...frozenSeats];

  const uniqueConfirmedSeats = [...new Set(finalConfirmedSeats)];

  // =========================================
  // UPDATE FIRESTORE BOOKING
  // =========================================

  await updateDoc(bookingRef, {
    bookingStatus: "CONFIRMED",

    frozenStatus: "COMPLETED",

    paymentStatus: "SUCCESS",

    paymentMethod: selectedMethod,

    confirmedSeats: uniqueConfirmedSeats,

    confirmedSeatCount: uniqueConfirmedSeats.length,

    frozenSeats: [],

    frozenSeatCount: 0,

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

    bookingId: bookingDocumentId,

    bookingStatus: "CONFIRMED",

    frozenStatus: "COMPLETED",

    paymentStatus: "SUCCESS",

    paymentMethod: selectedMethod,

    paymentPlan: "frozen-confirmation",

    amountPaid: remainingAmount,

    totalAmount: finalFrozenAmount,

    paymentDate: new Date().toISOString(),
  };

  sessionStorage.setItem(
    "bookItBroConfirmation",
    JSON.stringify(confirmationData),
  );

  showSuccessAndRedirect();
}

// =========================================
// SHOW SUCCESS AND REDIRECT
// =========================================

function showSuccessAndRedirect() {
  const successModal = document.getElementById("successModal");

  if (successModal) {
    successModal.classList.remove("hidden");
  }

  setTimeout(() => {
    window.location.href = "confirmation.html";
  }, 1200);
}

// =========================================
// FORMAT CURRENCY
// =========================================

function formatCurrency(amount) {
  return `₹${(Number(amount) || 0).toFixed(2)}`;
}

// =========================================
// FORMAT DATE
// =========================================

function formatDate(dateValue) {
  if (!dateValue) {
    return "—";
  }

  let date;

  // =========================================
  // FIRESTORE TIMESTAMP
  // =========================================

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

// =========================================
// GENERATE BOOKING ID
// =========================================

function generateBookingId() {
  const timestamp = Date.now().toString().slice(-8);

  const random = Math.floor(100 + Math.random() * 900);

  return `BIB${timestamp}${random}`;
}

// =========================================
// CARD NUMBER FORMAT
// =========================================

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

// =========================================
// EXPIRY FORMAT
// =========================================

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

// =========================================
// CVV FORMAT
// =========================================

function setupCVV() {
  const input = document.getElementById("cvv");

  if (!input) {
    return;
  }

  input.addEventListener("input", () => {
    input.value = input.value.replace(/\D/g, "").substring(0, 3);
  });
}

// =========================================
// BACK BUTTON
// =========================================

function setupBackButton() {
  const button = document.getElementById("backButton");

  if (!button) {
    return;
  }

  button.addEventListener("click", () => {
    window.history.back();
  });
}

// =========================================
// PAYMENT ERROR
// =========================================

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

      <div style="
        max-width: 420px;
      ">

        <div style="
          font-size: 50px;
          margin-bottom: 15px;
        ">
          ⚠️
        </div>


        <h2 style="
          margin-bottom: 10px;
        ">
          Payment Information Not Found
        </h2>


        <p style="
          color: #777;
          line-height: 1.6;
          margin-bottom: 22px;
        ">
          Your booking information could not be found.
          Please return to the booking summary and
          try again.
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

// =========================================
// INITIALIZE
// =========================================

function initialize() {
  const loaded = loadPaymentData();

  if (!loaded) {
    return;
  }

  displayBooking();

  displayPrice();

  loadSplitFriends();

  setupPaymentPlans();

  setupFriendPaymentSection();

  updatePaymentPrice();

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

// =========================================
// START
// =========================================

initialize();
