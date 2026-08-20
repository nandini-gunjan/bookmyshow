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
   DISPLAY MOVIE / SHOW INFORMATION
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

    /* ROW LABEL */

    const label = document.createElement("span");

    label.className = "row-label";

    label.textContent = row.name;

    rowElement.appendChild(label);

    /* SEATS CONTAINER */

    const seatsContainer = document.createElement("div");

    seatsContainer.className = "seats";

    /* CREATE SEATS */

    for (let seatNumber = 1; seatNumber <= row.seats; seatNumber++) {
      const seat = document.createElement("button");

      const seatId = `${row.name}${seatNumber}`;

      seat.type = "button";

      seat.className = "seat";

      seat.textContent = seatNumber;

      seat.dataset.seat = seatId;

      /* SOLD SEATS */

      if (isOccupied(rowIndex, seatNumber)) {
        seat.classList.add("occupied");

        seat.disabled = true;
      }

      /* CLICK */

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
      Temporary demo data.

      Later replace this with
      Firebase / Firestore data.
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

  /*
      Find seat in selected seats
  */

  const existingSeatIndex = selectedSeats.findIndex(
    (selectedSeat) => selectedSeat.seatId === seatId,
  );

  /* =========================================
     SELECT SEAT
  ========================================= */

  if (existingSeatIndex === -1) {
    /*
        Maximum 10 seats
    */

    if (selectedSeats.length >= 10) {
      alert("You can select a maximum of 10 seats.");

      return;
    }

    /*
        Default booking type:
        CONFIRMED
    */

    selectedSeats.push({
      seatId: seatId,

      bookingType: "CONFIRMED",
    });

    seat.classList.add("selected");
  } else {
    /* =========================================
     DESELECT SEAT
  ========================================= */
    selectedSeats.splice(existingSeatIndex, 1);

    seat.classList.remove("selected");
    seat.classList.remove("frozen");
  }

  renderSeatTypeSelection();

  updateSummary();
}

/* =========================================
   RENDER SEAT TYPE SELECTION
========================================= */

function renderSeatTypeSelection() {
  const container = document.getElementById("selectedSeatTypes");

  container.innerHTML = "";

  /* NO SEATS */

  if (selectedSeats.length === 0) {
    container.innerHTML = `
      <p class="empty-seat-message">
        Select seats to choose their booking type.
      </p>
    `;

    return;
  }

  /* CREATE OPTIONS */

  selectedSeats.forEach((selectedSeat) => {
    const seatItem = document.createElement("div");

    seatItem.className = "seat-type-item";

    /* SEAT NAME */

    const seatName = document.createElement("strong");

    seatName.textContent = selectedSeat.seatId;

    /* TYPE CONTAINER */

    const typeButtons = document.createElement("div");

    typeButtons.className = "seat-type-buttons";

    /* CONFIRM BUTTON */

    const confirmButton = document.createElement("button");

    confirmButton.type = "button";

    confirmButton.textContent = "Confirm";

    confirmButton.className = "seat-type-button confirm-type";

    /* FREEZE BUTTON */

    const freezeButton = document.createElement("button");

    freezeButton.type = "button";

    freezeButton.textContent = "Freeze";

    freezeButton.className = "seat-type-button freeze-type";

    /* ACTIVE TYPE */

    if (selectedSeat.bookingType === "CONFIRMED") {
      confirmButton.classList.add("active");
    } else {
      freezeButton.classList.add("active");
    }

    /* CONFIRM CLICK */

    confirmButton.addEventListener("click", () => {
      changeSeatBookingType(selectedSeat.seatId, "CONFIRMED");
    });

    /* FREEZE CLICK */

    freezeButton.addEventListener("click", () => {
      changeSeatBookingType(selectedSeat.seatId, "FROZEN");
    });

    typeButtons.appendChild(confirmButton);

    typeButtons.appendChild(freezeButton);

    seatItem.appendChild(seatName);

    seatItem.appendChild(typeButtons);

    container.appendChild(seatItem);
  });
}

/* =========================================
   CHANGE BOOKING TYPE
========================================= */

