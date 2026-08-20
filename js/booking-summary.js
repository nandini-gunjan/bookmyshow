/* =========================================
   BOOKITBRO
   BOOKING SUMMARY
========================================= */

/* =========================================
   STATE
========================================= */

let booking = null;

const CONVENIENCE_FEE = 30;
const GST_RATE = 0.18;

/* =========================================
   LOAD BOOKING
========================================= */

function loadBooking() {
  const storedBooking = sessionStorage.getItem("bookItBroFinalBooking");

  if (!storedBooking) {
    showBookingError();

    return false;
  }

  try {
    booking = JSON.parse(storedBooking);

    if (!booking || typeof booking !== "object") {
      throw new Error("Invalid booking data");
    }

    return true;
  } catch (error) {
    console.error("Unable to read booking:", error);

    showBookingError();

    return false;
  }
}

/* =========================================
   GET CONFIRMED SEATS
========================================= */

function getConfirmedSeats() {
  return Array.isArray(booking.confirmedSeats) ? booking.confirmedSeats : [];
}

/* =========================================
   GET FROZEN SEATS
========================================= */

function getFrozenSeats() {
  return Array.isArray(booking.frozenSeats) ? booking.frozenSeats : [];
}

/* =========================================
   GET ALL ACTIVE SEATS
========================================= */

function getAllSeats() {
  return [...getConfirmedSeats(), ...getFrozenSeats()];
}

/* =========================================
   DISPLAY MOVIE
========================================= */

function displayMovie() {
  const poster = document.getElementById("moviePoster");
  const title = document.getElementById("movieTitle");
  const meta = document.getElementById("movieMeta");

  if (title) {
    title.textContent = booking.movieTitle || "Movie";
  }

  if (poster) {
    const posterUrl = booking.moviePoster || booking.poster || "";

    if (posterUrl) {
      poster.src = posterUrl;

      poster.onerror = () => {
        poster.style.display = "none";
      };
    } else {
      poster.style.display = "none";
    }
  }

  if (meta) {
    const language = booking.language || "Movie";

    const certificate = booking.certificate || "UA";

    meta.textContent = `${language} • ${certificate}`;
  }
}

/* =========================================
   DISPLAY SHOW DETAILS
========================================= */

function displayShowDetails() {
  const theatre = document.getElementById("theatreName");

  const date = document.getElementById("showDate");

  const time = document.getElementById("showTime");

  const screen = document.getElementById("screenName");

  if (theatre) {
    theatre.textContent = booking.theatreName || "Theatre";
  }

  if (date) {
    date.textContent = formatDate(booking.date);
  }

  if (time) {
    time.textContent = booking.showTime || "—";
  }

  if (screen) {
    screen.textContent = booking.screen || "Screen 1";
  }
}

/* =========================================
   DISPLAY SEATS
========================================= */

function displaySeats() {
  const confirmedSeats = getConfirmedSeats();

  const frozenSeats = getFrozenSeats();

  const confirmedElement = document.getElementById("confirmedSeats");

  const frozenElement = document.getElementById("frozenSeats");

  if (confirmedElement) {
    confirmedElement.textContent =
      confirmedSeats.length > 0 ? confirmedSeats.join(", ") : "None";
  }

  if (frozenElement) {
    frozenElement.textContent =
      frozenSeats.length > 0 ? frozenSeats.join(", ") : "None";
  }
}

/* =========================================
   DISPLAY FREEZE INFORMATION
========================================= */

function displayFreezeInformation() {
  const frozenSeats = getFrozenSeats();

  const freezeSection = document.getElementById("freezeInfoSection");

  if (!freezeSection) {
    return;
  }

  /* NO FROZEN SEATS */

  if (frozenSeats.length === 0) {
    freezeSection.style.display = "none";

    return;
  }

  freezeSection.style.display = "block";

  /* STATUS */

  const bookingStatus = document.getElementById("bookingStatus");

  if (bookingStatus) {
    bookingStatus.textContent = "FROZEN • PAYMENT PENDING";
  }

  /* DEADLINE */

  const deadlineElement = document.getElementById("confirmationDeadline");

  if (deadlineElement) {
    if (booking.confirmationDeadline) {
      const deadline = new Date(Number(booking.confirmationDeadline));

      if (!Number.isNaN(deadline.getTime())) {
        deadlineElement.textContent = deadline.toLocaleString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        });
      } else {
        deadlineElement.textContent = "—";
      }
    } else {
      deadlineElement.textContent = "—";
    }
  }

  /* REMAINING AMOUNT */

  const remainingAmount =
    getFrozenSeats().length * (Number(booking.ticketPrice) || 0) * 0.5;

  const remainingElement = document.getElementById("remainingAmount");

  if (remainingElement) {
    remainingElement.textContent = formatCurrency(remainingAmount);
  }
}

