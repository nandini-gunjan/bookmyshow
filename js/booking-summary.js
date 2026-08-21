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
        Ensure food fields always exist.
    */

    if (!Array.isArray(booking.foodItems)) {
      booking.foodItems = [];
    }

    booking.foodItemCount = Number(booking.foodItemCount) || 0;

    booking.foodTotal = Number(booking.foodTotal) || 0;

    booking.foodPreOrdered = booking.foodItems.length > 0;

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
   GET FOOD ITEMS
========================================= */

function getFoodItems() {
  return Array.isArray(booking.foodItems)
    ? booking.foodItems.filter((item) => Number(item.quantity) > 0)
    : [];
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

function displayFoodOrder() {
  const foodItems = getFoodItems();

  const foodItemsList = document.getElementById("foodItemsList");

  const noFoodMessage = document.getElementById("noFoodMessage");

  const foodTotalRow = document.getElementById("foodTotalRow");

  const foodTotalElement = document.getElementById("foodTotal");

  const subtitle = document.getElementById("foodOrderSubtitle");

  /*
      Clear existing items.
  */

  if (foodItemsList) {
    foodItemsList.innerHTML = "";
  }

  /*
      NO FOOD
  */

  if (foodItems.length === 0) {
    if (noFoodMessage) {
      noFoodMessage.style.display = "flex";
    }

    if (foodTotalRow) {
      foodTotalRow.style.display = "none";
    }

    if (subtitle) {
      subtitle.textContent = "You have not pre-ordered any food.";
    }

    return;
  }

  /*
      FOOD EXISTS
  */

  if (noFoodMessage) {
    noFoodMessage.style.display = "none";
  }

  if (foodTotalRow) {
    foodTotalRow.style.display = "flex";
  }

  if (subtitle) {
    subtitle.textContent = `${getFoodItemCount()} item${
      getFoodItemCount() === 1 ? "" : "s"
    } pre-ordered.`;
  }

  /*
      CREATE FOOD ITEMS
  */

  foodItems.forEach((item) => {
    const foodItem = document.createElement("div");

    foodItem.className = "food-summary-item";

    const imageUrl = item.image || "";

    const price = Number(item.price) || 0;

    const quantity = Number(item.quantity) || 0;

    const subtotal = price * quantity;

    foodItem.innerHTML = `

      <div class="food-summary-info">

        ${
          imageUrl
            ? `
            <img
              class="food-summary-image"
              src="${imageUrl}"
              alt="${escapeHtml(item.name || "Food item")}"
            >
            `
            : ""
        }

        <div class="food-summary-details">

          <strong>
            ${escapeHtml(item.name || "Food Item")}
          </strong>

          <span>
            ${quantity} × ${formatCurrency(price)}
          </span>

        </div>

      </div>


      <strong class="food-summary-price">
        ${formatCurrency(subtotal)}
      </strong>

    `;

    if (foodItemsList) {
      foodItemsList.appendChild(foodItem);
    }
  });

  /*
      FOOD TOTAL
  */

  const foodTotal = calculateFoodTotal();

  if (foodTotalElement) {
    foodTotalElement.textContent = formatCurrency(foodTotal);
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
      STATUS
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
      Save cancelled frozen seats.
  */

  booking.cancelledFrozenSeats = [...frozenSeats];

  /*
      Remove frozen seats.
  */

  booking.frozenSeats = [];

  /*
      Keep confirmed seats.
  */

  booking.seats = [...getConfirmedSeats()];

  booking.numberOfTickets = getConfirmedSeats().length;

  /*
      Update status.
  */

  booking.bookingStatus =
    getConfirmedSeats().length > 0 ? "PARTIALLY_CANCELLED" : "CANCELLED";

  booking.frozenStatus = "EXPIRED";

  booking.paymentStatus = "FROZEN_ADVANCE_FORFEITED";

  booking.frozenSeatsCancelledAt = Date.now();

  /*
      No remaining payment.
  */

  booking.frozenRemainingAmount = 0;

  booking.remainingAmount = 0;

  /*
      Save.
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

  /* =========================================
     CONFIRMED SEATS
     100% PAYMENT NOW
  ========================================= */

  const confirmedAmount = confirmedCount * ticketPrice;

  /* =========================================
     FROZEN SEATS
     50% PAYMENT NOW
  ========================================= */

  const frozenFullAmount = frozenCount * ticketPrice;

  const frozenAdvanceAmount = frozenFullAmount * 0.5;

  const frozenRemainingAmount = frozenFullAmount * 0.5;

  /* =========================================
     TICKET AMOUNT PAYABLE NOW
  ========================================= */

  const ticketAmountPayNow = confirmedAmount + frozenAdvanceAmount;

  /* =========================================
     FOOD ORDER
  ========================================= */

  const foodOrder = booking.foodOrder || [];

  let foodAmount = 0;

  foodOrder.forEach((item) => {
    const price = Number(item.price) || 0;

    const quantity = Number(item.quantity) || 0;

    foodAmount += price * quantity;
  });

  /* =========================================
     SUBTOTAL PAYABLE NOW
  ========================================= */

  const subtotalPayNow = ticketAmountPayNow + foodAmount;

  /* =========================================
     CONVENIENCE FEE
  ========================================= */

  const convenienceFee =
    ticketCount > 0 || foodAmount > 0 ? CONVENIENCE_FEE : 0;

  /* =========================================
     GST
  ========================================= */

  const taxableAmount = subtotalPayNow + convenienceFee;

  const gst = taxableAmount * GST_RATE;

  /* =========================================
     FINAL PAYMENT NOW
  ========================================= */

  const payableNow = subtotalPayNow + convenienceFee + gst;

  /* =========================================
     FULL TICKET VALUE
  ========================================= */

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

    foodAmount,

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
      CONFIRMED COUNT
  */

  const confirmedSeatCount = document.getElementById("confirmedSeatCount");

  if (confirmedSeatCount) {
    confirmedSeatCount.textContent = `${price.confirmedCount} seat${
      price.confirmedCount === 1 ? "" : "s"
    } × full price`;
  }

  /*
      FROZEN COUNT
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
      FOOD ITEM COUNT
  */

  const foodItemCount = document.getElementById("foodItemCount");

  if (foodItemCount) {
    foodItemCount.textContent = `${price.foodItemCount} item${
      price.foodItemCount === 1 ? "" : "s"
    }`;
  }

  /*
      FOOD AMOUNT
  */

  const foodPaymentAmount = document.getElementById("foodPaymentAmount");

  if (foodPaymentAmount) {
    foodPaymentAmount.textContent = formatCurrency(price.foodTotal);
  }

  /*
      Hide food row
      when no food is ordered.
  */

  const foodPaymentRow = document.getElementById("foodPaymentRow");

  if (foodPaymentRow) {
    foodPaymentRow.style.display = price.foodItemCount > 0 ? "flex" : "none";
  }

  /* =========================================
   FOOD AMOUNT
========================================= */

  const foodPaymentRow = document.getElementById("foodPaymentRow");

  const foodAmount = document.getElementById("foodAmount");

  const foodItemCount = document.getElementById("foodItemCount");

  const foodOrder = Array.isArray(booking.foodOrder) ? booking.foodOrder : [];

  const totalFoodItems = foodOrder.reduce((total, item) => {
    return total + (Number(item.quantity) || 0);
  }, 0);

  if (foodPaymentRow) {
    foodPaymentRow.style.display = totalFoodItems > 0 ? "flex" : "none";
  }

  if (foodAmount) {
    foodAmount.textContent = formatCurrency(price.foodAmount);
  }

  if (foodItemCount) {
    foodItemCount.textContent = `${totalFoodItems} item${
      totalFoodItems === 1 ? "" : "s"
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
      Hide rows with no seats.
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

  const foodOrder = Array.isArray(booking.foodOrder) ? booking.foodOrder : [];

  const foodItemCount = foodOrder.reduce((total, item) => {
    return total + (Number(item.quantity) || 0);
  }, 0);

  /* =========================================
     PAYMENT DATA
  ========================================= */

  const paymentData = {
    ...booking,

    /* =====================================
       SEATS
    ====================================== */

    seats: getAllSeats(),

    confirmedSeats: getConfirmedSeats(),

    frozenSeats: getFrozenSeats(),

    confirmedSeatCount: price.confirmedCount,

    frozenSeatCount: price.frozenCount,

    ticketCount: price.ticketCount,

    numberOfTickets: price.ticketCount,

    /* =====================================
       TICKET PRICE DETAILS
    ====================================== */

    ticketPrice: price.ticketPrice,

    confirmedAmount: Number(price.confirmedAmount.toFixed(2)),

    frozenFullAmount: Number(price.frozenFullAmount.toFixed(2)),

    frozenAdvanceAmount: Number(price.frozenAdvanceAmount.toFixed(2)),

    frozenRemainingAmount: Number(price.frozenRemainingAmount.toFixed(2)),

    remainingAmount: Number(price.frozenRemainingAmount.toFixed(2)),

    ticketAmountPayNow: Number(price.ticketAmountPayNow.toFixed(2)),

    /* =====================================
       FOOD ORDER
    ====================================== */

    foodOrder,

    foodItemCount,

    foodAmount: Number(price.foodAmount.toFixed(2)),

    /* =====================================
       BASE AMOUNT

       This is the amount before
       convenience fee and GST.
    ====================================== */

    baseAmount: Number(price.subtotalPayNow.toFixed(2)),

    /* =====================================
       FEES
    ====================================== */

    convenienceFee: Number(price.convenienceFee.toFixed(2)),

    gst: Number(price.gst.toFixed(2)),

    /* =====================================
       FINAL PAYMENT
    ====================================== */

    payableNow: Number(price.payableNow.toFixed(2)),

    totalAmount: Number(price.payableNow.toFixed(2)),

    /* =====================================
       FULL BOOKING VALUE
    ====================================== */

    fullBookingValue: Number(price.fullBookingValue.toFixed(2)),

    /* =====================================
       STATUS
    ====================================== */

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
  /*
      Return directly to
      seat selection.
  */

  window.location.href = "seat-selection.html";
}

/* =========================================
   CHANGE FOOD
========================================= */

function changeFood() {
  /*
      Return directly to
      food selection.
  */

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
      for YYYY-MM-DD.
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
      Check frozen seat expiry.
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

  displayFoodOrder();

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
      BACK
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
   DISPLAY FOOD ORDER
========================================= */

function displayFoodOrder() {
  const foodOrderSection = document.getElementById("foodOrderSection");

  const foodOrderItems = document.getElementById("foodOrderItems");

  const foodOrderTotal = document.getElementById("foodOrderTotal");

  const foodOrder = Array.isArray(booking.foodOrder) ? booking.foodOrder : [];

  /* =========================================
     NO FOOD ORDER
  ========================================= */

  if (foodOrder.length === 0) {
    if (foodOrderSection) {
      foodOrderSection.style.display = "none";
    }

    return;
  }

  if (foodOrderSection) {
    foodOrderSection.style.display = "block";
  }

  if (!foodOrderItems) {
    return;
  }

  foodOrderItems.innerHTML = "";

  let total = 0;

  foodOrder.forEach((item) => {
    const name = item.name || "Food Item";

    const price = Number(item.price) || 0;

    const quantity = Number(item.quantity) || 0;

    const itemTotal = price * quantity;

    total += itemTotal;

    const itemElement = document.createElement("div");

    itemElement.className = "summary-row";

    itemElement.innerHTML = `
      <span>
        ${name}
        <small>${quantity} × ${formatCurrency(price)}</small>
      </span>

      <strong>${formatCurrency(itemTotal)}</strong>
    `;

    foodOrderItems.appendChild(itemElement);
  });

  if (foodOrderTotal) {
    foodOrderTotal.textContent = formatCurrency(total);
  }
}

/* =========================================
   START
========================================= */

initialize();
