// =========================================
// BOOKITBRO
// MY BOOKINGS
// =========================================

import { auth, db } from "./firebase.js";

import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
  getDoc,
  setDoc,
  increment,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// =========================================
// STATE
// =========================================

let allBookings = [];

let currentFilter = "all";

// =========================================
// INITIALIZE MY BOOKINGS PAGE
// =========================================

function initializeMyBookingsPage() {
  console.log("My Bookings page initialized");

  setupBookingTabs();

  setupRetryButton();

  setupModal();

  setupExploreButton();

  setupFoodModal();

  setupFoodPaymentOptions();

  loadUserBookings();
}

// =========================================
// SETUP FOOD MODAL
// =========================================

function setupFoodModal() {
  const modal =
    document.getElementById(
      "foodOrderModal",
    );

  const closeButton =
    document.getElementById(
      "closeFoodModal",
    );

  const overlay =
    modal?.querySelector(
      ".food-modal-overlay",
    );

  const successClose =
    document.getElementById(
      "closeFoodSuccess",
    );

  const paymentButton =
    document.getElementById(
      "foodPaymentButton",
    );


  if (closeButton) {
    closeButton.addEventListener(
      "click",
      closeFoodModal,
    );
  }


  if (overlay) {
    overlay.addEventListener(
      "click",
      closeFoodModal,
    );
  }


  if (paymentButton) {
    paymentButton.addEventListener(
      "click",
      proceedFoodPayment,
    );
  }


  if (successClose) {
    successClose.addEventListener(
      "click",
      () => {
        document
          .getElementById(
            "foodSuccessModal",
          )
          ?.classList.add("hidden");
      },
    );
  }
}
// =========================================
// LOAD USER BOOKINGS
// =========================================

function loadUserBookings() {
  showLoading();

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      console.warn("User is not signed in.");

      hideLoading();

      showError("Please sign in to view your bookings.");

      return;
    }

    console.log("Loading bookings for user:", user.uid);

    try {
      const bookingsRef = collection(db, "users", user.uid, "bookings");

      const bookingsQuery = query(bookingsRef, orderBy("createdAt", "desc"));

      const snapshot = await getDocs(bookingsQuery);

      allBookings = [];

      snapshot.forEach((docSnapshot) => {
        const booking = {
          id: docSnapshot.id,

          ...docSnapshot.data(),
        };

        allBookings.push(booking);
      });

      console.log("Bookings loaded:", allBookings);

      hideLoading();

      if (allBookings.length === 0) {
        showEmpty();

        return;
      }

      hideEmpty();

      hideError();

      renderBookings();
    } catch (error) {
      console.error("Booking loading error:", error);

      hideLoading();

      showError(error.message || "Unable to load your bookings.");
    }
  });
}

// =========================================
// RENDER BOOKINGS
// =========================================

function renderBookings() {
  const container = document.getElementById("bookingsContainer");

  if (!container) {
    console.warn("Bookings container not found.");

    return;
  }

  container.innerHTML = "";

  const filteredBookings = filterBookings(allBookings, currentFilter);

  if (filteredBookings.length === 0) {
    showFilteredEmpty();

    return;
  }

  hideFilteredEmpty();

  filteredBookings.forEach((booking) => {
    const card = createBookingCard(booking);

    container.appendChild(card);
  });
}

// =========================================
// FILTER BOOKINGS
// =========================================

function filterBookings(bookings, filter) {
  if (filter === "all") {
    return bookings;
  }

  return bookings.filter((booking) => {
    const status = getBookingStatus(booking);

    switch (filter) {
      case "upcoming":
        return status === "CONFIRMED";

      case "frozen":
        return status === "FROZEN";

      case "completed":
        return status === "COMPLETED";

      case "cancelled":
        return status === "CANCELLED";

      default:
        return true;
    }
  });
}

// =========================================
// GET BOOKING STATUS
// =========================================

function getBookingStatus(booking) {
  return (booking.bookingStatus || "CONFIRMED").toUpperCase();
}

// =========================================
// CREATE BOOKING CARD
// =========================================

