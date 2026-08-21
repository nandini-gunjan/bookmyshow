/* =========================================
   BOOKITBRO
   CONFIRMATION PAGE
========================================= */

/* =========================================
   STATE
========================================= */

let confirmationData = null;

/* =========================================
   LOAD CONFIRMATION DATA
========================================= */

function loadConfirmationData() {
  const storedData = sessionStorage.getItem("bookItBroConfirmation");

  if (!storedData) {
    showConfirmationError();
    return false;
  }

  try {
    confirmationData = JSON.parse(storedData);

    console.log("Confirmation Data:", confirmationData);

    if (!confirmationData || typeof confirmationData !== "object") {
      throw new Error("Invalid confirmation data");
    }

    return true;
  } catch (error) {
    console.error("Unable to read confirmation data:", error);

    showConfirmationError();

    return false;
  }
}

/* =========================================
   DISPLAY BOOKING
========================================= */

function displayBooking() {
  if (confirmationData.bookingType === "sports") {
    return displaySportsConfirmation();
  }

  return displayMovieConfirmation();
}

/* =========================================
   DISPLAY MOVIE CONFIRMATION
========================================= */

function displayMovieConfirmation() {
  /*
      Success message
  */

  const successTitle = document.querySelector(".success-section h1");
  const successMessage = document.querySelector(".success-section p");

  if (successTitle) {
    successTitle.textContent = "Booking Confirmed!";
  }

  if (successMessage) {
    successMessage.textContent =
      "Your movie tickets have been booked successfully.";
  }

  /*
      Ticket label
  */

  const ticketLabel = document.querySelector(".ticket-label");

  if (ticketLabel) {
    ticketLabel.textContent = "MOVIE TICKET";
  }

  /*
      Movie title
  */

  const title = confirmationData.movieTitle || "Movie";

  const movieTitle = document.getElementById("movieTitle");
  const movieTitleSmall = document.getElementById("movieTitleSmall");

  if (movieTitle) {
    movieTitle.textContent = title;
  }

  if (movieTitleSmall) {
    movieTitleSmall.textContent = title;
  }

  /*
      Movie metadata
  */

  const movieMeta = document.getElementById("movieMeta");

  if (movieMeta) {
    movieMeta.textContent = `${confirmationData.language || "Movie"} • ${
      confirmationData.certificate || "UA"
    }`;
  }

  /*
      Rating
  */

  const movieRating = document.getElementById("movieRating");

  if (movieRating) {
    movieRating.textContent = confirmationData.rating || "N/A";
  }

  /*
      Poster
  */

  const posterElement = document.getElementById("moviePoster");

  if (posterElement) {
    const poster = confirmationData.moviePoster || "";

    if (poster) {
      posterElement.style.display = "block";
      posterElement.src = poster;

      posterElement.onerror = () => {
        posterElement.style.display = "none";
      };
    } else {
      posterElement.style.display = "none";
    }
  }

  /*
      Show information
  */

  displayShowDetails();

  /*
      IMPORTANT:
      This was missing in your original code.
  */

  return true;
}

/* =========================================
   DISPLAY SHOW DETAILS
========================================= */

/* =========================================
   DISPLAY SHOW DETAILS
========================================= */

/* =========================================
   DISPLAY SHOW DETAILS
========================================= */

