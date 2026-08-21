/* =========================================
   BOOKITBRO
   PRE-ORDER FOOD
========================================= */

/* =========================================
   STATE
========================================= */

let booking = null;

let selectedCategory = "all";

let cart = [];

/* =========================================
   REWARD SETTINGS
========================================= */

const REWARD_TARGET = 100;

const POINTS_PER_RUPEE = 0.1;

/* =========================================
   FOOD MENU
========================================= */

const foodMenu = [
  {
    id: "classic-popcorn",
    name: "Classic Salted Popcorn",
    category: "popcorn",
    price: 120,
    image:
      "https://images.unsplash.com/photo-1585647347384-2593bc35786b?auto=format&fit=crop&w=800&q=80",
    emoji: "🍿",
    description: "Freshly popped and lightly salted.",
  },

  {
    id: "cheese-popcorn",
    name: "Cheesy Popcorn",
    category: "popcorn",
    price: 160,
    image:
      "assets/img/cheesePopcorn.jpg",
    emoji: "🧀🍿",
    description: "Crispy popcorn with rich cheese flavour.",
  },

  {
    id: "caramel-popcorn",
    name: "Caramel Popcorn",
    category: "popcorn",
    price: 180,
    image:
      "assets/img/caramelPopcorn.jpg",
    emoji: "🍯🍿",
    description: "Sweet, crunchy caramel-coated popcorn.",
  },

  {
    id: "butter-popcorn",
    name: "Butter Popcorn",
    category: "popcorn",
    price: 150,
    image:
      "https://images.unsplash.com/photo-1512149177596-f817c7ef5d4c?auto=format&fit=crop&w=800&q=80",
    emoji: "🧈🍿",
    description: "Movie-style popcorn with buttery flavour.",
  },

  {
    id: "veg-burger",
    name: "Veggie Burger",
    category: "snacks",
    price: 140,
    image:
      "assets/img/vegBurger.jpg",
    emoji: "🍔",
    description: "A delicious burger with a crispy vegetable patty.",
  },

  {
    id: "french-fries",
    name: "Crispy French Fries",
    category: "snacks",
    price: 110,
    image:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80",
    emoji: "🍟",
    description: "Golden, crispy fries served fresh.",
  },

  {
    id: "nachos",
    name: "Loaded Nachos",
    category: "snacks",
    price: 170,
    image:
      "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=800&q=80",
    emoji: "🧀",
    description: "Crunchy nachos loaded with cheese and toppings.",
  },

  {
    id: "veg-pizza",
    name: "Veg Pizza",
    category: "snacks",
    price: 220,
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80",
    emoji: "🍕",
    description: "Cheesy pizza topped with fresh vegetables.",
  },

  {
    id: "popcorn-combo",
    name: "Popcorn + Coke Combo",
    category: "combos",
    price: 220,
    image:
      "assets/img/popCoke.jpg",
    emoji: "🍿🥤",
    description: "Classic popcorn with a chilled soft drink.",
  },

  {
    id: "burger-combo",
    name: "Burger Combo",
    category: "combos",
    price: 250,
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
    emoji: "🍔🍟🥤",
    description: "Burger, fries and a refreshing drink.",
  },

  {
    id: "movie-mega-combo",
    name: "Movie Mega Combo",
    category: "combos",
    price: 399,
    image:
      "assets/img/popPizzaCoke.jpg",
    emoji: "🍿🍕🥤",
    description: "The perfect sharing combo for your movie.",
  },

  {
    id: "coke",
    name: "Coca-Cola",
    category: "drinks",
    price: 80,
    image:
      "https://images.unsplash.com/photo-1629203849820-fdd70d49c38e?auto=format&fit=crop&w=800&q=80",
    emoji: "🥤",
    description: "Chilled and refreshing soft drink.",
  },

  {
    id: "cold-coffee",
    name: "Cold Coffee",
    category: "drinks",
    price: 130,
    image:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80",
    emoji: "🥤",
    description: "Smooth and refreshing cold coffee.",
  },

  {
    id: "mineral-water",
    name: "Mineral Water",
    category: "drinks",
    price: 40,
    image:
      "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=800&q=80",
    emoji: "💧",
    description: "Packaged drinking water.",
  },
];