function createBookingCard(booking) {
  const card = document.createElement("article");

  card.className = "booking-card";

  const bookingType = booking.bookingType === "sports" ? "SPORTS" : "MOVIE";

  const icon = bookingType === "SPORTS" ? "🏟️" : "🎬";

  const title =
    bookingType === "SPORTS"
      ? booking.eventName ||
        `${booking.homeTeam || "Home Team"} VS ${booking.awayTeam || "Away Team"}`
      : booking.movieTitle || "Movie Booking";

  const status = getBookingStatus(booking);

  const statusClass = getStatusClass(status);

  const poster =
    bookingType === "SPORTS"
      ? booking.poster || ""
      : booking.moviePoster || booking.poster || "";

  const subtitle =
    bookingType === "SPORTS"
      ? booking.venue || "Sports Event"
      : booking.theatreName || "Theatre";

  const date = formatDate(booking.date);

  const time = booking.showTime || "—";

  const seats = Array.isArray(booking.seats) ? booking.seats.join(", ") : "—";

  const amount = formatCurrency(booking.totalAmount);

  card.innerHTML = `

        <!-- CARD TOP -->

        <div class="booking-card-top">

            <div class="booking-type">

                <span class="booking-type-icon">
                    ${icon}
                </span>

                ${bookingType}

            </div>


            <span
                class="booking-status ${statusClass}">

                ${status}

            </span>

        </div>


        <!-- MAIN -->

        <div class="booking-main">


            ${
              poster
                ? `
                        <img
                            class="booking-poster"
                            src="${poster}"
                            alt="${escapeHTML(title)}"
                        >
                    `
                : `
                        <div class="booking-poster">
                        </div>
                    `
            }


            <div class="booking-info">

                <h2 class="booking-title">
                    ${escapeHTML(title)}
                </h2>


                <p class="booking-subtitle">
                    ${escapeHTML(subtitle)}
                </p>


                <div class="booking-details">


                    <div class="detail-item">

                        <span class="detail-label">
                            Date
                        </span>

                        <span class="detail-value">
                            ${date}
                        </span>

                    </div>


                    <div class="detail-item">

                        <span class="detail-label">
                            Time
                        </span>

                        <span class="detail-value">
                            ${escapeHTML(time)}
                        </span>

                    </div>


                    <div class="detail-item">

                        <span class="detail-label">
                            Seats
                        </span>

                        <span class="detail-value">
                            ${escapeHTML(seats)}
                        </span>

                    </div>


                    <div class="detail-item">

                        <span class="detail-label">
                            Booking ID
                        </span>

                        <span class="detail-value">
                            ${escapeHTML(
                              booking.bookingId || booking.id || "—",
                            )}
                        </span>

                    </div>


                </div>


                ${status === "FROZEN" ? createFrozenSection(booking) : ""}

                ${status === "CONFIRMED" ? createFoodPreOrderSection(booking) : ""}


            </div>

        </div>


        <!-- BOTTOM -->

        <div class="booking-card-bottom">


            <div class="booking-price">

                <span class="booking-price-label">
                    Total Amount
                </span>

                <span class="booking-price-value">
                    ${amount}
                </span>

            </div>


            <div class="booking-actions">

              <button
                 class="view-details-button"
                  data-booking-id="${escapeHTML(booking.id)}">

                 View Details

              </button>

              ${
                bookingType === "MOVIE" && status === "CONFIRMED"
                 ? `
                <button
                 class="preorder-food-button">

                  🍿 Pre-Order Food

                </button>
                  `
                  : ""
              }

            </div>
         </div>

    `;

  const detailsButton = card.querySelector(".view-details-button");

  if (detailsButton) {
    detailsButton.addEventListener("click", () => {
      openBookingDetails(booking);
    });
  }
  
  const foodButton =
  card.querySelector(".preorder-food-button");

  if (foodButton) {

  foodButton.addEventListener("click", () => {

    const foodBookingData = {
      id: booking.id,

      bookingId:
        booking.bookingId || booking.id,

      movieTitle:
        booking.movieTitle || "",

      theatreName:
        booking.theatreName || "",

      showTime:
        booking.showTime || "",

      date:
        booking.date || "",

      seats:
        booking.seats || [],

      moviePoster:
        booking.moviePoster ||
        booking.poster ||
        "",

      bookingType:
        booking.bookingType || "movie"
    };


    sessionStorage.setItem(
      "bookItBroFoodBooking",
      JSON.stringify(foodBookingData)
    );


    window.location.href =
      "food-preorder.html";

  });

}

  const posterElement = card.querySelector(".booking-poster");

  if (posterElement && posterElement.tagName === "IMG") {
    posterElement.addEventListener("error", () => {
      posterElement.style.display = "none";
    });
  }

  return card;
}