function displayShowDetails() {
  const theatreName = document.getElementById("theatreName");
  const screenName = document.getElementById("screenName");
  const showDate = document.getElementById("showDate");
  const showTime = document.getElementById("showTime");

  const confirmedSeatsElement = document.getElementById("confirmedSeats");

  const frozenSeatsElement = document.getElementById("frozenSeats");

  const ticketCountElement = document.getElementById("ticketCount");

  // =========================================
  // THEATRE
  // =========================================

  if (theatreName) {
    theatreName.textContent = confirmationData.theatreName || "Theatre";
  }

  // =========================================
  // SCREEN
  // =========================================

  if (screenName) {
    screenName.textContent = confirmationData.screen || "Screen 1";
  }

  // =========================================
  // DATE
  // =========================================

  if (showDate) {
    showDate.textContent = formatDate(confirmationData.date);
  }

  // =========================================
  // SHOWTIME
  // =========================================

  if (showTime) {
    showTime.textContent = confirmationData.showTime || "—";
  }

  // =========================================
  // CONFIRMED SEATS
  // =========================================

  let confirmedSeats = Array.isArray(confirmationData.confirmedSeats)
    ? confirmationData.confirmedSeats
    : [];

  // Normal booking fallback
  if (
    confirmedSeats.length === 0 &&
    confirmationData.bookingStatus === "CONFIRMED" &&
    Array.isArray(confirmationData.seats)
  ) {
    confirmedSeats = confirmationData.seats;
  }

  // =========================================
  // FROZEN SEATS
  // =========================================

  let frozenSeats = Array.isArray(confirmationData.frozenSeats)
    ? confirmationData.frozenSeats
    : [];

  // =========================================
  // FROZEN BOOKING PAYMENT COMPLETED
  //
  // Move frozen seats to confirmed seats.
  // =========================================

  if (
    confirmationData.frozenStatus === "COMPLETED" ||
    confirmationData.paymentMode === "frozen-confirmation"
  ) {
    if (confirmedSeats.length === 0 && frozenSeats.length > 0) {
      confirmedSeats = [...frozenSeats];
    }

    frozenSeats = [];
  }

  // =========================================
  // DISPLAY CONFIRMED SEATS
  // =========================================

  if (confirmedSeatsElement) {
    confirmedSeatsElement.textContent =
      confirmedSeats.length > 0 ? confirmedSeats.join(", ") : "None";
  }

  // =========================================
  // DISPLAY FROZEN SEATS
  // =========================================

  if (frozenSeatsElement) {
    frozenSeatsElement.textContent =
      frozenSeats.length > 0 ? frozenSeats.join(", ") : "None";
  }

  // =========================================
  // TOTAL TICKETS
  // =========================================

  const totalTickets = confirmedSeats.length + frozenSeats.length;

  if (ticketCountElement) {
    ticketCountElement.textContent = totalTickets;
  }
}

/* =========================================
   SPORTS CONFIRMATION
========================================= */

function displaySportsConfirmation() {
  const sports = confirmationData;

  /*
      Success message
  */

  const successTitle = document.querySelector(".success-section h1");
  const successMessage = document.querySelector(".success-section p");

  if (successTitle) {
    successTitle.textContent = "Sports Booking Confirmed!";
  }

  if (successMessage) {
    successMessage.textContent =
      "Your sports event tickets have been booked successfully.";
  }

  /*
      Ticket label
  */

  const ticketLabel = document.querySelector(".ticket-label");

  if (ticketLabel) {
    ticketLabel.textContent = "SPORTS TICKET";
  }

  /*
      Event name
  */

  const eventName = sports.eventName || "Sports Event";

  const movieTitle = document.getElementById("movieTitle");

  const movieTitleSmall = document.getElementById("movieTitleSmall");

  if (movieTitle) {
    movieTitle.textContent = eventName;
  }

  if (movieTitleSmall) {
    movieTitleSmall.textContent = eventName;
  }

  /*
      Sport + League
  */

  const sport = sports.sport || "Sports";
  const league = sports.league || "Sports Event";

  const movieMeta = document.getElementById("movieMeta");

  if (movieMeta) {
    movieMeta.textContent = `${sport} • ${league}`;
  }

  /*
      Rating area
  */

  const movieRating = document.getElementById("movieRating");

  if (movieRating) {
    movieRating.textContent = "LIVE EVENT";
  }

  /*
      Poster
  */

  const poster = sports.poster || sports.moviePoster || "";

  const posterElement = document.getElementById("moviePoster");

  if (posterElement) {
    if (poster) {
      posterElement.style.display = "block";
      posterElement.src = poster;

      posterElement.onerror = () => {
        posterElement.style.display = "none";
      };
    } else {
      posterElement.style.display = "none";
    }
  }

  /*
      Venue
  */

  const theatreName = document.getElementById("theatreName");

  if (theatreName) {
    theatreName.textContent = sports.venue || "Venue";
  }

  /*
      Teams
  */

  const homeTeam = sports.homeTeam || "Home Team";

  const awayTeam = sports.awayTeam || "Away Team";

  const screenName = document.getElementById("screenName");

  if (screenName) {
    screenName.textContent = `${homeTeam} VS ${awayTeam}`;
  }

  /*
      Date
  */

  const showDate = document.getElementById("showDate");

  if (showDate) {
    showDate.textContent = formatDate(sports.date);
  }

  /*
      Time
  */

  const showTime = document.getElementById("showTime");

  if (showTime) {
    showTime.textContent = sports.showTime || "—";
  }

  /*
      Sports events don't use cinema seats.
  */

  const selectedSeats = document.getElementById("selectedSeats");

  if (selectedSeats) {
    selectedSeats.textContent = "General Admission";
  }

  /*
      Ticket count
  */

  const ticketCountElement = document.getElementById("ticketCount");

  const ticketCount = Number(sports.ticketCount) || 0;

  if (ticketCountElement) {
    ticketCountElement.textContent = ticketCount;
  }

  return true;
}