/* =========================================
   LOAD BOOKING DATA
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
        Restore previous food cart.

        This is useful if the user goes back
        from the booking summary page.
    */

    if (Array.isArray(booking.foodOrder)) {
      cart = booking.foodOrder.map((item) => ({
        ...item,
        quantity: Number(item.quantity) || 1,
      }));
    }

    return true;
  } catch (error) {
    console.error("Unable to load booking:", error);

    showBookingError();

    return false;
  }
}

/* =========================================
   DISPLAY BOOKING INFORMATION
========================================= */

function displayBookingInformation() {
  const moviePoster = document.getElementById("moviePoster");

  const movieTitle = document.getElementById("movieTitle");

  const showDetails = document.getElementById("showDetails");

  if (movieTitle) {
    movieTitle.textContent = booking.movieTitle || "Movie";
  }

  /*
      Poster
  */

  if (moviePoster) {
    const poster = booking.moviePoster || booking.poster || "";

    if (poster) {
      moviePoster.src = poster;

      moviePoster.onerror = () => {
        moviePoster.style.display = "none";
      };
    } else {
      moviePoster.style.display = "none";
    }
  }

  /*
      Show details
  */

  if (showDetails) {
    const theatre = booking.theatreName || "Theatre";

    const date = formatDate(booking.date);

    const time = booking.showTime || "";

    const seats = getSelectedSeats();

    const seatText = seats.length > 0 ? ` • Seats: ${seats.join(", ")}` : "";

    showDetails.textContent = `${theatre} • ${date} • ${time}${seatText}`;
  }
}

/* =========================================
   GET SELECTED SEATS
========================================= */

function getSelectedSeats() {
  if (Array.isArray(booking.seats)) {
    return booking.seats;
  }

  const confirmedSeats = Array.isArray(booking.confirmedSeats)
    ? booking.confirmedSeats
    : [];

  const frozenSeats = Array.isArray(booking.frozenSeats)
    ? booking.frozenSeats
    : [];

  return [...confirmedSeats, ...frozenSeats];
}

/* =========================================
   CATEGORY SETUP
========================================= */

function setupCategories() {
  const categoryButtons = document.querySelectorAll(".category-button");

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectedCategory = button.dataset.category || "all";

      /*
          Update active button
      */

      categoryButtons.forEach((item) => {
        item.classList.remove("active");
      });

      button.classList.add("active");

      /*
          Render filtered food
      */

      renderFoodGrid();
    });
  });
}

/* =========================================
   GET CART QUANTITY
========================================= */

function getCartQuantity(foodId) {
  const item = cart.find((cartItem) => cartItem.id === foodId);

  return item ? Number(item.quantity) || 0 : 0;
}

/* =========================================
   RENDER FOOD GRID
========================================= */

function renderFoodGrid() {
  const foodGrid = document.getElementById("foodGrid");

  if (!foodGrid) {
    return;
  }

  /*
      Filter food by category
  */

  const filteredFood =
    selectedCategory === "all"
      ? foodMenu
      : foodMenu.filter((food) => food.category === selectedCategory);

  /*
      Clear grid
  */

  foodGrid.innerHTML = "";

  /*
      No food
  */

  if (filteredFood.length === 0) {
    foodGrid.innerHTML = `
      <div class="no-food-message">
        <h3>No items found</h3>
        <p>Please select another category.</p>
      </div>
    `;

    return;
  }

  /*
      Generate cards
  */

  filteredFood.forEach((food) => {
    const quantity = getCartQuantity(food.id);

    const card = document.createElement("div");

    card.className = "food-card";

    card.dataset.foodId = food.id;

    card.innerHTML = `
      <div class="food-image">
  <img
    src="${food.image}"
    alt="${food.name}"
    loading="lazy"
    onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
  />

  <span class="food-emoji food-image-fallback">
    ${food.emoji}
  </span>
</div>

      <div class="food-card-content">

        <div class="food-card-top">

          <span class="food-category">
            ${formatCategory(food.category)}
          </span>

          <span class="food-price">
            ${formatCurrency(food.price)}
          </span>

        </div>

        <h3>
          ${food.name}
        </h3>

        <p>
          ${food.description}
        </p>

        <div class="food-card-bottom">

          ${
            quantity === 0
              ? `
                <button
                  class="add-food-button"
                  type="button"
                  data-add="${food.id}"
                >
                  Add
                  <span>+</span>
                </button>
              `
              : `
                <div class="food-quantity-controls">

                  <button
                    type="button"
                    class="quantity-button"
                    data-decrease="${food.id}"
                  >
                    −
                  </button>

                  <strong>
                    ${quantity}
                  </strong>

                  <button
                    type="button"
                    class="quantity-button"
                    data-increase="${food.id}"
                  >
                    +
                  </button>

                </div>
              `
          }

        </div>

      </div>
    `;

    foodGrid.appendChild(card);
  });

  /*
      Setup card buttons
  */

  setupFoodButtons();
}