function changeSeatBookingType(seatId, bookingType) {
  const selectedSeat = selectedSeats.find((seat) => seat.seatId === seatId);

  if (!selectedSeat) {
    return;
  }

  selectedSeat.bookingType = bookingType;

  const seatElement = document.querySelector(`.seat[data-seat="${seatId}"]`);

  if (seatElement) {
    /* REMOVE OLD STATES */

    seatElement.classList.remove("selected");
    seatElement.classList.remove("frozen");

    /* ADD NEW STATE */

    if (bookingType === "CONFIRMED") {
      seatElement.classList.add("selected");
    }

    if (bookingType === "FROZEN") {
      seatElement.classList.add("frozen");
    }
  }

  /* RE-RENDER TYPE BUTTONS */

  renderSeatTypeSelection();

  /* UPDATE PRICE SUMMARY */

  updateSummary();
}

/* =========================================
   UPDATE SUMMARY
========================================= */

function updateSummary() {
  const selectedSeatsElement = document.getElementById("selectedSeats");

  const confirmedSeatsCountElement = document.getElementById(
    "confirmedSeatsCount",
  );

  const frozenSeatsCountElement = document.getElementById("frozenSeatsCount");

  const ticketCountElement = document.getElementById("ticketCount");

  const confirmedAmountElement = document.getElementById("confirmedAmount");

  const freezeAmountElement = document.getElementById("freezeAmount");

  const payNowAmountElement = document.getElementById("payNowAmount");

  const remainingAmountElement = document.getElementById("remainingAmount");

  const continueButton = document.getElementById("continueButton");

  /* =========================================
     SELECTED SEATS
  ========================================= */

  if (selectedSeats.length === 0) {
    selectedSeatsElement.textContent = "None";
  } else {
    selectedSeatsElement.textContent = selectedSeats
      .map((seat) => seat.seatId)
      .join(", ");
  }

  /* =========================================
     CONFIRMED / FROZEN SEATS
  ========================================= */

  const confirmedSeats = selectedSeats.filter(
    (seat) => seat.bookingType === "CONFIRMED",
  );

  const frozenSeats = selectedSeats.filter(
    (seat) => seat.bookingType === "FROZEN",
  );

  /* =========================================
     COUNTS
  ========================================= */

  confirmedSeatsCountElement.textContent = confirmedSeats.length;

  frozenSeatsCountElement.textContent = frozenSeats.length;

  ticketCountElement.textContent = selectedSeats.length;

  /* =========================================
     CALCULATIONS
  ========================================= */

  /*
      Confirmed seats:
      Pay 100%
  */

  const confirmedAmount = confirmedSeats.length * ticketPrice;

  /*
      Frozen seats:
      Pay 50% now
  */

  const freezeAmount = frozenSeats.length * ticketPrice * 0.5;

  /*
      Total payment now
  */

  const payNowAmount = confirmedAmount + freezeAmount;

  /*
      Remaining payment
      for frozen seats
  */

  const remainingAmount = frozenSeats.length * ticketPrice * 0.5;

  /* =========================================
     DISPLAY AMOUNTS
  ========================================= */

  confirmedAmountElement.textContent = `₹${confirmedAmount}`;

  freezeAmountElement.textContent = `₹${freezeAmount}`;

  payNowAmountElement.textContent = `₹${payNowAmount}`;

  remainingAmountElement.textContent = `₹${remainingAmount}`;

  /* =========================================
     BUTTON
  ========================================= */

  continueButton.disabled = selectedSeats.length === 0;
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
      Match time:

      7:30 PM
      10:00 AM
      6:45 PM
  */

  const timeMatch = bookingData.showTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);

  if (!timeMatch) {
    console.error("Invalid show time:", bookingData.showTime);

    return null;
  }

  let hours = Number(timeMatch[1]);

  const minutes = Number(timeMatch[2]);

  const period = timeMatch[3].toUpperCase();

  /* PM */

  if (period === "PM" && hours !== 12) {
    hours += 12;
  }

  /* 12 AM */

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
   CONTINUE TO PAYMENT
========================================= */

