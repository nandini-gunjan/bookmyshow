// =========================================
// BOOKITBRO
// SPORTS PRE-BOOKING
// =========================================

// =========================================
// STATE
// =========================================

let sportBooking = null;

let ticketCount = 1;

const TICKET_PRICE = 500;

// =========================================
// LOAD SPORTS BOOKING DATA
// =========================================

function loadSportBooking() {
  const storedData = sessionStorage.getItem("bookItBroSportBooking");

  if (!storedData) {
    showBookingError();

    return false;
  }

  try {
    sportBooking = JSON.parse(storedData);

    console.log("Sports Booking Data:", sportBooking);

    return true;
  } catch (error) {
    console.error("Unable to read sports booking data:", error);

    showBookingError();

    return false;
  }
}

// =========================================
// DISPLAY EVENT
// =========================================

function displayEvent() {
  const poster =
    sportBooking.poster ||
    sportBooking.strThumb ||
    sportBooking.strPoster ||
    "";

  const eventName =
    sportBooking.eventName || sportBooking.strEvent || "Sports Event";

  const sport = sportBooking.sport || sportBooking.strSport || "Sports";

  const league = sportBooking.league || sportBooking.strLeague || "N/A";

  const date = sportBooking.date || sportBooking.dateEvent || "N/A";

  const time = sportBooking.time || sportBooking.strTime || "N/A";

  const venue = sportBooking.venue || sportBooking.strVenue || "N/A";

  const city = sportBooking.city || sportBooking.strCity || "N/A";

  const country = sportBooking.country || sportBooking.strCountry || "N/A";

  const homeTeam = sportBooking.homeTeam || sportBooking.strHomeTeam || "N/A";

  const awayTeam = sportBooking.awayTeam || sportBooking.strAwayTeam || "N/A";

  // -----------------------------------------
  // POSTER
  // -----------------------------------------

  const posterElement = document.getElementById("eventPoster");

  if (poster && posterElement) {
    posterElement.src = poster;

    posterElement.onerror = () => {
      posterElement.style.display = "none";
    };
  } else if (posterElement) {
    posterElement.style.display = "none";
  }

  // -----------------------------------------
  // EVENT INFORMATION
  // -----------------------------------------

  document.getElementById("eventSport").textContent = sport;

  document.getElementById("eventName").textContent = eventName;

  document.getElementById("eventLeague").textContent = league;

  document.getElementById("eventDate").textContent = formatDate(date);

  document.getElementById("eventTime").textContent = time;

  document.getElementById("eventVenue").textContent = venue;

  document.getElementById("eventLocation").textContent = `${city}, ${country}`;

  document.getElementById("homeTeam").textContent = homeTeam;

  document.getElementById("awayTeam").textContent = awayTeam;
}

// =========================================
// FORMAT DATE
// =========================================

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

// =========================================
// UPDATE PRICE
// =========================================

function updatePrice() {
  const ticketPrice = Number(sportBooking.ticketPrice) || TICKET_PRICE;

  const total = ticketPrice * ticketCount;

  document.getElementById("ticketCount").textContent = ticketCount;

  document.getElementById("ticketQuantity").textContent = ticketCount;

  document.getElementById("ticketPrice").textContent =
    formatCurrency(ticketPrice);

  document.getElementById("totalAmount").textContent = formatCurrency(total);
}

// =========================================
// FORMAT CURRENCY
// =========================================

function formatCurrency(amount) {
  return `₹${Number(amount).toFixed(2)}`;
}

// =========================================
// INCREASE TICKETS
// =========================================

function increaseTickets() {
  if (ticketCount >= 10) {
    return;
  }

  ticketCount++;

  updatePrice();
}

// =========================================
// DECREASE TICKETS
// =========================================

function decreaseTickets() {
  if (ticketCount <= 1) {
    return;
  }

  ticketCount--;

  updatePrice();
}

// =========================================
// CONTINUE TO PAYMENT
// =========================================

function continueToPayment() {
  const ticketPrice = Number(sportBooking.ticketPrice) || TICKET_PRICE;

  const totalAmount = ticketPrice * ticketCount;

  /*
      Create data in the same general
      structure used by payment.html.

      This allows the existing
      payment.html/payment.js to
      handle the payment page.
  */

  const paymentData = {
    bookingType: "sports",

    eventId: sportBooking.eventId || sportBooking.idEvent || "",

    eventName:
      sportBooking.eventName || sportBooking.strEvent || "Sports Event",

    sport: sportBooking.sport || sportBooking.strSport || "Sports",

    league: sportBooking.league || sportBooking.strLeague || "N/A",

    venue: sportBooking.venue || sportBooking.strVenue || "N/A",

    city: sportBooking.city || sportBooking.strCity || "N/A",

    country: sportBooking.country || sportBooking.strCountry || "N/A",

    homeTeam: sportBooking.homeTeam || sportBooking.strHomeTeam || "N/A",

    awayTeam: sportBooking.awayTeam || sportBooking.strAwayTeam || "N/A",

    poster:
      sportBooking.poster ||
      sportBooking.strThumb ||
      sportBooking.strPoster ||
      "",

    date: sportBooking.date || sportBooking.dateEvent || "",

    showTime: sportBooking.time || sportBooking.strTime || "",

    ticketCount: ticketCount,

    baseAmount: totalAmount,

    convenienceFee: 0,

    gst: 0,

    totalAmount: totalAmount,
  };

  /*
      Save using the SAME key that
      payment.js already expects.
  */

  sessionStorage.setItem("bookItBroPayment", JSON.stringify(paymentData));

  console.log("Payment Data:", paymentData);

  /*
      Open existing payment page.
  */

  window.location.href = "payment.html";
}

// =========================================
// BACK BUTTON
// =========================================

function goBack() {
  window.history.back();
}

// =========================================
// SHOW ERROR
// =========================================

function showBookingError() {
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
        max-width:430px;
      ">

        <div style="
          font-size:50px;
          margin-bottom:15px;
        ">
          ⚠️
        </div>

        <h2>
          Sports Booking Not Found
        </h2>

        <p style="
          color:#777;
          line-height:1.6;
          margin:15px 0 22px;
        ">
          We couldn't find the sports event
          you selected. Please return and
          select the event again.
        </p>

        <button
          onclick="history.back()"
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
          Go Back
        </button>

      </div>

    </div>

  `;
}

// =========================================
// SETUP EVENTS
// =========================================

function setupEvents() {
  document
    .getElementById("increaseButton")
    .addEventListener("click", increaseTickets);

  document
    .getElementById("decreaseButton")
    .addEventListener("click", decreaseTickets);

  document
    .getElementById("continueButton")
    .addEventListener("click", continueToPayment);

  document.getElementById("backButton").addEventListener("click", goBack);
}

// =========================================
// INITIALIZE
// =========================================

function initialize() {
  const loaded = loadSportBooking();

  if (!loaded) {
    return;
  }

  displayEvent();

  updatePrice();

  setupEvents();
}

// =========================================
// START
// =========================================

initialize();