/* =========================================
   SETUP FOOD BUTTONS
========================================= */

function setupFoodButtons() {
  /*
      Add food
  */

  document.querySelectorAll("[data-add]").forEach((button) => {
    button.addEventListener("click", () => {
      addFood(button.dataset.add);
    });
  });

  /*
      Increase quantity
  */

  document.querySelectorAll("[data-increase]").forEach((button) => {
    button.addEventListener("click", () => {
      changeFoodQuantity(button.dataset.increase, 1);
    });
  });

  /*
      Decrease quantity
  */

  document.querySelectorAll("[data-decrease]").forEach((button) => {
    button.addEventListener("click", () => {
      changeFoodQuantity(button.dataset.decrease, -1);
    });
  });
}

/* =========================================
   ADD FOOD
========================================= */

function addFood(foodId) {
  const food = foodMenu.find((item) => item.id === foodId);

  if (!food) {
    return;
  }

  const existingItem = cart.find((item) => item.id === foodId);

  /*
      Already exists
  */

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    /*
        Add new item
    */

    cart.push({
      id: food.id,

      name: food.name,

      category: food.category,

      price: food.price,

      quantity: 1,

      emoji: food.emoji,
    });
  }

  updateFoodPage();
}

/* =========================================
   CHANGE FOOD QUANTITY
========================================= */

function changeFoodQuantity(foodId, change) {
  const cartItem = cart.find((item) => item.id === foodId);

  if (!cartItem) {
    return;
  }

  cartItem.quantity += change;

  /*
      Remove item if quantity is zero
  */

  if (cartItem.quantity <= 0) {
    cart = cart.filter((item) => item.id !== foodId);
  }

  updateFoodPage();
}

/* =========================================
   REMOVE FOOD
========================================= */

function removeFood(foodId) {
  cart = cart.filter((item) => item.id !== foodId);

  updateFoodPage();
}

/* =========================================
   UPDATE COMPLETE FOOD PAGE
========================================= */

function updateFoodPage() {
  renderFoodGrid();

  renderCart();

  updateRewardInformation();

  updateContinueButtons();
}

/* =========================================
   RENDER CART
========================================= */

function renderCart() {
  const emptyCart = document.getElementById("emptyCart");

  const cartItems = document.getElementById("cartItems");

  const cartCount = document.getElementById("cartCount");

  if (!emptyCart || !cartItems) {
    return;
  }

  /*
      Total item quantity
  */

  const totalItems = getTotalItemCount();

  /*
      Cart count
  */

  if (cartCount) {
    cartCount.textContent = `${totalItems} ${
      totalItems === 1 ? "item" : "items"
    }`;
  }

  /*
      Empty cart
  */

  if (cart.length === 0) {
    emptyCart.style.display = "block";

    cartItems.innerHTML = "";

    return;
  }

  /*
      Show cart
  */

  emptyCart.style.display = "none";

  cartItems.innerHTML = "";

  /*
      Create cart items
  */

  cart.forEach((item) => {
    const total = Number(item.price) * Number(item.quantity);

    const cartItem = document.createElement("div");

    cartItem.className = "cart-item";

    cartItem.innerHTML = `
      <div class="cart-item-main">

        <div class="cart-item-icon">
          ${item.emoji || "🍿"}
        </div>

        <div class="cart-item-info">

          <h4>
            ${item.name}
          </h4>

          <span>
            ${formatCurrency(item.price)} each
          </span>

        </div>

        <button
          class="remove-cart-item"
          type="button"
          data-remove="${item.id}"
          aria-label="Remove ${item.name}"
        >
          ×
        </button>

      </div>

      <div class="cart-item-bottom">

        <div class="cart-quantity-controls">

          <button
            type="button"
            class="cart-quantity-button"
            data-cart-decrease="${item.id}"
          >
            −
          </button>

          <strong>
            ${item.quantity}
          </strong>

          <button
            type="button"
            class="cart-quantity-button"
            data-cart-increase="${item.id}"
          >
            +
          </button>

        </div>

        <strong class="cart-item-total">
          ${formatCurrency(total)}
        </strong>

      </div>
    `;

    cartItems.appendChild(cartItem);
  });

  /*
      Cart button events
  */

  setupCartButtons();
}