/* =========================================
   DISPLAY FOOD ORDER
========================================= */

function displayFoodOrder() {
  const foodSection = document.getElementById("foodSection");
  const foodItemsElement = document.getElementById("foodItems");
  const foodItemCountElement = document.getElementById("foodItemCount");
  const foodTotalElement = document.getElementById("foodTotal");

  if (!foodSection || !foodItemsElement) {
    return;
  }

  const foodOrder = Array.isArray(confirmationData.foodOrder)
    ? confirmationData.foodOrder.filter((item) => Number(item.quantity) > 0)
    : [];

  /*
      NO FOOD
  */

  if (foodOrder.length === 0) {
    foodSection.style.display = "none";
    return;
  }

  foodSection.style.display = "block";

  /*
      CLEAR OLD ITEMS
  */

  foodItemsElement.innerHTML = "";

  let totalQuantity = 0;
  let totalAmount = 0;

  /*
      DISPLAY FOOD ITEMS
  */

  foodOrder.forEach((item) => {
    const name = item.name || "Food Item";
    const quantity = Number(item.quantity) || 0;
    const price = Number(item.price) || 0;

    const itemTotal = quantity * price;

    totalQuantity += quantity;
    totalAmount += itemTotal;

    const foodItem = document.createElement("div");

    foodItem.className = "confirmation-food-item";

    foodItem.innerHTML = `
      <div>
        <strong>${escapeHtml(name)}</strong>

        <small>
          ${quantity} × ${formatCurrency(price)}
        </small>
      </div>

      <strong>
        ${formatCurrency(itemTotal)}
      </strong>
    `;

    foodItemsElement.appendChild(foodItem);
  });

  /*
      ITEM COUNT
  */

  if (foodItemCountElement) {
    foodItemCountElement.textContent = `${totalQuantity} item${totalQuantity === 1 ? "" : "s"}`;
  }

  /*
      TOTAL
  */

  if (foodTotalElement) {
    foodTotalElement.textContent = formatCurrency(totalAmount);
  }
}

/* =========================================
   DISPLAY PAYMENT
========================================= */

function displayPayment() {
  /*
      BOOKING ID
  */

  const bookingId = confirmationData.bookingId || generateBookingId();

  console.log("Booking ID:", bookingId);

  const bookingIdElement = document.getElementById("bookingId");

  if (bookingIdElement) {
    bookingIdElement.textContent = bookingId;
  }

  /*
      PAYMENT METHOD
  */

  const paymentMethod = confirmationData.paymentMethod || "upi";

  const paymentMethodElement = document.getElementById("paymentMethod");

  if (paymentMethodElement) {
    paymentMethodElement.textContent = formatPaymentMethod(paymentMethod);
  }

  /*
      TOTAL PAID
  */

  let total = Number(confirmationData.totalAmount);

  /*
      Demo fallback if total is missing
  */

  if (!Number.isFinite(total) || total <= 0) {
    const ticketCount =
      Number(confirmationData.ticketCount) ||
      (Array.isArray(confirmationData.seats)
        ? confirmationData.seats.length
        : 1);

    const ticketPrice = 250;
    const convenienceFee = 30;

    total = ticketCount * ticketPrice + convenienceFee;
  }

  const totalElement = document.getElementById("totalAmount");

  if (totalElement) {
    totalElement.textContent = formatCurrency(total);
  }
}