/* =========================================
   CHECK FROZEN SEAT EXPIRY
========================================= */

function checkBookingExpiry() {
  const frozenSeats = getFrozenSeats();

  if (frozenSeats.length === 0) {
    return false;
  }

  if (!booking.confirmationDeadline) {
    return false;
  }

  const deadline = Number(booking.confirmationDeadline);

  if (Date.now() < deadline) {
    return false;
  }

  /*
      Save cancelled frozen seats
  */

  booking.cancelledFrozenSeats = [...frozenSeats];

  /*
      Remove frozen seats
  */

  booking.frozenSeats = [];

  /*
      Keep confirmed seats
  */

  booking.seats = [...getConfirmedSeats()];

  booking.numberOfTickets = getConfirmedSeats().length;

  /*
      Update status
  */

  booking.bookingStatus =
    getConfirmedSeats().length > 0 ? "PARTIALLY_CANCELLED" : "CANCELLED";

  booking.frozenStatus = "EXPIRED";

  booking.paymentStatus = "FROZEN_ADVANCE_FORFEITED";

  booking.frozenSeatsCancelledAt = Date.now();

  /*
      No more remaining payment
  */

  booking.frozenRemainingAmount = 0;

  booking.remainingAmount = 0;

  /*
      Save
  */

  sessionStorage.setItem("bookItBroFinalBooking", JSON.stringify(booking));

  alert(
    "Your frozen seats have been cancelled because the payment deadline has passed. The advance payment is not refundable.",
  );

  return true;
}

/* =========================================
   START COUNTDOWN
========================================= */

function startConfirmationCountdown() {
  const frozenSeats = getFrozenSeats();

  const countdownElement = document.getElementById("confirmationCountdown");

  if (
    frozenSeats.length === 0 ||
    !countdownElement ||
    !booking.confirmationDeadline
  ) {
    return;
  }

  function updateCountdown() {
    const remainingTime = Number(booking.confirmationDeadline) - Date.now();

    /* EXPIRED */

    if (remainingTime <= 0) {
      countdownElement.textContent = "Booking Expired";

      const expired = checkBookingExpiry();

      if (expired) {
        window.location.reload();
      }

      return;
    }

    /* CALCULATE TIME */

    const totalSeconds = Math.floor(remainingTime / 1000);

    const hours = Math.floor(totalSeconds / 3600);

    const minutes = Math.floor((totalSeconds % 3600) / 60);

    const seconds = totalSeconds % 60;

    countdownElement.textContent = `${hours}h ${minutes}m ${seconds}s`;
  }

  updateCountdown();

  setInterval(updateCountdown, 1000);
}

/* =========================================
   CALCULATE PAYMENT
========================================= */

function calculatePrice() {
  const confirmedSeats = getConfirmedSeats();

  const frozenSeats = getFrozenSeats();

  const confirmedCount = confirmedSeats.length;

  const frozenCount = frozenSeats.length;

  const ticketCount = confirmedCount + frozenCount;

  const ticketPrice = Number(booking.ticketPrice) || 0;

  /* CONFIRMED SEATS
     100% PAYMENT NOW */

  const confirmedAmount = confirmedCount * ticketPrice;

  /* FROZEN SEATS
     FULL VALUE */

  const frozenFullAmount = frozenCount * ticketPrice;

  /* PAY 50% NOW */

  const frozenAdvanceAmount = frozenFullAmount * 0.5;

  /* PAY 50% LATER */

  const frozenRemainingAmount = frozenFullAmount * 0.5;

  /* TICKET PAYMENT NOW */

  const ticketAmountPayNow = confirmedAmount + frozenAdvanceAmount;

  /*
      Convenience fee

      Applied once per booking
  */

  const convenienceFee = ticketCount > 0 ? CONVENIENCE_FEE : 0;

  /*
      GST only on the
      amount payable now
  */

  const taxableAmount = ticketAmountPayNow + convenienceFee;

  const gst = taxableAmount * GST_RATE;

  /*
      FINAL PAYMENT NOW
  */

  const payableNow = ticketAmountPayNow + convenienceFee + gst;

  /*
      Full ticket value

      Excluding fees and GST.
  */

  const fullBookingValue = confirmedAmount + frozenFullAmount;

  return {
    confirmedCount,
    frozenCount,
    ticketCount,

    ticketPrice,

    confirmedAmount,

    frozenFullAmount,

    frozenAdvanceAmount,

    frozenRemainingAmount,

    ticketAmountPayNow,

    convenienceFee,

    gst,

    payableNow,

    fullBookingValue,
  };
}