/* =========================================
   SETUP CART BUTTONS
========================================= */

function setupCartButtons() {
  /*
      Increase
  */

  document.querySelectorAll("[data-cart-increase]").forEach((button) => {
    button.addEventListener("click", () => {
      changeFoodQuantity(button.dataset.cartIncrease, 1);
    });
  });

  /*
      Decrease
  */

  document.querySelectorAll("[data-cart-decrease]").forEach((button) => {
    button.addEventListener("click", () => {
      changeFoodQuantity(button.dataset.cartDecrease, -1);
    });
  });

  /*
      Remove
  */

  document.querySelectorAll("[data-remove]").forEach((button) => {
    button.addEventListener("click", () => {
      removeFood(button.dataset.remove);
    });
  });
}

/* =========================================
   GET TOTAL FOOD ITEMS
========================================= */

function getTotalItemCount() {
  return cart.reduce((total, item) => total + (Number(item.quantity) || 0), 0);
}

/* =========================================
   CALCULATE FOOD SUBTOTAL
========================================= */

function calculateFoodSubtotal() {
  return cart.reduce((total, item) => {
    const price = Number(item.price) || 0;

    const quantity = Number(item.quantity) || 0;

    return total + price * quantity;
  }, 0);
}

/* =========================================
   CALCULATE POINTS
========================================= */

function calculatePoints() {
  const subtotal = calculateFoodSubtotal();

  return Math.floor(subtotal * POINTS_PER_RUPEE);
}

/* =========================================
   UPDATE PRICE
========================================= */

function updatePriceInformation() {
  const subtotal = calculateFoodSubtotal();

  /*
      Currently no additional
      GST or food charge.

      Total = food subtotal.
  */

  const total = subtotal;

  const foodSubtotal = document.getElementById("foodSubtotal");

  const foodTotal = document.getElementById("foodTotal");

  const mobileFoodTotal = document.getElementById("mobileFoodTotal");

  if (foodSubtotal) {
    foodSubtotal.textContent = formatCurrency(subtotal);
  }

  if (foodTotal) {
    foodTotal.textContent = formatCurrency(total);
  }

  if (mobileFoodTotal) {
    mobileFoodTotal.textContent = formatCurrency(total);
  }
}

/* =========================================
   UPDATE REWARD INFORMATION
========================================= */

function updateRewardInformation() {
  /*
      Existing points.

      If user points are added to the
      booking object later, this will use them.
  */

  const existingPoints = Number(booking.rewardPoints) || 0;

  const earnedPoints = calculatePoints();

  const totalPoints = existingPoints + earnedPoints;

  /*
      Header points
  */

  const headerPoints = document.getElementById("headerPoints");

  if (headerPoints) {
    headerPoints.textContent = `${totalPoints} ${
      totalPoints === 1 ? "Point" : "Points"
    }`;
  }

  /*
      Preview points
  */

  const pointsPreview = document.getElementById("pointsPreview");

  if (pointsPreview) {
    pointsPreview.textContent = `+${earnedPoints}`;
  }

  /*
      Current points
  */

  const currentPoints = document.getElementById("currentPoints");

  if (currentPoints) {
    currentPoints.textContent = `${Math.min(
      totalPoints,
      REWARD_TARGET,
    )} / ${REWARD_TARGET} Points`;
  }

  /*
      Progress bar
  */

  const rewardProgress = document.getElementById("rewardProgress");

  if (rewardProgress) {
    const percentage = Math.min((totalPoints / REWARD_TARGET) * 100, 100);

    rewardProgress.style.width = `${percentage}%`;
  }

  /*
      Update price information too
  */

  updatePriceInformation();
}

/* =========================================
   UPDATE CONTINUE BUTTONS
========================================= */

