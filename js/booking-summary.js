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

    /*
        Ensure food order always exists.

        pre-order-food.js saves food using:
        booking.foodOrder
    */

    if (!Array.isArray(booking.foodOrder)) {
      booking.foodOrder = [];
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
  if (Array.isArray(booking.confirmedSeats)) {
    return booking.confirmedSeats;
  }

  return [];
}

/* =========================================
   GET FROZEN SEATS
========================================= */

function getFrozenSeats() {
  if (Array.isArray(booking.frozenSeats)) {
    return booking.frozenSeats;
  }

  return [];
}

/* =========================================
   GET ALL ACTIVE SEATS
========================================= */

function getAllSeats() {
  return [...getConfirmedSeats(), ...getFrozenSeats()];
}

/* =========================================
   GET FOOD ITEMS
========================================= */

function getFoodItems() {
  if (!Array.isArray(booking.foodOrder)) {
    return [];
  }

  return booking.foodOrder.filter((item) => {
    return Number(item.quantity) > 0;
  });
}

/* =========================================
   GET FOOD ITEM COUNT
========================================= */

function getFoodItemCount() {
  return getFoodItems().reduce((total, item) => {
    return total + (Number(item.quantity) || 0);
  }, 0);
}

/* =========================================
   CALCULATE FOOD TOTAL
========================================= */