// =========================================
// FOOD PRE-ORDER SECTION
// =========================================

function createFoodPreOrderSection(booking) {

  return `

    <div class="food-preorder-box">

      <div class="food-preorder-content">

        <div class="food-preorder-icon">
          🍿
        </div>

        <div class="food-preorder-text">

          <span class="food-preorder-badge">
            BOOKITBRO FOOD
          </span>

          <h3>
            Skip the Queue. Enjoy the Show!
          </h3>

          <p>
            Pre-order your favourite snacks and have them
            ready when you reach the theatre.
          </p>

          <div class="food-benefits">

            <span>⚡ Quick Pickup</span>

            <span>⭐ Earn Reward Points</span>

            <span>💰 Flexible Payment</span>

          </div>

        </div>

      </div>


      <button
        class="preorder-food-button"
        data-booking-id="${escapeHTML(booking.id)}">

        <span>
          Pre-Order Food
        </span>

        <span class="food-arrow">
          →
        </span>

      </button>

    </div>

  `;
}
// =========================================
// FROZEN BOOKING SECTION
// =========================================

function createFrozenSection(booking) {
  const amountPaid = Number(booking.amountPaid) || 0;

  const remainingAmount = Number(booking.remainingAmount) || 0;

  const deadline = booking.paymentDeadline
    ? formatDateTime(booking.paymentDeadline)
    : "Payment deadline not available";

  return `

        <div class="frozen-payment-box">

            <div class="frozen-payment-row">

                <span class="frozen-payment-label">
                    Amount Paid
                </span>

                <span class="frozen-payment-value">
                    ${formatCurrency(amountPaid)}
                </span>

            </div>


            <div class="frozen-payment-row">

                <span class="frozen-payment-label">
                    Remaining
                </span>

                <span class="frozen-payment-value">
                    ${formatCurrency(remainingAmount)}
                </span>

            </div>


            <p class="frozen-deadline">

                Pay remaining amount before:
                ${deadline}

            </p>


            <button
                class="pay-remaining-button"
                data-booking-id="${escapeHTML(booking.id)}">

                Pay Remaining

            </button>

        </div>

    `;
}

// =========================================
// BOOKING DETAILS MODAL
// =========================================