function continueToPayment() {
  if (selectedSeats.length === 0) {
    return;
  }

  /* =========================================
     GET SEATS BY TYPE
  ========================================= */

  const confirmedSeats = selectedSeats
    .filter((seat) => seat.bookingType === "CONFIRMED")
    .map((seat) => seat.seatId);

  const frozenSeats = selectedSeats
    .filter((seat) => seat.bookingType === "FROZEN")
    .map((seat) => seat.seatId);

  /* =========================================
     CALCULATE AMOUNTS
  ========================================= */

  const confirmedAmount = confirmedSeats.length * ticketPrice;

  /*
      Frozen seats:
      50% payment now
  */

  const frozenAdvanceAmount = frozenSeats.length * ticketPrice * 0.5;

  /*
      Remaining 50%
  */

  const frozenRemainingAmount = frozenSeats.length * ticketPrice * 0.5;

  /*
      Total payment now
  */

  const payableNow = confirmedAmount + frozenAdvanceAmount;

  /* =========================================
     DEADLINE
  ========================================= */

  let confirmationDeadline = null;

  let showDateTime = null;

  /*
      Only calculate deadline
      if there are frozen seats
  */

  if (frozenSeats.length > 0) {
    showDateTime = getShowDateTime();

    if (!showDateTime) {
      alert("Unable to determine movie show time.");

      return;
    }

    /*
        Deadline:
        2 hours before movie
    */

    confirmationDeadline = showDateTime.getTime() - 2 * 60 * 60 * 1000;

    /*
        Do not allow freezing
        if deadline has passed
    */

    if (Date.now() >= confirmationDeadline) {
      alert(
        "Seat freezing is no longer available because the movie starts within 2 hours.",
      );

      return;
    }
  }

  /* =========================================
     CREATE FINAL BOOKING
  ========================================= */

  const finalBooking = {
    ...bookingData,

    /* ALL SEATS */

    seats: selectedSeats.map((seat) => seat.seatId),

    numberOfTickets: selectedSeats.length,

    /* CONFIRMED */

    confirmedSeats: confirmedSeats,

    confirmedAmount: confirmedAmount,

    /* FROZEN */

    frozenSeats: frozenSeats,

    frozenAdvanceAmount: frozenAdvanceAmount,

    frozenRemainingAmount: frozenRemainingAmount,

    /*
        Status for
        frozen seats
    */

    frozenStatus: frozenSeats.length > 0 ? "ACTIVE" : "NONE",

    /* =========================================
       PAYMENT
    ========================================= */

    totalAmount: selectedSeats.length * ticketPrice,

    payableNow: payableNow,

    paymentStatus: "PENDING",

    /* =========================================
       FREEZE DEADLINE
    ========================================= */

    frozenAt: frozenSeats.length > 0 ? Date.now() : null,

    confirmationDeadline: confirmationDeadline,

    showDateTime: showDateTime ? showDateTime.getTime() : null,

    /* =========================================
       BOOKING STATUS
    ========================================= */

    bookingStatus: frozenSeats.length > 0 ? "PARTIALLY_FROZEN" : "CONFIRMED",

    /* =========================================
       BOOKING ID
    ========================================= */

    bookingId: generateBookingId(),

    paymentMethod: "UPI",
  };

  /* =========================================
     SAVE BOOKING
  ========================================= */

  sessionStorage.setItem("bookItBroFinalBooking", JSON.stringify(finalBooking));

  console.log("Final booking:", finalBooking);

  /* =========================================
     GO TO PAYMENT / SUMMARY
  ========================================= */

  window.location.href = "booking-summary.html";
}

/* =========================================
   GENERATE BOOKING ID
========================================= */

function generateBookingId() {
  const random = Math.floor(100000 + Math.random() * 900000);

  return `BIB${random}`;
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
   BACK
========================================= */

function goBack() {
  window.history.back();
}

/* =========================================
   ERROR
========================================= */

function showError() {
  document.body.innerHTML = `

    <div style="
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      font-family: Arial;
      background: #f5f5f5;
      padding: 20px;
    ">

      <div>

        <h2>
          Booking information not found
        </h2>


        <p style="
          color: #777;
          margin: 10px 0 20px;
        ">

          Please select a movie and showtime again.

        </p>


        <button
          onclick="history.back()"
          style="
            padding: 12px 25px;
            border: 0;
            border-radius: 5px;
            background: #e51937;
            color: #fff;
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
  const valid = loadBookingData();

  if (!valid) {
    return;
  }

  displayBookingInformation();

  generateSeats();

  renderSeatTypeSelection();

  updateSummary();

  /* CONTINUE */

  document
    .getElementById("continueButton")
    .addEventListener("click", continueToPayment);

  /* BACK */

  document.getElementById("backButton").addEventListener("click", goBack);
}

/* =========================================
   START
========================================= */

initialize();