/* =========================================
   DISPLAY PRICE
========================================= */

function displayPrice() {
  const price = calculatePrice();

  /* TICKET PRICE */

  const ticketPriceElement = document.getElementById("ticketPrice");

  if (ticketPriceElement) {
    ticketPriceElement.textContent = formatCurrency(price.ticketPrice);
  }

  /* CONFIRMED COUNT */

  const confirmedSeatCount = document.getElementById("confirmedSeatCount");

  if (confirmedSeatCount) {
    confirmedSeatCount.textContent = `${price.confirmedCount} seat${
      price.confirmedCount === 1 ? "" : "s"
    } × full price`;
  }

  /* FROZEN COUNT */

  const frozenSeatCount = document.getElementById("frozenSeatCount");

  if (frozenSeatCount) {
    frozenSeatCount.textContent = `${price.frozenCount} seat${
      price.frozenCount === 1 ? "" : "s"
    } × 50% advance`;
  }

  /* CONFIRMED AMOUNT */

  const confirmedAmount = document.getElementById("confirmedAmount");

  if (confirmedAmount) {
    confirmedAmount.textContent = formatCurrency(price.confirmedAmount);
  }

  /* FROZEN ADVANCE */

  const frozenAdvance = document.getElementById("frozenAdvanceAmount");

  if (frozenAdvance) {
    frozenAdvance.textContent = formatCurrency(price.frozenAdvanceAmount);
  }

  /* TICKET AMOUNT PAY NOW */

  const ticketPayNow = document.getElementById("ticketAmountPayNow");

  if (ticketPayNow) {
    ticketPayNow.textContent = formatCurrency(price.ticketAmountPayNow);
  }

  /* CONVENIENCE */

  const convenienceFee = document.getElementById("convenienceFee");

  if (convenienceFee) {
    convenienceFee.textContent = formatCurrency(price.convenienceFee);
  }

  /* GST */

  const gst = document.getElementById("gst");

  if (gst) {
    gst.textContent = formatCurrency(price.gst);
  }

  /* PAYABLE NOW */

  const totalAmount = document.getElementById("totalAmount");

  if (totalAmount) {
    totalAmount.textContent = formatCurrency(price.payableNow);
  }

  const bottomTotal = document.getElementById("bottomTotal");

  if (bottomTotal) {
    bottomTotal.textContent = formatCurrency(price.payableNow);
  }

  /*
      REMAINING PAYMENT
  */

  const remainingSummary = document.getElementById("remainingPaymentSummary");

  const priceRemainingAmount = document.getElementById("priceRemainingAmount");

  if (price.frozenCount === 0) {
    if (remainingSummary) {
      remainingSummary.style.display = "none";
    }
  } else {
    if (remainingSummary) {
      remainingSummary.style.display = "flex";
    }

    if (priceRemainingAmount) {
      priceRemainingAmount.textContent = formatCurrency(
        price.frozenRemainingAmount,
      );
    }
  }

  /*
      Hide rows that have
      no seats of that type
  */

  const confirmedRow = document.getElementById("confirmedPaymentRow");

  if (confirmedRow) {
    confirmedRow.style.display = price.confirmedCount > 0 ? "flex" : "none";
  }

  const frozenRow = document.getElementById("frozenPaymentRow");

  if (frozenRow) {
    frozenRow.style.display = price.frozenCount > 0 ? "flex" : "none";
  }
}

/* =========================================
   TERMS CHECKBOX
========================================= */