function openBookingDetails(booking) {
  const modal = document.getElementById("bookingDetailsModal");

  const content = document.getElementById("bookingDetailsContent");

  if (!modal || !content) {
    return;
  }

  const isSports = booking.bookingType === "sports";

  const title = isSports
    ? booking.eventName || "Sports Event"
    : booking.movieTitle || "Movie";

  const bookingId = booking.bookingId || booking.id || "—";

  content.innerHTML = `

        <h2 class="modal-booking-title">
            ${escapeHTML(title)}
        </h2>


        <p class="modal-booking-id">
            Booking ID: ${escapeHTML(bookingId)}
        </p>


        <div class="modal-details-grid">


            <div class="modal-detail">

                <span class="modal-detail-label">
                    Booking Type
                </span>

                <span class="modal-detail-value">
                    ${isSports ? "Sports" : "Movie"}
                </span>

            </div>


            <div class="modal-detail">

                <span class="modal-detail-label">
                    Status
                </span>

                <span class="modal-detail-value">
                    ${escapeHTML(getBookingStatus(booking))}
                </span>

            </div>


            <div class="modal-detail">

                <span class="modal-detail-label">
                    Date
                </span>

                <span class="modal-detail-value">
                    ${formatDate(booking.date)}
                </span>

            </div>


            <div class="modal-detail">

                <span class="modal-detail-label">
                    Time
                </span>

                <span class="modal-detail-value">
                    ${escapeHTML(booking.showTime || "—")}
                </span>

            </div>


            ${
              isSports
                ? `

                        <div class="modal-detail">

                            <span class="modal-detail-label">
                                League
                            </span>

                            <span class="modal-detail-value">
                                ${escapeHTML(booking.league || "—")}
                            </span>

                        </div>


                        <div class="modal-detail">

                            <span class="modal-detail-label">
                                Venue
                            </span>

                            <span class="modal-detail-value">
                                ${escapeHTML(booking.venue || "—")}
                            </span>

                        </div>

                    `
                : `

                        <div class="modal-detail">

                            <span class="modal-detail-label">
                                Theatre
                            </span>

                            <span class="modal-detail-value">
                                ${escapeHTML(booking.theatreName || "—")}
                            </span>

                        </div>


                        <div class="modal-detail">

                            <span class="modal-detail-label">
                                Screen
                            </span>

                            <span class="modal-detail-value">
                                ${escapeHTML(booking.screen || "—")}
                            </span>

                        </div>

                    `
            }


            <div class="modal-detail">

                <span class="modal-detail-label">
                    Seats
                </span>

                <span class="modal-detail-value">
                    ${
                      Array.isArray(booking.seats)
                        ? booking.seats.join(", ")
                        : "—"
                    }
                </span>

            </div>


            <div class="modal-detail">

                <span class="modal-detail-label">
                    Payment Method
                </span>

                <span class="modal-detail-value">
                    ${escapeHTML(booking.paymentMethod || "—")}
                </span>

            </div>


            <div class="modal-detail">

                <span class="modal-detail-label">
                    Payment Status
                </span>

                <span class="modal-detail-value">
                    ${escapeHTML(booking.paymentStatus || "—")}
                </span>

            </div>


            <div class="modal-detail">

                <span class="modal-detail-label">
                    Total Amount
                </span>

                <span class="modal-detail-value">
                    ${formatCurrency(booking.totalAmount)}
                </span>

            </div>


        </div>

    `;

  modal.classList.remove("hidden");
}

// =========================================
// MODAL SETUP
// =========================================

function setupModal() {
  const modal = document.getElementById("bookingDetailsModal");

  const closeButton = document.getElementById("closeModal");

  const overlay = modal?.querySelector(".modal-overlay");

  if (closeButton) {
    closeButton.addEventListener("click", closeBookingModal);
  }

  if (overlay) {
    overlay.addEventListener("click", closeBookingModal);
  }
}

// =========================================
// CLOSE MODAL
// =========================================

function closeBookingModal() {
  const modal = document.getElementById("bookingDetailsModal");

  if (modal) {
    modal.classList.add("hidden");
  }
}

// =========================================
// BOOKING FILTER TABS
// =========================================

function setupBookingTabs() {
  const tabs = document.querySelectorAll(".booking-tab");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((item) => {
        item.classList.remove("active");
      });

      tab.classList.add("active");

      currentFilter = tab.dataset.filter || "all";

      renderBookings();
    });
  });
}

// =========================================
// RETRY BUTTON
// =========================================

function setupRetryButton() {
  const retryButton = document.getElementById("retryButton");

  if (!retryButton) {
    return;
  }

  retryButton.addEventListener("click", () => {
    hideError();

    loadUserBookings();
  });
}

// =========================================
// EXPLORE BUTTON
// =========================================

function setupExploreButton() {
  const button = document.getElementById("exploreBookingsButton");

  if (!button) {
    return;
  }

  button.addEventListener("click", () => {
    window.location.hash = "movies";
  });
}

// =========================================
// LOADING STATE
// =========================================

function showLoading() {
  const loading = document.getElementById("bookingLoading");

  if (loading) {
    loading.classList.remove("hidden");
  }
}

function hideLoading() {
  const loading = document.getElementById("bookingLoading");

  if (loading) {
    loading.classList.add("hidden");
  }
}

// =========================================
// EMPTY STATE
// =========================================

function showEmpty() {
  const empty = document.getElementById("emptyBookings");

  const container = document.getElementById("bookingsContainer");

  if (empty) {
    empty.classList.remove("hidden");
  }

  if (container) {
    container.innerHTML = "";
  }
}

function hideEmpty() {
  const empty = document.getElementById("emptyBookings");

  if (empty) {
    empty.classList.add("hidden");
  }
}

// =========================================
// FILTERED EMPTY STATE
// =========================================

