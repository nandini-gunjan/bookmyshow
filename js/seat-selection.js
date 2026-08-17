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
  const selectedSeatsElement = document.getElementById("selectedSeats");

  const ticketCountElement = document.getElementById("ticketCount");

  const totalPriceElement = document.getElementById("totalPrice");

  const continueButton = document.getElementById("continueButton");

  if (selectedSeats.length === 0) {
    selectedSeatsElement.textContent = "None";
  } else {
    selectedSeatsElement.textContent = selectedSeats.join(", ");
  }

  ticketCountElement.textContent = selectedSeats.length;

  const total = selectedSeats.length * ticketPrice;

  totalPriceElement.textContent = `₹${total}`;

  continueButton.disabled = selectedSeats.length === 0;
}

/* =========================================
   CONTINUE
========================================= */

function continueToSummary() {
  if (selectedSeats.length === 0) {
    return;
  }

  const finalBooking = {
    ...bookingData,

    seats: selectedSeats,

    numberOfTickets: selectedSeats.length,

    totalAmount: selectedSeats.length * ticketPrice,
  };

  /*
        Save complete booking.
    */

  sessionStorage.setItem("bookItBroFinalBooking", JSON.stringify(finalBooking));

  console.log("Final booking:", finalBooking);

  /*
        Next page we'll create:

        booking-summary.html
    */

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
