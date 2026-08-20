/* =========================================
   BOOKITBRO
   SEAT SELECTION
========================================= */

/* =========================================
   STATE
========================================= */

let bookingData = null;

let selectedSeats = [];

let ticketPrice = 0;

/* =========================================
   SEAT CONFIGURATION
========================================= */

const rows = [
  {
    name: "A",
    seats: 8,
  },
  {
    name: "B",
    seats: 8,
  },
  {
    name: "C",
    seats: 10,
  },
  {
    name: "D",
    seats: 10,
  },
  {
    name: "E",
    seats: 10,
  },
  {
    name: "F",
    seats: 10,
  },
  {
    name: "G",
    seats: 10,
  },
  {
    name: "H",
    seats: 10,
  },
  {
    name: "I",
    seats: 10,
  },
  {
    name: "J",
    seats: 10,
  },
];

/* =========================================
   LOAD BOOKING DATA
========================================= */

function loadBookingData() {
  const storedData = sessionStorage.getItem("bookItBroBooking");

  if (!storedData) {
    showError();

    return false;
  }

  try {
    bookingData = JSON.parse(storedData);

    ticketPrice = Number(bookingData.ticketPrice) || 0;

    return true;
  } catch (error) {
    console.error("Booking data error:", error);

    showError();

    return false;
  }
}

/* =========================================
   DISPLAY MOVIE / SHOW INFO
========================================= */

function displayBookingInformation() {
  const movieTitle = document.getElementById("movieTitle");

  const showInformation = document.getElementById("showInformation");

  if (!bookingData) {
    return;
  }

  movieTitle.textContent = bookingData.movieTitle;

  const date = formatDate(bookingData.date);

  showInformation.textContent = `${bookingData.theatreName} • ${date} • ${bookingData.showTime}`;
}

/* =========================================
   GENERATE SEATS
========================================= */

function generateSeats() {
  const container = document.getElementById("seatLayout");

  container.innerHTML = "";

  rows.forEach((row, rowIndex) => {
    const rowElement = document.createElement("div");

    rowElement.className = "seat-row";

    const label = document.createElement("span");

    label.className = "row-label";

    label.textContent = row.name;

    rowElement.appendChild(label);

    const seatsContainer = document.createElement("div");

    seatsContainer.className = "seats";

    for (let seatNumber = 1; seatNumber <= row.seats; seatNumber++) {
      /*
                    Create some realistic
                    unavailable seats.
                */

      const occupied = isOccupied(rowIndex, seatNumber);

      const seat = document.createElement("button");

      seat.type = "button";

      seat.className = "seat";

      seat.textContent = seatNumber;

      seat.dataset.seat = `${row.name}${seatNumber}`;

      if (occupied) {
        seat.classList.add("occupied");

        seat.disabled = true;
      }

      seat.addEventListener("click", () => {
        toggleSeat(seat);
      });

      seatsContainer.appendChild(seat);
    }

    rowElement.appendChild(seatsContainer);

    container.appendChild(rowElement);
  });
}

/* =========================================
   OCCUPIED SEATS
========================================= */

function isOccupied(rowIndex, seatNumber) {
  /*
        Temporary demo availability.

        Later this will come from
        your real backend/API.
    */

  const occupiedSeats = {
    0: [3, 4],

    1: [6],

    2: [2, 8],

    3: [4, 5],

    4: [7],

    5: [1, 9],

    6: [3, 4],

    7: [6],

    8: [2, 10],

    9: [5, 6],
  };

  return (
    occupiedSeats[rowIndex] && occupiedSeats[rowIndex].includes(seatNumber)
  );
}

/* =========================================
   CHECK BOOKING EXPIRY
========================================= */

function checkBookingExpiry() {
  const storedBooking =
    sessionStorage.getItem("bookItBroFinalBooking");

  if (!storedBooking) {
    return null;
  }

  let booking;

  try {
    booking = JSON.parse(storedBooking);
  } catch (error) {
    console.error("Invalid booking data");
    return null;
  }

  /*
      Already confirmed
  */
  if (booking.bookingStatus === "CONFIRMED") {
    return booking;
  }

  /*
      Already cancelled
  */
  if (booking.bookingStatus === "CANCELLED") {
    return booking;
  }

  /*
      Only frozen bookings expire
  */
  if (
    booking.bookingStatus === "FROZEN" &&
    Date.now() >= booking.confirmationDeadline
  ) {
    booking.bookingStatus = "CANCELLED";

    booking.paymentStatus = "ADVANCE_FORFEITED";

    booking.cancelledAt = Date.now();

    /*
        Remove frozen seats
    */
    booking.seats = [];

    sessionStorage.setItem(
      "bookItBroFinalBooking",
      JSON.stringify(booking)
    );

    console.log(
      "Booking automatically cancelled:",
      booking
    );

    return booking;
  }

  return booking;
}
/* =========================================
   SELECT / DESELECT SEAT
========================================= */

function toggleSeat(seat) {
  const seatId = seat.dataset.seat;

  const index = selectedSeats.indexOf(seatId);

  if (index === -1) {
    /*
            Limit seats to 10.
        */

    if (selectedSeats.length >= 10) {
      alert("You can select maximum 10 seats.");

      return;
    }

    selectedSeats.push(seatId);

    seat.classList.add("selected");
  } else {
    selectedSeats.splice(index, 1);

    seat.classList.remove("selected");
  }

  updateSummary();
}