/* =========================================
   GENERATE BOOKING ID
========================================= */

function generateBookingId() {
  const randomNumber = Math.floor(10000000 + Math.random() * 90000000);

  return `BIB${randomNumber}`;
}

/* =========================================
   PAYMENT METHOD LABEL
========================================= */

function formatPaymentMethod(method) {
  const methods = {
    upi: "UPI",
    card: "Credit / Debit Card",
    netbanking: "Net Banking",
    wallet: "Wallet",
  };

  /*
      Handle different capitalization
  */

  const normalizedMethod = String(method).trim().toLowerCase();

  return methods[normalizedMethod] || "Online Payment";
}

/* =========================================
   ESCAPE HTML
========================================= */

function escapeHtml(value) {
  const div = document.createElement("div");

  div.textContent = value || "";

  return div.innerHTML;
}

/* =========================================
   FORMAT CURRENCY
========================================= */

function formatCurrency(amount) {
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount)) {
    return "₹0.00";
  }

  return `₹${numericAmount.toFixed(2)}`;
}

/* =========================================
   FORMAT DATE
========================================= */

function formatDate(dateString) {
  if (!dateString) {
    return "—";
  }

  /*
      Handle YYYY-MM-DD without
      timezone shifting.
  */

  if (
    typeof dateString === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(dateString)
  ) {
    const [year, month, day] = dateString.split("-");

    const date = new Date(Number(year), Number(month) - 1, Number(day));

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
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
   DOWNLOAD TICKET
========================================= */

function downloadTicket() {
  /*
      Browser print dialog can be used
      to save the ticket as PDF.
  */

  window.print();
}

/* =========================================
   HOME BUTTON
========================================= */

function goHome() {
  window.location.href = "index.html";
}

/* =========================================
   SETUP ACTIONS
========================================= */

function setupActions() {
  const downloadButton = document.getElementById("downloadTicketButton");

  const homeButton = document.getElementById("homeButton");

  if (downloadButton) {
    downloadButton.addEventListener("click", downloadTicket);
  }

  if (homeButton) {
    homeButton.addEventListener("click", goHome);
  }
}

/* =========================================
   CONFIRMATION ERROR
========================================= */

function showConfirmationError() {
  document.body.innerHTML = `
    <div style="
      min-height:100vh;
      display:flex;
      align-items:center;
      justify-content:center;
      padding:20px;
      background:#f4f5f7;
      font-family:Arial,sans-serif;
      text-align:center;
    ">

      <div style="
        max-width:430px;
      ">

        <div style="
          font-size:52px;
          margin-bottom:15px;
        ">
          🎟️
        </div>

        <h2 style="
          margin-bottom:10px;
        ">
          Booking Not Found
        </h2>

        <p style="
          color:#777;
          line-height:1.6;
          margin-bottom:22px;
        ">
          We couldn't find your booking
          confirmation. Please complete
          your booking again.
        </p>

        <button
          type="button"
          onclick="window.location.href='index.html'"
          style="
            border:none;
            padding:12px 25px;
            border-radius:7px;
            background:#e51937;
            color:white;
            font-weight:600;
            cursor:pointer;
          "
        >
          Back to Home
        </button>

      </div>

    </div>
  `;
}

/* =========================================
   INITIALIZE
========================================= */

function initialize() {
  const loaded = loadConfirmationData();

  if (!loaded) {
    return;
  }

  const displayed = displayBooking();

  if (!displayed) {
    console.error("Unable to display booking confirmation.");

    return;
  }

  displayFoodOrder();

  displayPayment();

  setupActions();
}

/* =========================================
   START
========================================= */

initialize();
