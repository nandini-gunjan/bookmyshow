/* =========================================
   BOOKITBRO
   BOOKING SUMMARY
========================================= */

/* =========================================
   STATE
========================================= */

function initialize() {
  const loaded = loadFinalBooking();

  if (!loaded) {
    return;
  }

  displayFrozenBooking();

  checkBookingExpiry();

  startConfirmationCountdown();

  const confirmButton =
    document.getElementById("confirmTicketButton");

  if (confirmButton) {
    confirmButton.addEventListener(
      "click",
      confirmTicket
    );
  }
}

initialize();
let finalBooking = null;

function loadFinalBooking() {
  const storedBooking = sessionStorage.getItem(
    "bookItBroFinalBooking"
  );

  if (!storedBooking) {
    alert("Booking information not found.");

    window.location.href = "seat-selection.html";

    return false;
  }

  try {
    finalBooking = JSON.parse(storedBooking);

    return true;
  } catch (error) {
    console.error("Booking data error:", error);

    return false;
  }
}

function displayFrozenBooking() {
  if (!finalBooking) {
    return;
  }

  document.getElementById("bookingStatus").textContent =
    finalBooking.bookingStatus || "FROZEN";

  const deadline = new Date(
    finalBooking.confirmationDeadline
  );

  document.getElementById("confirmationDeadline").textContent =
    deadline.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    });

  document.getElementById("advanceAmount").textContent =
    `₹${Number(finalBooking.advanceAmount || 0).toFixed(2)}`;

  document.getElementById("remainingAmount").textContent =
    `₹${Number(finalBooking.remainingAmount || 0).toFixed(2)}`;
}

function checkBookingExpiry() {
  if (!finalBooking) {
    return;
  }

  /*
      Don't cancel confirmed bookings
  */

  if (finalBooking.bookingStatus === "CONFIRMED") {
    return;
  }

  /*
      Don't process already cancelled bookings
  */

  if (finalBooking.bookingStatus === "CANCELLED") {
    return;
  }

  /*
      Check if 2-hour deadline has passed
  */

  if (
    Date.now() >=
    Number(finalBooking.confirmationDeadline)
  ) {
    finalBooking.bookingStatus = "CANCELLED";

    finalBooking.paymentStatus = "ADVANCE_FORFEITED";

    finalBooking.cancelledAt = Date.now();

    /*
        Save updated booking
    */

    sessionStorage.setItem(
      "bookItBroFinalBooking",
      JSON.stringify(finalBooking)
    );

    alert(
      "Your booking has been automatically cancelled because you did not confirm it before the deadline."
    );

    window.location.href = "index.html";
  }
}

function startConfirmationCountdown() {
  const countdownElement = document.getElementById(
    "confirmationCountdown"
  );

  if (!countdownElement || !finalBooking) {
    return;
  }

  function updateCountdown() {
    const remainingTime =
      Number(finalBooking.confirmationDeadline) -
      Date.now();

    /*
        Time expired
    */

    if (remainingTime <= 0) {
      countdownElement.textContent = "Booking Expired";

      checkBookingExpiry();

      return;
    }

    /*
        Convert milliseconds
    */

    const totalSeconds =
      Math.floor(remainingTime / 1000);

    const hours =
      Math.floor(totalSeconds / 3600);

    const minutes =
      Math.floor(
        (totalSeconds % 3600) / 60
      );

    const seconds =
      totalSeconds % 60;

    /*
        Display countdown
    */

    countdownElement.textContent =
      `${hours}h ${minutes}m ${seconds}s`;
  }

  /*
      Update immediately
  */

  updateCountdown();

  /*
      Update every second
  */

  setInterval(updateCountdown, 1000);
}

let booking = null;

/*
    Convenience fee percentage.

    We can change this later.
*/

const CONVENIENCE_FEE = 30;

/*
    GST percentage.

    Currently 18%.
*/

const GST_RATE = 0.18;
function confirmTicket() {
  if (!finalBooking) {
    return;
  }

  /*
      Check deadline one final time
  */

  if (
    Date.now() >=
    Number(finalBooking.confirmationDeadline)
  ) {
    finalBooking.bookingStatus = "CANCELLED";

    finalBooking.paymentStatus = "ADVANCE_FORFEITED";

    sessionStorage.setItem(
      "bookItBroFinalBooking",
      JSON.stringify(finalBooking)
    );

    alert(
      "The confirmation deadline has passed. Your booking has been cancelled."
    );

    window.location.href = "index.html";

    return;
  }

  /*
      Confirm booking
  */

  finalBooking.bookingStatus = "CONFIRMED";

  finalBooking.confirmedAt = Date.now();

  /*
      For demo purposes, mark as fully paid
  */

  finalBooking.paymentStatus = "FULLY_PAID";

  finalBooking.remainingAmount = 0;

  finalBooking.paidAmount =
    finalBooking.totalAmount;

  /*
      Save confirmed booking
  */

  sessionStorage.setItem(
    "bookItBroFinalBooking",
    JSON.stringify(finalBooking)
  );

  /*
      Confirmation page currently reads
      bookItBroConfirmation, so create that too
  */

  sessionStorage.setItem(
    "bookItBroConfirmation",
    JSON.stringify(finalBooking)
  );

  /*
      Go to confirmation page
  */

  window.location.href = "confirmation.html";
}

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

    console.log("Booking Summary Data:", booking);

    return true;
  } catch (error) {
    console.error("Unable to read booking:", error);

    showBookingError();

    return false;
  }
}