function updateContinueButtons() {
  const hasFood = cart.length > 0;

  const continueButton = document.getElementById("continueFoodButton");

  const mobileButton = document.getElementById("mobileContinueButton");

  /*
      Keep buttons enabled.

      Users can continue even without food
      because pre-ordering is optional.
  */

  if (continueButton) {
    continueButton.disabled = false;

    continueButton.classList.toggle("has-food", hasFood);
  }

  if (mobileButton) {
    mobileButton.disabled = false;
  }
}

/* =========================================
   SAVE FOOD ORDER
========================================= */

function saveFoodOrder() {
  const foodSubtotal = calculateFoodSubtotal();

  const foodPoints = calculatePoints();

  /*
      Clean food data
      before saving.
  */

  const foodOrder = cart.map((item) => ({
    id: item.id,

    name: item.name,

    category: item.category,

    price: Number(item.price),

    quantity: Number(item.quantity),

    itemTotal: Number(item.price) * Number(item.quantity),
  }));

  /*
      Update booking.

      Food information is added to the
      existing booking created by
      seat-selection.js.
  */

  const updatedBooking = {
    ...booking,

    /*
        Food items
    */

    foodOrder,

    foodItemCount: getTotalItemCount(),

    foodSubtotal: Number(foodSubtotal.toFixed(2)),

    foodTotal: Number(foodSubtotal.toFixed(2)),

    /*
        Rewards
    */

    foodPointsEarned: foodPoints,

    /*
        Optional order status
    */

    foodOrderStatus: foodOrder.length > 0 ? "PRE_ORDERED" : "NO_FOOD_ORDER",
  };

  /*
      Update global state
  */

  booking = updatedBooking;

  /*
      Save back to session storage.

      IMPORTANT:
      This keeps all seat information
      and adds the food order.
  */

  sessionStorage.setItem(
    "bookItBroFinalBooking",
    JSON.stringify(updatedBooking),
  );

  console.log("Food order saved:", updatedBooking);

  return updatedBooking;
}

/* =========================================
   CONTINUE TO BOOKING SUMMARY
========================================= */

function continueToBookingSummary() {
  /*
      Save selected food.
  */

  saveFoodOrder();

  /*
      Go to booking summary.
  */

  window.location.href = "booking-summary.html";
}

/* =========================================
   SETUP CONTINUE BUTTONS
========================================= */

function setupContinueButtons() {
  const continueButton = document.getElementById("continueFoodButton");

  const mobileButton = document.getElementById("mobileContinueButton");

  if (continueButton) {
    continueButton.addEventListener("click", continueToBookingSummary);
  }

  if (mobileButton) {
    mobileButton.addEventListener("click", continueToBookingSummary);
  }
}

/* =========================================
   BACK BUTTON
========================================= */

function setupBackButton() {
  const backButton = document.getElementById("backButton");

  if (!backButton) {
    return;
  }

  backButton.addEventListener("click", () => {
    window.history.back();
  });
}

/* =========================================
   FORMAT CATEGORY
========================================= */

function formatCategory(category) {
  if (!category) {
    return "";
  }

  return category.charAt(0).toUpperCase() + category.slice(1);
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
    const [year, month, day] = dateString.split("-").map(Number);

    const date = new Date(year, month - 1, day);

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
   BOOKING ERROR
========================================= */

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
        max-width:450px;
      ">

        <div style="
          font-size:52px;
          margin-bottom:15px;
        ">
          🍿
        </div>

        <h2>
          Booking Information Not Found
        </h2>

        <p style="
          color:#777;
          line-height:1.6;
          margin:12px 0 22px;
        ">
          We could not find your booking
          information. Please select your
          movie and seats again.
        </p>

        <button
          onclick="history.back()"
          style="
            border:none;
            padding:12px 24px;
            border-radius:8px;
            background:#e51937;
            color:#fff;
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

/* =========================================
   INITIALIZE
========================================= */

function initialize() {
  /*
      Load booking created
      in seat-selection.js
  */

  const loaded = loadBooking();

  if (!loaded) {
    return;
  }

  /*
      Display show information
  */

  displayBookingInformation();

  /*
      Setup categories
  */

  setupCategories();

  /*
      Render menu
  */

  renderFoodGrid();

  /*
      Render existing cart
  */

  renderCart();

  /*
      Rewards
  */

  updateRewardInformation();

  /*
      Continue buttons
  */

  updateContinueButtons();

  setupContinueButtons();

  /*
      Back
  */

  setupBackButton();
}

/* =========================================
   START
========================================= */

initialize();