function showFilteredEmpty() {
  const container = document.getElementById("bookingsContainer");

  if (!container) {
    return;
  }

  container.innerHTML = `

        <div class="empty-bookings">

            <div class="empty-icon">
                🎟️
            </div>

            <h2>
                No ${capitalize(currentFilter)} Bookings
            </h2>

            <p>
                There are no bookings in this category.
            </p>

        </div>

    `;
}

function hideFilteredEmpty() {
  // The normal booking container
  // will be populated by renderBookings().
}

// =========================================
// ERROR STATE
// =========================================

function showError(message) {
  const errorBox = document.getElementById("bookingError");

  const errorMessage = document.getElementById("bookingErrorMessage");

  if (errorMessage) {
    errorMessage.textContent = message;
  }

  if (errorBox) {
    errorBox.classList.remove("hidden");
  }
}

function hideError() {
  const errorBox = document.getElementById("bookingError");

  if (errorBox) {
    errorBox.classList.add("hidden");
  }
}

// =========================================
// FORMAT CURRENCY
// =========================================

function formatCurrency(amount) {
  const value = Number(amount) || 0;

  return `₹${value.toFixed(2)}`;
}

// =========================================
// FORMAT DATE
// =========================================

function formatDate(dateValue) {
  if (!dateValue) {
    return "—";
  }

  let date;

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
// FORMAT DATE + TIME
// =========================================

function formatDateTime(dateValue) {
  if (!dateValue) {
    return "—";
  }

  let date;

  if (typeof dateValue.toDate === "function") {
    date = dateValue.toDate();
  } else {
    date = new Date(dateValue);
  }

  if (Number.isNaN(date.getTime())) {
    return String(dateValue);
  }

  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// =========================================
// STATUS CLASS
// =========================================

function getStatusClass(status) {
  switch (status) {
    case "CONFIRMED":
      return "status-confirmed";

    case "FROZEN":
      return "status-frozen";

    case "COMPLETED":
      return "status-completed";

    case "CANCELLED":
      return "status-cancelled";

    default:
      return "status-confirmed";
  }
}

// =========================================
// CAPITALIZE
// =========================================

function capitalize(text) {
  if (!text) {
    return "";
  }

  return text.charAt(0).toUpperCase() + text.slice(1);
}

// =========================================
// ESCAPE HTML
// =========================================

function escapeHTML(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// =========================================
// FOOD MENU
// =========================================

const foodMenu = [
  {
    id: "popcorn-large",
    name: "Large Cheese Popcorn",
    price: 250,
    emoji: "🍿",
    category: "Snacks",
  },

  {
    id: "popcorn-medium",
    name: "Medium Salted Popcorn",
    price: 180,
    emoji: "🍿",
    category: "Snacks",
  },

  {
    id: "nachos",
    name: "Cheesy Nachos",
    price: 220,
    emoji: "🧀",
    category: "Snacks",
  },

  {
    id: "burger",
    name: "Classic Veg Burger",
    price: 190,
    emoji: "🍔",
    category: "Meals",
  },

  {
    id: "pizza",
    name: "Cheese Pizza",
    price: 299,
    emoji: "🍕",
    category: "Meals",
  },

  {
    id: "coke",
    name: "Coca Cola",
    price: 90,
    emoji: "🥤",
    category: "Drinks",
  },

  {
    id: "coffee",
    name: "Cold Coffee",
    price: 140,
    emoji: "☕",
    category: "Drinks",
  },
];


// =========================================
// FOOD STATE
// =========================================

let currentFoodBooking = null;

let foodCart = {};

let selectedFoodPayment = "full";


// =========================================
// OPEN FOOD MODAL
// =========================================

function openFoodModal(booking) {
  currentFoodBooking = booking;

  foodCart = {};

  selectedFoodPayment = "full";

  const modal = document.getElementById("foodOrderModal");

  if (!modal) {
    console.error("Food modal not found.");

    return;
  }

  renderFoodMenu();

  updateFoodCart();

  modal.classList.remove("hidden");
}


// =========================================
// CLOSE FOOD MODAL
// =========================================

function closeFoodModal() {
  const modal = document.getElementById("foodOrderModal");

  if (modal) {
    modal.classList.add("hidden");
  }

  currentFoodBooking = null;

  foodCart = {};
}


// =========================================
// RENDER FOOD MENU
// =========================================

function renderFoodMenu() {
  const container =
    document.getElementById("foodMenuContainer");

  if (!container) {
    return;
  }

  container.innerHTML = "";

  foodMenu.forEach((food) => {
    const quantity =
      foodCart[food.id]?.quantity || 0;

    const item = document.createElement("div");

    item.className = "food-item";

    item.innerHTML = `

        <div class="food-item-icon">

            ${food.emoji}

        </div>


        <div class="food-item-info">

            <h3>
                ${escapeHTML(food.name)}
            </h3>

            <p>
                ${escapeHTML(food.category)}
            </p>

            <strong>
                ₹${food.price}
            </strong>

        </div>


        <div class="food-quantity">

            <button
                class="food-minus"
                data-food-id="${food.id}">

                −

            </button>


            <span>
                ${quantity}
            </span>


            <button
                class="food-plus"
                data-food-id="${food.id}">

                +
                
            </button>

        </div>

    `;

    container.appendChild(item);
  });


  container
    .querySelectorAll(".food-plus")
    .forEach((button) => {
      button.addEventListener("click", () => {
        changeFoodQuantity(
          button.dataset.foodId,
          1,
        );
      });
    });


  container
    .querySelectorAll(".food-minus")
    .forEach((button) => {
      button.addEventListener("click", () => {
        changeFoodQuantity(
          button.dataset.foodId,
          -1,
        );
      });
    });
}


// =========================================
// CHANGE FOOD QUANTITY
// =========================================

function changeFoodQuantity(foodId, change) {
  const food =
    foodMenu.find(
      (item) => item.id === foodId,
    );

  if (!food) {
    return;
  }

  if (!foodCart[foodId]) {
    foodCart[foodId] = {
      ...food,
      quantity: 0,
    };
  }

  foodCart[foodId].quantity += change;


  if (foodCart[foodId].quantity <= 0) {
    delete foodCart[foodId];
  }

  renderFoodMenu();

  updateFoodCart();
}


// =========================================
// GET FOOD TOTAL
// =========================================

function getFoodTotal() {
  return Object.values(foodCart).reduce(
    (total, item) => {
      return (
        total +
        item.price * item.quantity
      );
    },
    0,
  );
}


// =========================================
// GET FOOD ITEMS
// =========================================

function getFoodItems() {
  return Object.values(foodCart);
}


// =========================================
// UPDATE CART
// =========================================

function updateFoodCart() {
  const total = getFoodTotal();

  const items =
    Object.values(foodCart);

  const count =
    items.reduce(
      (totalItems, item) =>
        totalItems + item.quantity,
      0,
    );


  const cartCount =
    document.getElementById(
      "foodCartCount",
    );

  const cartTotal =
    document.getElementById(
      "foodCartTotal",
    );

  const paymentButton =
    document.getElementById(
      "foodPaymentButton",
    );


  if (cartCount) {
    cartCount.textContent =
      `${count} item${count !== 1 ? "s" : ""}`;
  }


  if (cartTotal) {
    cartTotal.textContent =
      formatCurrency(total);
  }


  if (paymentButton) {
    paymentButton.disabled =
      total <= 0;

    paymentButton.textContent =
      total > 0
        ? `Continue • ${formatCurrency(
            getPayableFoodAmount(),
          )}`
        : "Select Food";
  }


  updateFoodPaymentInfo();
}


// =========================================
// GET PAYABLE AMOUNT
// =========================================

function getPayableFoodAmount() {
  const total = getFoodTotal();

  if (selectedFoodPayment === "counter") {
    return total * 0.25;
  }

  return total;
}


// =========================================
// UPDATE PAYMENT INFO
// =========================================

function updateFoodPaymentInfo() {
  const total = getFoodTotal();

  const info =
    document.getElementById(
      "foodPaymentInfo",
    );

  if (!info) {
    return;
  }


  if (selectedFoodPayment === "full") {
    info.innerHTML = `

        <strong>
            Pay ${formatCurrency(total)} now
        </strong>

        <span>
            Your complete food order will be paid online.
        </span>

    `;
  }


  if (selectedFoodPayment === "split") {
    info.innerHTML = `

        <strong>
            Split ${formatCurrency(total)}
        </strong>

        <span>
            Share payment links with your friends.
        </span>

    `;
  }


  if (selectedFoodPayment === "counter") {
    const payNow = total * 0.25;

    const remaining =
      total * 0.75;

    info.innerHTML = `

        <strong>
            Pay ${formatCurrency(payNow)} now
        </strong>

        <span>
            Pay ${formatCurrency(
              remaining,
            )} at the theatre counter.
        </span>

    `;
  }
}


// =========================================
// PAYMENT OPTION
// =========================================

function setupFoodPaymentOptions() {
  const options =
    document.querySelectorAll(
      ".food-payment-option",
    );

  options.forEach((option) => {
    option.addEventListener(
      "click",
      () => {
        options.forEach((item) => {
          item.classList.remove("active");
        });

        option.classList.add("active");

        selectedFoodPayment =
          option.dataset.payment;

        updateFoodCart();
      },
    );
  });
}


// =========================================
// FOOD PAYMENT
// =========================================

async function proceedFoodPayment() {
  if (!currentFoodBooking) {
    return;
  }


  const user = auth.currentUser;

  if (!user) {
    alert(
      "Please sign in before ordering food.",
    );

    return;
  }


  const total =
    getFoodTotal();


  if (total <= 0) {
    return;
  }


  const payableAmount =
    getPayableFoodAmount();


  const remainingAmount =
    selectedFoodPayment === "counter"
      ? total * 0.75
      : 0;


  const pointsEarned =
    Math.floor(payableAmount / 10);


  const foodOrder = {
    bookingId:
      currentFoodBooking.id,

    bookingReference:
      currentFoodBooking.bookingId ||
      currentFoodBooking.id,

    movieTitle:
      currentFoodBooking.movieTitle ||
      "Movie",

    theatreName:
      currentFoodBooking.theatreName ||
      "Theatre",

    showDate:
      currentFoodBooking.date ||
      "",

    showTime:
      currentFoodBooking.showTime ||
      "",

    items:
      getFoodItems(),

    totalAmount:
      Number(total.toFixed(2)),

    amountPaid:
      Number(payableAmount.toFixed(2)),

    remainingAmount:
      Number(
        remainingAmount.toFixed(2),
      ),

    paymentType:
      selectedFoodPayment,

    paymentStatus:
      selectedFoodPayment === "counter"
        ? "PARTIALLY_PAID"
        : "PAID",

    pointsEarned,

    orderStatus:
      "CONFIRMED",

    createdAt:
      serverTimestamp(),
  };


  try {
    const foodButton =
      document.getElementById(
        "foodPaymentButton",
      );

    if (foodButton) {
      foodButton.disabled = true;

      foodButton.textContent =
        "Processing...";
    }


    const foodOrderRef =
      doc(
        db,
        "users",
        user.uid,
        "foodOrders",
        crypto.randomUUID(),
      );


     await setDoc(
       foodOrderRef,
       foodOrder,
      );


    /*
        Update user reward points.
    */

    const userRef =
      doc(
        db,
        "users",
        user.uid,
      );


    const userSnapshot =
      await getDoc(userRef);


    if (userSnapshot.exists()) {
      await updateDoc(
        userRef,
        {
          rewardPoints:
            increment(pointsEarned),
        },
      );
    }


    closeFoodModal();


    showFoodSuccess(
      foodOrder,
    );


    await loadUserBookings();

  } catch (error) {
    console.error(
      "Food order error:",
      error,
    );

    alert(
      "Unable to place food order. Please try again.",
    );

    const foodButton =
      document.getElementById(
        "foodPaymentButton",
      );

    if (foodButton) {
      foodButton.disabled = false;

      updateFoodCart();
    }
  }
}


// =========================================
// FOOD SUCCESS
// =========================================

function showFoodSuccess(order) {
  const modal =
    document.getElementById(
      "foodSuccessModal",
    );

  if (!modal) {
    alert(
      `Food order confirmed! You earned ${order.pointsEarned} reward points.`,
    );

    return;
  }


  document.getElementById(
    "earnedFoodPoints",
  ).textContent =
    `${order.pointsEarned} Points`;


  document.getElementById(
    "foodSuccessAmount",
  ).textContent =
    formatCurrency(
      order.amountPaid,
    );


  modal.classList.remove("hidden");
}
// =========================================
// EXPORT
// =========================================

export { initializeMyBookingsPage };
