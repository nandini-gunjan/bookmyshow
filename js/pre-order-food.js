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
let friends = [];

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
    description: "Freshly popped and lightly salted.",
  },
  {
    id: "cheese-popcorn",
    name: "Cheesy Popcorn",
    category: "popcorn",
    price: 160,
    image: "assets/img/cheesePopcorn.jpg",
    description: "Crispy popcorn with rich cheese flavour.",
  },
  {
    id: "caramel-popcorn",
    name: "Caramel Popcorn",
    category: "popcorn",
    price: 180,
    image: "assets/img/caramelPopcorn.jpg",
    description: "Sweet, crunchy caramel-coated popcorn.",
  },
  {
    id: "butter-popcorn",
    name: "Butter Popcorn",
    category: "popcorn",
    price: 150,
    image:
      "https://images.unsplash.com/photo-1512149177596-f817c7ef5d4c?auto=format&fit=crop&w=800&q=80",
    description: "Movie-style popcorn with buttery flavour.",
  },
  {
    id: "veg-burger",
    name: "Veggie Burger",
    category: "snacks",
    price: 140,
    image: "assets/img/vegBurger.jpg",
    description: "A delicious burger with a crispy vegetable patty.",
  },
  {
    id: "french-fries",
    name: "Crispy French Fries",
    category: "snacks",
    price: 110,
    image:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80",
    description: "Golden, crispy fries served fresh.",
  },
  {
    id: "nachos",
    name: "Loaded Nachos",
    category: "snacks",
    price: 170,
    image:
      "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=800&q=80",
    description: "Crunchy nachos loaded with cheese and toppings.",
  },
  {
    id: "veg-pizza",
    name: "Veg Pizza",
    category: "snacks",
    price: 220,
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80",
    description: "Cheesy pizza topped with fresh vegetables.",
  },
  {
    id: "popcorn-combo",
    name: "Popcorn + Coke Combo",
    category: "combos",
    price: 220,
    image: "assets/img/popCoke.jpg",
    description: "Classic popcorn with a chilled soft drink.",
  },
  {
    id: "burger-combo",
    name: "Burger Combo",
    category: "combos",
    price: 250,
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
    description: "Burger, fries and a refreshing drink.",
  },
  {
    id: "movie-mega-combo",
    name: "Movie Mega Combo",
    category: "combos",
    price: 399,
    image: "assets/img/popPizzaCoke.jpg",
    description: "The perfect sharing combo for your movie.",
  },
  {
    id: "coke",
    name: "Coca-Cola",
    category: "drinks",
    price: 80,
    image:
      "https://images.unsplash.com/photo-1629203849820-fdd70d49c38e?auto=format&fit=crop&w=800&q=80",
    description: "Chilled and refreshing soft drink.",
  },
  {
    id: "cold-coffee",
    name: "Cold Coffee",
    category: "drinks",
    price: 130,
    image:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80",
    description: "Smooth and refreshing cold coffee.",
  },
  {
    id: "mineral-water",
    name: "Mineral Water",
    category: "drinks",
    price: 40,
    image:
      "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=800&q=80",
    description: "Packaged drinking water.",
  },
];

/* =========================================
   FRIEND MANAGEMENT
========================================= */

function getCurrentUserName() {
  return booking?.userName || booking?.customerName || booking?.name || "You";
}

function createCurrentUser() {
  return {
    id: "current-user",
    name: getCurrentUserName(),
    isCurrentUser: true,
  };
}