function setupTerms() {
  const checkbox = document.getElementById("termsCheckbox");

  const paymentButton = document.getElementById("proceedPaymentButton");

  if (!checkbox || !paymentButton) {
    return;
  }

  paymentButton.disabled = !checkbox.checked;

  checkbox.addEventListener("change", () => {
    paymentButton.disabled = !checkbox.checked;
  });
}

/* =========================================
   PROCEED TO PAYMENT
========================================= */

function proceedToPayment() {
  const expired = checkBookingExpiry();

  if (expired) {
    window.location.reload();

    return;
  }

  const price = calculatePrice();

  /*
      PAYMENT DATA
  */

  const paymentData = {
    ...booking,

    /* SEATS */

    seats: getAllSeats(),

    confirmedSeats: getConfirmedSeats(),

    frozenSeats: getFrozenSeats(),

    confirmedSeatCount: price.confirmedCount,

    frozenSeatCount: price.frozenCount,

    ticketCount: price.ticketCount,

    numberOfTickets: price.ticketCount,

    /* PRICE */

    ticketPrice: price.ticketPrice,

    confirmedAmount: Number(price.confirmedAmount.toFixed(2)),

    frozenFullAmount: Number(price.frozenFullAmount.toFixed(2)),

    frozenAdvanceAmount: Number(price.frozenAdvanceAmount.toFixed(2)),

    frozenRemainingAmount: Number(price.frozenRemainingAmount.toFixed(2)),

    remainingAmount: Number(price.frozenRemainingAmount.toFixed(2)),

    /* PAYMENT NOW */

    ticketAmountPayNow: Number(price.ticketAmountPayNow.toFixed(2)),

    convenienceFee: Number(price.convenienceFee.toFixed(2)),

    gst: Number(price.gst.toFixed(2)),

    payableNow: Number(price.payableNow.toFixed(2)),

    totalAmount: Number(price.payableNow.toFixed(2)),

    /* TOTAL BOOKING VALUE */

    fullBookingValue: Number(price.fullBookingValue.toFixed(2)),

    /* STATUS */

    paymentStatus: "PENDING",
  };

  sessionStorage.setItem("bookItBroPayment", JSON.stringify(paymentData));

  console.log("Payment Data:", paymentData);

  window.location.href = "payment.html";
}

/* =========================================
   CHANGE SEATS
========================================= */

function changeSeats() {
  window.history.back();
}

/* =========================================
   BACK
========================================= */

function goBack() {
  window.history.back();
}

/* =========================================
   FORMAT CURRENCY
========================================= */

function formatCurrency(amount) {
  const value = Number(amount) || 0;

  return `₹${value.toFixed(2)}`;
}

/* =========================================
   FORMAT DATE
========================================= */

function formatDate(dateString) {
  if (!dateString) {
    return "—";
  }

  /*
      Prevent timezone shift
      for YYYY-MM-DD
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
   ERROR PAGE
========================================= */

function showBookingError() {
  document.body.innerHTML = `
    <div style="
      min-height:100vh;
      display:flex;
      align-items:center;
      justify-content:center;
      padding:20px;
      background:#f5f5f5;
      font-family:Arial,sans-serif;
      text-align:center;
    ">

      <div>

        <h2>
          Booking information not found
        </h2>

        <p style="
          color:#777;
          margin:12px 0 20px;
        ">
          Please select your movie,
          theatre and seats again.
        </p>

        <button
          onclick="history.back()"
          style="
            border:none;
            padding:12px 25px;
            border-radius:5px;
            background:#e51937;
            color:white;
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
  const loaded = loadBooking();

  if (!loaded) {
    return;
  }

  const expired = checkBookingExpiry();

  if (expired) {
    window.location.reload();

    return;
  }

  displayMovie();

  displayShowDetails();

  displaySeats();

  displayFreezeInformation();

  displayPrice();

  startConfirmationCountdown();

  setupTerms();

  /* BACK */

  const backButton = document.getElementById("backButton");

  if (backButton) {
    backButton.addEventListener("click", goBack);
  }

  /* CHANGE SEATS */

  const changeSeatsButton = document.getElementById("changeSeatsButton");

  if (changeSeatsButton) {
    changeSeatsButton.addEventListener("click", changeSeats);
  }

  /* PAYMENT */

  const paymentButton = document.getElementById("proceedPaymentButton");

  if (paymentButton) {
    paymentButton.addEventListener("click", proceedToPayment);
  }
}

/* =========================================
   START
========================================= */

initialize();