/* =========================================
   DISPLAY MOVIE
========================================= */

function displayMovie() {
  const poster = document.getElementById("moviePoster");

  const title = document.getElementById("movieTitle");

  const meta = document.getElementById("movieMeta");

  title.textContent = booking.movieTitle || "Movie";

  /*
        Your seat page stores movieTitle.

        If poster is also available,
        use it.
    */

  if (booking.moviePoster) {
    poster.src = booking.moviePoster;
  } else if (booking.poster) {
    poster.src = booking.poster;
  } else {
    poster.style.display = "none";
  }

  const language = booking.language || "Movie";

  const certificate = booking.certificate || "UA";

  meta.textContent = `${language} • ${certificate}`;
}

/* =========================================
   DISPLAY SHOW
========================================= */

function displayShowDetails() {
  document.getElementById("theatreName").textContent =
    booking.theatreName || "Theatre";

  document.getElementById("showDate").textContent = formatDate(booking.date);

  document.getElementById("showTime").textContent = booking.showTime || "—";

  document.getElementById("screenName").textContent =
    booking.screen || "Screen 1";
}

/* =========================================
   DISPLAY SEATS
========================================= */

function displaySeats() {
  const seats = Array.isArray(booking.seats) ? booking.seats : [];

  document.getElementById("selectedSeats").textContent = seats.length
    ? seats.join(", ")
    : "No seats selected";
}

/* =========================================
   CALCULATE PRICE
========================================= */

function calculatePrice() {
  const seats = Array.isArray(booking.seats) ? booking.seats : [];

  const ticketCount = seats.length || Number(booking.numberOfTickets) || 0;

  const ticketPrice = Number(booking.ticketPrice) || 0;

  const baseAmount = ticketCount * ticketPrice;

  /*
        Convenience fee.
    */

  const convenienceFee = ticketCount > 0 ? CONVENIENCE_FEE : 0;

  /*
        GST is calculated on
        ticket + convenience fee.
    */

  const taxableAmount = baseAmount + convenienceFee;

  const gst = taxableAmount * GST_RATE;

  const total = baseAmount + convenienceFee + gst;

  return {
    ticketCount,

    ticketPrice,

    baseAmount,

    convenienceFee,

    gst,

    total,
  };
}

/* =========================================
   DISPLAY PRICE
========================================= */

function displayPrice() {
  const price = calculatePrice();

  document.getElementById("ticketPrice").textContent =
    `₹${price.baseAmount.toFixed(2)}`;

  document.getElementById("ticketCount").textContent = price.ticketCount;

  document.getElementById("convenienceFee").textContent =
    `₹${price.convenienceFee.toFixed(2)}`;

  document.getElementById("gst").textContent = `₹${price.gst.toFixed(2)}`;

  document.getElementById("totalAmount").textContent =
    `₹${price.total.toFixed(2)}`;

  document.getElementById("bottomTotal").textContent =
    `₹${price.total.toFixed(2)}`;
}

/* =========================================
   TERMS CHECKBOX
========================================= */

function setupTerms() {
  const checkbox = document.getElementById("termsCheckbox");

  const paymentButton = document.getElementById("proceedPaymentButton");

  checkbox.addEventListener("change", () => {
    paymentButton.disabled = !checkbox.checked;
  });
}

/* =========================================
   PROCEED TO PAYMENT
========================================= */

function proceedToPayment() {
  const price = calculatePrice();

  /*
        Store final calculated
        amount for payment page.
    */

  const paymentData = {
    ...booking,

    ticketCount: price.ticketCount,

    baseAmount: price.baseAmount,

    convenienceFee: price.convenienceFee,

    gst: Number(price.gst.toFixed(2)),

    totalAmount: Number(price.total.toFixed(2)),
  };

  sessionStorage.setItem("bookItBroPayment", JSON.stringify(paymentData));

  console.log("Payment Data:", paymentData);

  /*
        Next page we will create:

        payment.html
    */

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

  displayMovie();

  displayShowDetails();

  displaySeats();

  displayPrice();

  setupTerms();

  document.getElementById("backButton").addEventListener("click", goBack);

  document
    .getElementById("changeSeatsButton")
    .addEventListener("click", changeSeats);

  document
    .getElementById("proceedPaymentButton")
    .addEventListener("click", proceedToPayment);
}

initialize();