/* =========================================
   UPDATE SUMMARY
========================================= */

function updateSummary() {
  const selectedSeatsElement =
    document.getElementById("selectedSeats");

  const ticketCountElement =
    document.getElementById("ticketCount");

  const totalPriceElement =
    document.getElementById("totalPrice");

  const advancePriceElement =
    document.getElementById("advancePrice");

  const continueButton =
    document.getElementById("continueButton");

  if (selectedSeats.length === 0) {
    selectedSeatsElement.textContent = "None";
  } else {
    selectedSeatsElement.textContent =
      selectedSeats.join(", ");
  }

  ticketCountElement.textContent =
    selectedSeats.length;

  const total =
    selectedSeats.length * ticketPrice;

  const advance =
    total * 0.5;

  totalPriceElement.textContent =
    `₹${total}`;

  advancePriceElement.textContent =
    `₹${advance}`;

  continueButton.disabled =
    selectedSeats.length === 0;
}
  
  /* =========================================
   CONTINUE TO BOOKING SUMMARY
========================================= */

function continueToSummary() {
  if (selectedSeats.length === 0) {
    return;
  }

  const totalAmount = selectedSeats.length * ticketPrice;

  // 50% advance required to freeze seats
  const advanceAmount = totalAmount * 0.5;

  /*
      Calculate movie/show date and time
  */
  const showDateTime = getShowDateTime();

  if (!showDateTime) {
    alert("Unable to determine movie show time.");
    return;
  }

  /*
      Confirmation deadline:
      2 hours before movie starts
  */
  const confirmationDeadline =
    showDateTime.getTime() - 2 * 60 * 60 * 1000;

  /*
      If movie is already within 2 hours,
      seats cannot be frozen.
  */
  if (Date.now() >= confirmationDeadline) {
    alert(
      "Seat freezing is no longer available because the movie starts within 2 hours."
    );

    return;
  }

  const finalBooking = {
    ...bookingData,

    seats: [...selectedSeats],

    numberOfTickets: selectedSeats.length,

    totalAmount: totalAmount,

    /*
        50% payment for freezing seats
    */
    advanceAmount: advanceAmount,

    remainingAmount: totalAmount - advanceAmount,

    /*
        Booking status
    */
    bookingStatus: "FROZEN",

    /*
        Time when seats were frozen
    */
    frozenAt: Date.now(),

    /*
        Deadline to confirm ticket
    */
    confirmationDeadline: confirmationDeadline,

    /*
        Movie/show start time
    */
    showDateTime: showDateTime.getTime(),

    /*
        Generate booking ID
    */
    bookingId: generateBookingId(),

    /*
        Payment information
    */
    paymentStatus: "ADVANCE_PAID",

    paymentMethod: "UPI",
  };

  sessionStorage.setItem(
    "bookItBroFinalBooking",
    JSON.stringify(finalBooking)
  );

  console.log("Frozen booking:", finalBooking);

  window.location.href = "booking-summary.html";
}

/* =========================================
   BACK
========================================= */

function goBack() {
  window.history.back();
}

/* =========================================
   FORMAT DATE
========================================= */

function formatDate(dateString) {
  if (!dateString) {
    return "";
  }

  const date = new Date(dateString);

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* =========================================
   GET SHOW DATE + TIME
========================================= */

function getShowDateTime() {
  if (!bookingData.date || !bookingData.showTime) {
    return null;
  }

  const date = new Date(bookingData.date);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  /*
      Extract time such as:
      7:30 PM
      10:00 AM
      6:45 PM
  */

  const timeMatch = bookingData.showTime.match(
    /(\d{1,2}):(\d{2})\s*(AM|PM)/i
  );

  if (!timeMatch) {
    console.error("Invalid show time:", bookingData.showTime);
    return null;
  }

  let hours = Number(timeMatch[1]);
  const minutes = Number(timeMatch[2]);
  const period = timeMatch[3].toUpperCase();

  if (period === "PM" && hours !== 12) {
    hours += 12;
  }

  if (period === "AM" && hours === 12) {
    hours = 0;
  }

  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(0);
  date.setMilliseconds(0);

  return date;
}

/* =========================================
   GENERATE BOOKING ID
========================================= */

function generateBookingId() {
  const random = Math.floor(100000 + Math.random() * 900000);

  return `BIB${random}`;
}
/* =========================================
   ERROR
========================================= */

function showError() {
  document.body.innerHTML = `

        <div style="
            min-height:100vh;
            display:flex;
            align-items:center;
            justify-content:center;
            text-align:center;
            font-family:Arial;
            background:#f5f5f5;
            padding:20px;
        ">

            <div>

                <h2>
                    Booking information not found
                </h2>

                <p style="
                    color:#777;
                    margin:10px 0 20px;
                ">
                    Please select a movie and showtime again.
                </p>

                <button
                    onclick="history.back()"
                    style="
                        padding:12px 25px;
                        border:0;
                        border-radius:5px;
                        background:#e51937;
                        color:#fff;
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
  const valid = loadBookingData();

  if (!valid) {
    return;
  }

  displayBookingInformation();

  generateSeats();

  updateSummary();

  document
    .getElementById("continueButton")
    .addEventListener("click", continueToSummary);

  document.getElementById("backButton").addEventListener("click", goBack);
}

initialize();