function generateFriendId() {
  return `friend-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
}

function loadFriends() {
  const savedFriends = Array.isArray(booking?.friends) ? booking.friends : [];

  friends = [
    createCurrentUser(),

    ...savedFriends
      .filter((friend) => friend.id !== "current-user")
      .map((friend, index) => ({
        id: friend.id || `friend-${Date.now()}-${index}`,
        name: friend.name || "Friend",
        upiId: friend.upiId || "",
        isCurrentUser: false,
      })),
  ];
}

/* =========================================
   ASSIGNMENT HELPERS
========================================= */

/*
  Every food item now has:

  assignments: {
    "current-user": 2,
    "friend-123": 1,
    "friend-456": 1
  }

  The total of all assignment quantities
  must never be greater than item.quantity.
*/

function createDefaultAssignments(quantity) {
  return {
    "current-user": Number(quantity) || 0,
  };
}

function getAssignmentTotal(item) {
  if (!item || !item.assignments) {
    return 0;
  }

  return Object.values(item.assignments).reduce((total, quantity) => {
    return total + (Number(quantity) || 0);
  }, 0);
}

function normalizeItemAssignments(item) {
  if (!item) {
    return;
  }

  const quantity = Math.max(Number(item.quantity) || 0, 0);

  if (!item.assignments || typeof item.assignments !== "object") {
    item.assignments = createDefaultAssignments(quantity);
    return;
  }

  const validFriendIds = new Set(friends.map((friend) => friend.id));

  const cleanedAssignments = {};

  Object.entries(item.assignments).forEach(([friendId, amount]) => {
    if (!validFriendIds.has(friendId)) {
      return;
    }

    const numericAmount = Math.max(Number(amount) || 0, 0);

    if (numericAmount > 0) {
      cleanedAssignments[friendId] = Math.floor(numericAmount);
    }
  });

  let assignedTotal = Object.values(cleanedAssignments).reduce(
    (total, amount) => total + amount,
    0,
  );

  /*
    If old data used assignedTo, convert it.
  */

  if (
    assignedTotal === 0 &&
    item.assignedTo &&
    validFriendIds.has(item.assignedTo)
  ) {
    cleanedAssignments[item.assignedTo] = quantity;
    assignedTotal = quantity;
  }

  /*
    Any unassigned quantity goes to the current user.
  */

  if (assignedTotal < quantity) {
    cleanedAssignments["current-user"] =
      (cleanedAssignments["current-user"] || 0) + (quantity - assignedTotal);
  }

  /*
    If assignments somehow exceed the quantity,
    reduce them safely.
  */

  assignedTotal = Object.values(cleanedAssignments).reduce(
    (total, amount) => total + amount,
    0,
  );

  if (assignedTotal > quantity) {
    let excess = assignedTotal - quantity;

    const ids = Object.keys(cleanedAssignments).reverse();

    for (const friendId of ids) {
      if (excess <= 0) {
        break;
      }

      const removable = Math.min(cleanedAssignments[friendId], excess);

      cleanedAssignments[friendId] -= removable;
      excess -= removable;

      if (cleanedAssignments[friendId] <= 0) {
        delete cleanedAssignments[friendId];
      }
    }
  }

  item.assignments = cleanedAssignments;
}

function getAssignedQuantity(item, friendId) {
  if (!item || !item.assignments) {
    return 0;
  }

  return Number(item.assignments[friendId]) || 0;
}

function getUnassignedQuantity(item) {
  const quantity = Number(item?.quantity) || 0;
  const assigned = getAssignmentTotal(item);

  return Math.max(quantity - assigned, 0);
}

// =========================================
// CHANGE FOOD ASSIGNMENT
// =========================================

function changeFoodAssignment(foodId, friendId, change) {
  const item = cart.find((cartItem) => cartItem.id === foodId);

  if (!item) {
    return;
  }

  if (!item.assignments) {
    item.assignments = {};
  }

  const totalQuantity = Number(item.quantity) || 0;

  // Make sure every friend has an assignment entry
  friends.forEach((friend) => {
    if (!Object.prototype.hasOwnProperty.call(item.assignments, friend.id)) {
      item.assignments[friend.id] = 0;
    }
  });

  if (change > 0) {
    // =========================================
    // ASSIGN ONE ITEM TO FRIEND
    // =========================================

    // Find someone who currently owns an item.
    // Prefer current user.
    let sourceFriendId = null;

    const currentUserQuantity = Number(item.assignments["current-user"]) || 0;

    if (currentUserQuantity > 0) {
      sourceFriendId = "current-user";
    } else {
      const otherOwner = friends.find(
        (friend) =>
          friend.id !== friendId &&
          (Number(item.assignments[friend.id]) || 0) > 0,
      );

      if (otherOwner) {
        sourceFriendId = otherOwner.id;
      }
    }

    // Nobody has an available quantity to transfer
    if (!sourceFriendId) {
      return;
    }

    // Remove one from current owner
    item.assignments[sourceFriendId] =
      (Number(item.assignments[sourceFriendId]) || 0) - 1;

    // Give one to selected friend
    item.assignments[friendId] = (Number(item.assignments[friendId]) || 0) + 1;
  } else {
    // =========================================
    // REMOVE ONE ITEM FROM FRIEND
    // =========================================

    const friendQuantity = Number(item.assignments[friendId]) || 0;

    if (friendQuantity <= 0) {
      return;
    }

    // Remove one from friend
    item.assignments[friendId] = friendQuantity - 1;

    // Return it to current user
    item.assignments["current-user"] =
      (Number(item.assignments["current-user"]) || 0) + 1;
  }

  // Remove zero-value entries
  Object.keys(item.assignments).forEach((id) => {
    if (Number(item.assignments[id]) <= 0) {
      delete item.assignments[id];
    }
  });

  renderCart();
  renderFriends();
}

/* =========================================
   SETUP FRIEND SECTION
========================================= */

function setupFriendSection() {
  const addFriendButton = document.getElementById("addFriendButton");
  const closeButton = document.getElementById("closeFriendModal");
  const cancelButton = document.getElementById("cancelFriendButton");
  const overlay = document.getElementById("friendModalOverlay");
  const form = document.getElementById("addFriendForm");

  console.log("Friend section initialized");
  console.log("Add Friend Button:", addFriendButton);
  console.log("Friend Modal:", document.getElementById("addFriendModal"));
  console.log("Friend Form:", form);

  if (addFriendButton) {
    addFriendButton.addEventListener("click", function (event) {
      event.preventDefault();
      console.log("Add Friend button clicked");
      openFriendModal();
    });
  } else {
    console.error("addFriendButton was NOT found.");
  }

  if (closeButton) {
    closeButton.addEventListener("click", function (event) {
      event.preventDefault();
      closeFriendModalBox();
    });
  }

  if (cancelButton) {
    cancelButton.addEventListener("click", function (event) {
      event.preventDefault();
      closeFriendModalBox();
    });
  }

  if (overlay) {
    overlay.addEventListener("click", function (event) {
      if (event.target === overlay) {
        closeFriendModalBox();
      }
    });
  }

  if (form) {
    form.addEventListener("submit", function (event) {
      handleAddFriend(event);
    });
  } else {
    console.error("addFriendForm was NOT found.");
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeFriendModalBox();
    }
  });
}

/* =========================================
   OPEN FRIEND MODAL
========================================= */

function openFriendModal() {
  const modal = document.getElementById("addFriendModal");
  const input = document.getElementById("friendNameInput");

  console.log("Opening modal:", modal);

  if (!modal) {
    console.error("Add friend modal was not found.");
    return;
  }

  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");

  document.body.style.overflow = "hidden";

  if (input) {
    input.value = "";

    setTimeout(() => {
      input.focus();
    }, 100);
  }
}

/* =========================================
   CLOSE FRIEND MODAL
========================================= */

function closeFriendModalBox() {
  const modal = document.getElementById("addFriendModal");
  const form = document.getElementById("addFriendForm");

  if (!modal) {
    return;
  }

  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");

  /*
    IMPORTANT:
    Restore page scrolling after closing modal.
  */

  document.body.style.overflow = "";

  if (form) {
    form.reset();
  }
}

/* =========================================
   ADD FRIEND
========================================= */

function handleAddFriend(event) {
  event.preventDefault();

  const input = document.getElementById("friendNameInput");

  if (!input) {
    return;
  }

  const name = input.value.trim();

  if (!name) {
    alert("Please enter your friend's name.");
    return;
  }

  // =========================================
  // MAX FRIEND LIMIT BASED ON BOOKED SEATS
  // =========================================

  const selectedSeats = getSelectedSeats();
  const totalSeats = selectedSeats.length;

  // Current user already occupies one seat.
  // Therefore maximum friends = total seats - 1.
  const maxFriends = Math.max(totalSeats - 1, 0);

  const currentFriendCount = friends.filter(
    (friend) => !friend.isCurrentUser,
  ).length;

  if (currentFriendCount >= maxFriends) {
    alert(
      `You can add a maximum of ${maxFriends} friend${
        maxFriends === 1 ? "" : "s"
      } for ${totalSeats} booked seat${totalSeats === 1 ? "" : "s"}.`,
    );
    return;
  }

  // =========================================
  // CHECK DUPLICATE FRIEND
  // =========================================

  const alreadyExists = friends.some(
    (friend) => friend.name.trim().toLowerCase() === name.toLowerCase(),
  );

  if (alreadyExists) {
    alert("This friend has already been added.");
    return;
  }

  // =========================================
  // CREATE FRIEND
  // =========================================

  const newFriend = {
    id: generateFriendId(),
    name: name,
    upiId: "",
    isCurrentUser: false,
  };

  friends.push(newFriend);

  // =========================================
  // ADD FRIEND TO EXISTING FOOD ITEMS
  // =========================================

  cart.forEach((item) => {
    normalizeItemAssignments(item);

    if (!item.assignments[newFriend.id]) {
      item.assignments[newFriend.id] = 0;
    }
  });

  console.log("Friend added:", newFriend);

  updateFoodPage();
  closeFriendModalBox();
}

/* =========================================
   REMOVE FRIEND
========================================= */

function removeFriend(friendId) {
  const friend = friends.find((item) => item.id === friendId);

  if (!friend || friend.isCurrentUser) {
    return;
  }

  /*
    Move this friend's food quantities
    back to the current user.
  */

  cart.forEach((item) => {
    normalizeItemAssignments(item);

    const friendQuantity = getAssignedQuantity(item, friendId);

    if (friendQuantity > 0) {
      item.assignments["current-user"] =
        (item.assignments["current-user"] || 0) + friendQuantity;
    }

    delete item.assignments[friendId];

    normalizeItemAssignments(item);
  });

  friends = friends.filter((item) => item.id !== friendId);

  updateFoodPage();
}

/* =========================================
   RENDER FRIENDS / BILL SPLIT
========================================= */

function renderFriends() {
  const friendBillList = document.getElementById("friendBillList");

  if (!friendBillList) {
    return;
  }

  if (cart.length === 0) {
    friendBillList.innerHTML = `
      <div class="no-split-items">
        Add food items and assign them to your friends.
      </div>
    `;

    return;
  }

  friendBillList.innerHTML = "";

  let hasAssignedFood = false;

  friends.forEach((friend) => {
    const total = getFriendTotal(friend.id);

    if (total <= 0) {
      return;
    }

    hasAssignedFood = true;

    const billItem = document.createElement("div");

    billItem.className = "friend-bill-item";

    billItem.innerHTML = `
      <div class="friend-bill-person">

        <span class="friend-bill-avatar">
          ${friend.isCurrentUser ? "👤" : "👥"}
        </span>

        <div>
          <strong>${escapeHTML(friend.name)}</strong>

          <span>
            ${
              friend.isCurrentUser
                ? "Your food"
                : `Food assigned to ${escapeHTML(friend.name)}`
            }
          </span>
        </div>

      </div>

      <div class="friend-bill-right">

        <strong class="friend-bill-total">
          ${formatCurrency(total)}
        </strong>

        ${
          !friend.isCurrentUser
            ? `
              <button
                type="button"
                class="remove-friend-button"
                data-remove-friend="${friend.id}"
                aria-label="Remove ${escapeHTML(friend.name)}"
              >
                ×
              </button>
            `
            : ""
        }

      </div>
    `;

    friendBillList.appendChild(billItem);
  });

  if (!hasAssignedFood) {
    friendBillList.innerHTML = `
      <div class="no-split-items">
        Assign food quantities to your friends to see their bills.
      </div>
    `;
  }

  document.querySelectorAll("[data-remove-friend]").forEach((button) => {
    button.addEventListener("click", () => {
      removeFriend(button.dataset.removeFriend);
    });
  });
}

/* =========================================
   GET FRIEND TOTAL
========================================= */

function getFriendTotal(friendId) {
  return cart.reduce((total, item) => {
    const quantity = getAssignedQuantity(item, friendId);

    return total + (Number(item.price) || 0) * quantity;
  }, 0);
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

    if (!booking || typeof booking !== "object") {
      throw new Error("Invalid booking data");
    }

    loadFriends();

    if (Array.isArray(booking.foodOrder)) {
      cart = booking.foodOrder
        .map((item) => {
          const normalizedItem = {
            ...item,
            price: Number(item.price) || 0,
            quantity: Number(item.quantity) || 1,
          };

          /*
            Support both:
            1. New assignments system
            2. Old assignedTo system
          */

          if (item.assignments && typeof item.assignments === "object") {
            normalizedItem.assignments = {
              ...item.assignments,
            };
          } else {
            normalizedItem.assignments = {
              [item.assignedTo || "current-user"]: normalizedItem.quantity,
            };
          }

          normalizeItemAssignments(normalizedItem);

          return normalizedItem;
        })
        .filter((item) => item.quantity > 0);
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

  if (moviePoster) {
    const poster = booking.moviePoster || booking.poster || booking.image || "";

    if (poster) {
      moviePoster.src = poster;
    } else {
      moviePoster.style.display = "none";
    }
  }

  if (showDetails) {
    const theatre = booking.theatreName || "Theatre";

    const date = formatDate(booking.date);

    const time = booking.showTime || booking.time || "";

    const seats = getSelectedSeats();

    const details = [theatre, date, time].filter(Boolean);

    if (seats.length > 0) {
      details.push(`Seats: ${seats.join(", ")}`);
    }

    showDetails.textContent = details.join(" • ");
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

      categoryButtons.forEach((item) => {
        item.classList.remove("active");
      });

      button.classList.add("active");

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

  const filteredFood =
    selectedCategory === "all"
      ? foodMenu
      : foodMenu.filter((food) => food.category === selectedCategory);

  foodGrid.innerHTML = "";

  filteredFood.forEach((food) => {
    const quantity = getCartQuantity(food.id);

    const card = document.createElement("div");

    card.className = "food-card";

    card.innerHTML = `
      <div class="food-image">
        <img
          src="${food.image}"
          alt="${escapeHTML(food.name)}"
          loading="lazy"
        />
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

        <h3>${escapeHTML(food.name)}</h3>

        <p>
          ${escapeHTML(food.description)}
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
                  Add <span>+</span>
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

                  <strong>${quantity}</strong>

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

  setupFoodButtons();
}