function calculateFoodTotal() {
  return getFoodItems().reduce((total, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;

    return total + price * quantity;
  }, 0);
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
   DISPLAY FOOD ORDER
========================================= */
/* =========================================
   DISPLAY FOOD ORDER
========================================= */

function displayFoodOrder() {
  const foodOrderSection = document.getElementById("foodOrderSection");
  const foodOrderItems = document.getElementById("foodOrderItems");
  const foodOrderTotal = document.getElementById("foodOrderTotal");
  const foodOrderSubtitle = document.getElementById("foodOrderSubtitle");
  const noFoodMessage = document.getElementById("noFoodMessage");
  const foodTotalRow = document.getElementById("foodTotalRow");

  const foodItems = getFoodItems();

  /* =========================================
     NO FOOD ORDER
  ========================================= */

  if (foodItems.length === 0) {
    if (foodOrderSection) {
      foodOrderSection.style.display = "none";
    }

    if (noFoodMessage) {
      noFoodMessage.style.display = "flex";
    }

    if (foodTotalRow) {
      foodTotalRow.style.display = "none";
    }

    if (foodOrderSubtitle) {
      foodOrderSubtitle.textContent = "You have not pre-ordered any food.";
    }

    return;
  }

  /* =========================================
     FOOD EXISTS
  ========================================= */

  if (foodOrderSection) {
    foodOrderSection.style.display = "block";
  }

  if (noFoodMessage) {
    noFoodMessage.style.display = "none";
  }

  if (foodTotalRow) {
    foodTotalRow.style.display = "flex";
  }

  const totalItemCount = getFoodItemCount();

  if (foodOrderSubtitle) {
    foodOrderSubtitle.textContent = `${totalItemCount} item${
      totalItemCount === 1 ? "" : "s"
    } pre-ordered.`;
  }

  /* =========================================
     DISPLAY FOOD ITEMS
  ========================================= */

  if (!foodOrderItems) {
    return;
  }

  foodOrderItems.innerHTML = "";

  let total = 0;

  foodItems.forEach((item) => {
    const name = item.name || "Food Item";
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;
    const image = item.image || "";

    const itemTotal = price * quantity;

    total += itemTotal;

    const itemElement = document.createElement("div");

    itemElement.className = "food-summary-item";

    itemElement.innerHTML = `
      <div class="food-summary-info">

        ${
          image
            ? `
              <img
                src="${image}"
                alt="${escapeHtml(name)}"
                class="food-summary-image"
                onerror="this.style.display='none'"
              >
            `
            : ""
        }

        <div class="food-summary-details">

          <strong>
            ${escapeHtml(name)}
          </strong>

          <small>
            ${quantity} × ${formatCurrency(price)}
          </small>

        </div>

      </div>

      <strong class="food-summary-price">
        ${formatCurrency(itemTotal)}
      </strong>
    `;

    foodOrderItems.appendChild(itemElement);
  });

  /* =========================================
     FOOD TOTAL
  ========================================= */

  if (foodOrderTotal) {
    foodOrderTotal.textContent = formatCurrency(total);
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

  /*
      NO FROZEN SEATS
  */

  if (frozenSeats.length === 0) {
    freezeSection.style.display = "none";

    return;
  }

  freezeSection.style.display = "block";

  /*
      BOOKING STATUS
  */

  const bookingStatus = document.getElementById("bookingStatus");

  if (bookingStatus) {
    bookingStatus.textContent = "FROZEN • PAYMENT PENDING";
  }

  /*
      DEADLINE
  */

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

  /*
      REMAINING AMOUNT
  */

  const remainingAmount =
    frozenSeats.length * (Number(booking.ticketPrice) || 0) * 0.5;

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
      Update booking status
  */

  booking.bookingStatus =
    getConfirmedSeats().length > 0 ? "PARTIALLY_CANCELLED" : "CANCELLED";

  booking.frozenStatus = "EXPIRED";

  booking.paymentStatus = "FROZEN_ADVANCE_FORFEITED";

  booking.frozenSeatsCancelledAt = Date.now();

  booking.frozenRemainingAmount = 0;
  booking.remainingAmount = 0;

  /*
      Save updated booking
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

    /*
        EXPIRED
    */

    if (remainingTime <= 0) {
      countdownElement.textContent = "Booking Expired";

      const expired = checkBookingExpiry();

      if (expired) {
        window.location.reload();
      }

      return;
    }

    /*
        CALCULATE TIME
    */

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

  /*
      CONFIRMED SEATS
      100% PAYMENT
  */

  const confirmedAmount = confirmedCount * ticketPrice;

  /*
      FROZEN SEATS
      50% PAYMENT NOW
  */

  const frozenFullAmount = frozenCount * ticketPrice;

  const frozenAdvanceAmount = frozenFullAmount * 0.5;

  const frozenRemainingAmount = frozenFullAmount * 0.5;

  /*
      TICKET AMOUNT PAYABLE NOW
  */

  const ticketAmountPayNow = confirmedAmount + frozenAdvanceAmount;

  /*
      FOOD
  */

  const foodItems = getFoodItems();

  const foodItemCount = getFoodItemCount();

  const foodAmount = calculateFoodTotal();

  /*
      SUBTOTAL
  */

  const subtotalPayNow = ticketAmountPayNow + foodAmount;

  /*
      CONVENIENCE FEE
  */

  const convenienceFee =
    ticketCount > 0 || foodAmount > 0 ? CONVENIENCE_FEE : 0;

  /*
      GST
  */

  const taxableAmount = subtotalPayNow + convenienceFee;

  const gst = taxableAmount * GST_RATE;

  /*
      FINAL PAYMENT NOW
  */

  const payableNow = subtotalPayNow + convenienceFee + gst;

  /*
      FULL BOOKING VALUE
  */

  const fullBookingValue = confirmedAmount + frozenFullAmount + foodAmount;

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

    foodItems,

    foodItemCount,

    foodAmount,

    foodTotal: foodAmount,

    subtotalPayNow,

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

  /*
      TICKET PRICE
  */

  const ticketPriceElement = document.getElementById("ticketPrice");

  if (ticketPriceElement) {
    ticketPriceElement.textContent = formatCurrency(price.ticketPrice);
  }

  /*
      CONFIRMED SEAT COUNT
  */

  const confirmedSeatCount = document.getElementById("confirmedSeatCount");

  if (confirmedSeatCount) {
    confirmedSeatCount.textContent = `${price.confirmedCount} seat${
      price.confirmedCount === 1 ? "" : "s"
    } × full price`;
  }

  /*
      FROZEN SEAT COUNT
  */

  const frozenSeatCount = document.getElementById("frozenSeatCount");

  if (frozenSeatCount) {
    frozenSeatCount.textContent = `${price.frozenCount} seat${
      price.frozenCount === 1 ? "" : "s"
    } × 50% advance`;
  }

  /*
      CONFIRMED AMOUNT
  */

  const confirmedAmount = document.getElementById("confirmedAmount");

  if (confirmedAmount) {
    confirmedAmount.textContent = formatCurrency(price.confirmedAmount);
  }

  /*
      FROZEN ADVANCE
  */

  const frozenAdvance = document.getElementById("frozenAdvanceAmount");

  if (frozenAdvance) {
    frozenAdvance.textContent = formatCurrency(price.frozenAdvanceAmount);
  }

  /*
      TICKET AMOUNT PAY NOW
  */

  const ticketPayNow = document.getElementById("ticketAmountPayNow");

  if (ticketPayNow) {
    ticketPayNow.textContent = formatCurrency(price.ticketAmountPayNow);
  }

  /*
      FOOD PAYMENT ROW
  */

  const foodPaymentRow = document.getElementById("foodPaymentRow");

  const foodAmount = document.getElementById("foodAmount");

  const foodItemCount = document.getElementById("foodItemCount");

  if (foodPaymentRow) {
    foodPaymentRow.style.display = price.foodItemCount > 0 ? "flex" : "none";
  }

  if (foodAmount) {
    foodAmount.textContent = formatCurrency(price.foodAmount);
  }

  if (foodItemCount) {
    foodItemCount.textContent = `${price.foodItemCount} item${
      price.foodItemCount === 1 ? "" : "s"
    }`;
  }

  /*
      CONVENIENCE FEE
  */

  const convenienceFee = document.getElementById("convenienceFee");

  if (convenienceFee) {
    convenienceFee.textContent = formatCurrency(price.convenienceFee);
  }

  /*
      GST
  */

  const gst = document.getElementById("gst");

  if (gst) {
    gst.textContent = formatCurrency(price.gst);
  }

  /*
      PAYABLE NOW
  */

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
      HIDE EMPTY SEAT ROWS
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

  const paymentData = {
    ...booking,

    /*
        SEATS
    */

    seats: getAllSeats(),

    confirmedSeats: getConfirmedSeats(),

    frozenSeats: getFrozenSeats(),

    confirmedSeatCount: price.confirmedCount,

    frozenSeatCount: price.frozenCount,

    ticketCount: price.ticketCount,

    numberOfTickets: price.ticketCount,

    /*
        TICKET DETAILS
    */

    ticketPrice: price.ticketPrice,

    confirmedAmount: Number(price.confirmedAmount.toFixed(2)),

    frozenFullAmount: Number(price.frozenFullAmount.toFixed(2)),

    frozenAdvanceAmount: Number(price.frozenAdvanceAmount.toFixed(2)),

    frozenRemainingAmount: Number(price.frozenRemainingAmount.toFixed(2)),

    remainingAmount: Number(price.frozenRemainingAmount.toFixed(2)),

    ticketAmountPayNow: Number(price.ticketAmountPayNow.toFixed(2)),

    /*
        FOOD
    */

    foodOrder: price.foodItems,

    foodItemCount: price.foodItemCount,

    foodAmount: Number(price.foodAmount.toFixed(2)),

    foodTotal: Number(price.foodAmount.toFixed(2)),

    /*
        BASE AMOUNT
    */

    baseAmount: Number(price.subtotalPayNow.toFixed(2)),

    /*
        FEES
    */

    convenienceFee: Number(price.convenienceFee.toFixed(2)),

    gst: Number(price.gst.toFixed(2)),

    /*
        FINAL PAYMENT
    */

    payableNow: Number(price.payableNow.toFixed(2)),

    totalAmount: Number(price.payableNow.toFixed(2)),

    /*
        FULL BOOKING VALUE
    */

    fullBookingValue: Number(price.fullBookingValue.toFixed(2)),

    /*
        STATUS
    */

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
  window.location.href = "seat-selection.html";
}

/* =========================================
   CHANGE FOOD
========================================= */

function changeFood() {
  window.location.href = "pre-order-food.html";
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
   ESCAPE HTML
========================================= */

function escapeHtml(value) {
  const div = document.createElement("div");

  div.textContent = value || "";

  return div.innerHTML;
}

/* =========================================
   ERROR PAGE
========================================= */

function showBookingError() {
  document.body.innerHTML = `

    <div style="
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: #f5f5f5;
      font-family: Arial, sans-serif;
      text-align: center;
    ">

      <div>

        <h2>
          Booking Information Not Found
        </h2>

        <p style="
          color: #777;
          margin: 12px 0 20px;
        ">
          Please select your movie,
          theatre and seats again.
        </p>

        <button
          onclick="history.back()"
          style="
            border: none;
            padding: 12px 25px;
            border-radius: 5px;
            background: #e51937;
            color: white;
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
  const loaded = loadBooking();

  if (!loaded) {
    return;
  }

  /*
      CHECK FROZEN SEAT EXPIRY
  */

  const expired = checkBookingExpiry();

  if (expired) {
    window.location.reload();
    return;
  }

  /*
      DISPLAY DATA
  */

  displayMovie();

  displayShowDetails();

  displaySeats();

  displayFoodOrder();

  displayFreezeInformation();

  displayPrice();

  /*
      COUNTDOWN
  */

  startConfirmationCountdown();

  /*
      TERMS
  */

  setupTerms();

  /*
      BACK BUTTON
  */

  const backButton = document.getElementById("backButton");

  if (backButton) {
    backButton.addEventListener("click", goBack);
  }

  /*
      CHANGE SEATS
  */

  const changeSeatsButton = document.getElementById("changeSeatsButton");

  if (changeSeatsButton) {
    changeSeatsButton.addEventListener("click", changeSeats);
  }

  /*
      CHANGE FOOD
  */

  const changeFoodButton = document.getElementById("changeFoodButton");

  if (changeFoodButton) {
    changeFoodButton.addEventListener("click", changeFood);
  }

  /*
      PROCEED TO PAYMENT
  */

  const paymentButton = document.getElementById("proceedPaymentButton");

  if (paymentButton) {
    paymentButton.addEventListener("click", proceedToPayment);
  }
}

/* =========================================
   START
========================================= */

initialize();