/* =========================================
   SETUP FOOD BUTTONS
========================================= */

function setupFoodButtons() {
  document.querySelectorAll("[data-add]").forEach((button) => {
    button.addEventListener("click", () => {
      addFood(button.dataset.add);
    });
  });

  document.querySelectorAll("[data-increase]").forEach((button) => {
    button.addEventListener("click", () => {
      changeFoodQuantity(button.dataset.increase, 1);
    });
  });

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

  if (existingItem) {
    existingItem.quantity += 1;

    normalizeItemAssignments(existingItem);

    /*
      The newly added quantity belongs
      to the current user by default.
    */

    existingItem.assignments["current-user"] =
      (existingItem.assignments["current-user"] || 0) + 1;
  } else {
    cart.push({
      id: food.id,
      name: food.name,
      category: food.category,
      price: food.price,
      quantity: 1,

      /*
        First quantity belongs to current user.
      */

      assignments: {
        "current-user": 1,
      },
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

  normalizeItemAssignments(cartItem);

  if (change > 0) {
    cartItem.quantity += change;

    /*
      New quantity is assigned to current user.
    */

    cartItem.assignments["current-user"] =
      (cartItem.assignments["current-user"] || 0) + change;
  } else {
    const removeCount = Math.abs(change);

    /*
      Remove from current user's assignment first.
    */

    let remainingToRemove = removeCount;

    const currentUserQuantity = getAssignedQuantity(cartItem, "current-user");

    const removeFromCurrentUser = Math.min(
      currentUserQuantity,
      remainingToRemove,
    );

    if (removeFromCurrentUser > 0) {
      cartItem.assignments["current-user"] -= removeFromCurrentUser;

      remainingToRemove -= removeFromCurrentUser;
    }

    /*
      If current user has no quantity left,
      remove from other assignments.
    */

    if (remainingToRemove > 0) {
      const otherFriendIds = Object.keys(cartItem.assignments).filter(
        (id) => id !== "current-user",
      );

      for (const friendId of otherFriendIds) {
        if (remainingToRemove <= 0) {
          break;
        }

        const friendQuantity = getAssignedQuantity(cartItem, friendId);

        const removeAmount = Math.min(friendQuantity, remainingToRemove);

        cartItem.assignments[friendId] -= removeAmount;

        remainingToRemove -= removeAmount;
      }
    }

    cartItem.quantity -= removeCount;
  }

  if (cartItem.quantity <= 0) {
    cart = cart.filter((item) => item.id !== foodId);
  } else {
    normalizeItemAssignments(cartItem);
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
  renderFriends();
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

  const totalItems = getTotalItemCount();

  if (cartCount) {
    cartCount.textContent = `${totalItems} ${
      totalItems === 1 ? "item" : "items"
    }`;
  }

  if (cart.length === 0) {
    emptyCart.style.display = "block";
    cartItems.innerHTML = "";
    return;
  }

  emptyCart.style.display = "none";
  cartItems.innerHTML = "";

  cart.forEach((item) => {
    normalizeItemAssignments(item);

    const total = Number(item.price) * Number(item.quantity);

    const cartItem = document.createElement("div");

    cartItem.className = "cart-item";

    /*
      Create assignment controls for every friend.
    */

    const assignmentHTML = friends
      .map((friend) => {
        const assignedQuantity = getAssignedQuantity(item, friend.id);

        return `
          <div class="food-assignment-row">

            <div class="food-assignment-person">

              <span class="assignment-avatar">
                ${friend.isCurrentUser ? "👤" : "👥"}
              </span>

              <span>
                ${
                  friend.isCurrentUser
                    ? `${escapeHTML(friend.name)} (You)`
                    : escapeHTML(friend.name)
                }
              </span>

            </div>

            <div class="food-assignment-controls">

              <button
                type="button"
                class="cart-quantity-button"
                data-assignment-decrease="${item.id}"
                data-friend-id="${friend.id}"
              >
                −
              </button>

              <strong>
                ${assignedQuantity}
              </strong>

              <button
                type="button"
                class="cart-quantity-button"
                data-assignment-increase="${item.id}"
                data-friend-id="${friend.id}"
              >
                +
              </button>

            </div>

          </div>
        `;
      })
      .join("");

    const assignedTotal = getAssignmentTotal(item);

    const unassigned = Math.max(Number(item.quantity) - assignedTotal, 0);

    cartItem.innerHTML = `
      <div class="cart-item-main">

        <div class="cart-item-icon">
          🍿
        </div>

        <div class="cart-item-info">

          <h4>
            ${escapeHTML(item.name)}
          </h4>

          <span>
            ${formatCurrency(item.price)} each
          </span>

        </div>

        <button
          class="remove-cart-item"
          type="button"
          data-remove="${item.id}"
        >
          ×
        </button>

      </div>

      <div class="food-owner-section">

        <label>
          Who ordered this?
        </label>

        <div class="food-assignment-list">

          ${assignmentHTML}

        </div>

        ${
          unassigned > 0
            ? `
              <div class="unassigned-food">
                ${unassigned}
                ${unassigned === 1 ? " item" : " items"}
                not assigned
              </div>
            `
            : `
              <div class="all-food-assigned">
                ✓ All items assigned
              </div>
            `
        }

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

  setupCartButtons();
}

/* =========================================
   SETUP CART BUTTONS
========================================= */

function setupCartButtons() {
  document.querySelectorAll("[data-cart-increase]").forEach((button) => {
    button.addEventListener("click", () => {
      changeFoodQuantity(button.dataset.cartIncrease, 1);
    });
  });

  document.querySelectorAll("[data-cart-decrease]").forEach((button) => {
    button.addEventListener("click", () => {
      changeFoodQuantity(button.dataset.cartDecrease, -1);
    });
  });

  document.querySelectorAll("[data-remove]").forEach((button) => {
    button.addEventListener("click", () => {
      removeFood(button.dataset.remove);
    });
  });

  /*
    Assignment + buttons
  */

  document.querySelectorAll("[data-assignment-increase]").forEach((button) => {
    button.addEventListener("click", () => {
      changeFoodAssignment(
        button.dataset.assignmentIncrease,
        button.dataset.friendId,
        1,
      );
    });
  });

  /*
    Assignment - buttons
  */

  document.querySelectorAll("[data-assignment-decrease]").forEach((button) => {
    button.addEventListener("click", () => {
      changeFoodAssignment(
        button.dataset.assignmentDecrease,
        button.dataset.friendId,
        -1,
      );
    });
  });
}

/* =========================================
   TOTAL FOOD ITEMS
========================================= */

function getTotalItemCount() {
  return cart.reduce((total, item) => {
    return total + (Number(item.quantity) || 0);
  }, 0);
}

/* =========================================
   FOOD SUBTOTAL
========================================= */

function calculateFoodSubtotal() {
  return cart.reduce((total, item) => {
    return total + (Number(item.price) || 0) * (Number(item.quantity) || 0);
  }, 0);
}

/* =========================================
   CALCULATE REWARD POINTS
========================================= */

function calculatePoints() {
  return Math.floor(calculateFoodSubtotal() * POINTS_PER_RUPEE);
}

/* =========================================
   UPDATE PRICE INFORMATION
========================================= */

function updatePriceInformation() {
  const subtotal = calculateFoodSubtotal();

  const foodSubtotal = document.getElementById("foodSubtotal");

  const foodTotal = document.getElementById("foodTotal");

  const mobileFoodTotal = document.getElementById("mobileFoodTotal");

  if (foodSubtotal) {
    foodSubtotal.textContent = formatCurrency(subtotal);
  }

  if (foodTotal) {
    foodTotal.textContent = formatCurrency(subtotal);
  }

  if (mobileFoodTotal) {
    mobileFoodTotal.textContent = formatCurrency(subtotal);
  }
}

/* =========================================
   UPDATE REWARD INFORMATION
========================================= */

function updateRewardInformation() {
  const existingPoints = Number(booking?.rewardPoints) || 0;

  const earnedPoints = calculatePoints();

  const totalPoints = existingPoints + earnedPoints;

  const headerPoints = document.getElementById("headerPoints");

  const pointsPreview = document.getElementById("pointsPreview");

  const currentPoints = document.getElementById("currentPoints");

  const rewardProgress = document.getElementById("rewardProgress");

  if (headerPoints) {
    headerPoints.textContent = `${totalPoints} Points`;
  }

  if (pointsPreview) {
    pointsPreview.textContent = `+${earnedPoints}`;
  }

  if (currentPoints) {
    currentPoints.textContent = `${Math.min(
      totalPoints,
      REWARD_TARGET,
    )} / ${REWARD_TARGET} Points`;
  }

  if (rewardProgress) {
    const percentage = Math.min((totalPoints / REWARD_TARGET) * 100, 100);

    rewardProgress.style.width = `${percentage}%`;
  }

  updatePriceInformation();
}

/* =========================================
   UPDATE CONTINUE BUTTONS
========================================= */

function updateContinueButtons() {
  const continueButton = document.getElementById("continueFoodButton");

  const mobileButton = document.getElementById("mobileContinueButton");

  if (continueButton) {
    continueButton.disabled = false;
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
    Normalize all assignments
    before saving.
  */

  cart.forEach((item) => {
    normalizeItemAssignments(item);
  });

  const foodOrder = cart.map((item) => {
    const assignments = {
      ...item.assignments,
    };

    /*
      For backward compatibility:
      if exactly one person owns the complete
      food item, save assignedTo as well.
    */

    const assignmentEntries = Object.entries(assignments).filter(
      ([, quantity]) => Number(quantity) > 0,
    );

    let assignedTo = null;

    if (assignmentEntries.length === 1) {
      assignedTo = assignmentEntries[0][0];
    }

    return {
      id: item.id,
      name: item.name,
      category: item.category,
      price: Number(item.price),
      quantity: Number(item.quantity),
      itemTotal: Number(item.price) * Number(item.quantity),

      /*
        NEW:
        Multiple people can own
        different quantities.
      */

      assignments,

      /*
        Kept for compatibility
        with older code.
      */

      assignedTo,
    };
  });

  const updatedBooking = {
    ...booking,

    foodOrder,

    foodItemCount: getTotalItemCount(),

    foodSubtotal: Number(foodSubtotal.toFixed(2)),

    foodTotal: Number(foodSubtotal.toFixed(2)),

    foodPointsEarned: foodPoints,

    foodOrderStatus: foodOrder.length > 0 ? "PRE_ORDERED" : "NO_FOOD_ORDER",

    friends: friends
      .filter((friend) => !friend.isCurrentUser)
      .map((friend) => ({
        id: friend.id,
        name: friend.name,
        upiId: friend.upiId || "",
      })),

    /*
      Friend-wise bill split.
    */

    foodBillSplit: friends.map((friend) => ({
      friendId: friend.id,

      name: friend.name,

      upiId: friend.isCurrentUser ? null : friend.upiId || null,

      isCurrentUser: friend.isCurrentUser,

      amount: getFriendTotal(friend.id),
    })),
  };

  booking = updatedBooking;

  sessionStorage.setItem(
    "bookItBroFinalBooking",
    JSON.stringify(updatedBooking),
  );

  return updatedBooking;
}

/* =========================================
   CONTINUE TO BOOKING SUMMARY
========================================= */

function continueToBookingSummary() {
  saveFoodOrder();

  window.location.href = "booking-summary.html";
}

/* =========================================
   CONTINUE BUTTONS
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
   ESCAPE HTML
========================================= */

function escapeHTML(value) {
  const div = document.createElement("div");

  div.textContent = value || "";

  return div.innerHTML;
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
    <div
      style="
        min-height:100vh;
        display:flex;
        align-items:center;
        justify-content:center;
        padding:20px;
        text-align:center;
      "
    >
      <div>

        <div style="font-size:52px">
          🍿
        </div>

        <h2>
          Booking Information Not Found
        </h2>

        <p>
          We could not find your booking
          information.
        </p>

        <button
          type="button"
          onclick="history.back()"
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

  displayBookingInformation();

  setupCategories();

  setupFriendSection();

  setupContinueButtons();

  setupBackButton();

  updateFoodPage();
}

/* =========================================
   START
========================================= */
document.addEventListener("DOMContentLoaded", () => {
  initialize();
});
