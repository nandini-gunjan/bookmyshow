/* =====================================================
   BOOKITBRO
   THEATRE / SHOWTIME PAGE
===================================================== */

import { getMovieDetails, formatMovieDetails } from "./tmdb.js";

/* =====================================================
   STATE
===================================================== */

let currentMovie = null;

let selectedDate = null;

let selectedTheatre = null;

let selectedShow = null;

let activeFilter = "all";

/* =====================================================
   DEMO THEATRE DATA
===================================================== */

/*
    IMPORTANT:

    TMDB gives us movie information.

    TMDB does NOT give us:
    - PVR showtimes
    - INOX showtimes
    - theatre seat availability
    - ticket prices

    So this data is temporary.

    Later we can replace this with:
        Firebase
        Your backend
        Another theatre/showtime API
*/

const theatres = [
  {
    id: "th001",

    name: "PVR INOX",

    location: "Phoenix Mall, Pune",

    type: "premium",

    features: ["IMAX", "Dolby Atmos", "Recliner"],

    shows: [
      {
        id: "show001",
        time: "10:30 AM",
        price: 250,
        available: "Available",
      },

      {
        id: "show002",
        time: "1:45 PM",
        price: 280,
        available: "Available",
      },

      {
        id: "show003",
        time: "5:15 PM",
        price: 300,
        available: "Fast Filling",
      },

      {
        id: "show004",
        time: "8:30 PM",
        price: 320,
        available: "Available",
      },
    ],
  },

  {
    id: "th002",

    name: "Cinepolis",

    location: "Seasons Mall, Pune",

    type: "premium",

    features: ["Dolby Atmos", "Recliner", "Premium Seats"],

    shows: [
      {
        id: "show005",
        time: "11:00 AM",
        price: 220,
        available: "Available",
      },

      {
        id: "show006",
        time: "2:30 PM",
        price: 250,
        available: "Available",
      },

      {
        id: "show007",
        time: "6:00 PM",
        price: 290,
        available: "Fast Filling",
      },

      {
        id: "show008",
        time: "9:15 PM",
        price: 310,
        available: "Available",
      },
    ],
  },

  {
    id: "th003",

    name: "City Pride",

    location: "Kothrud, Pune",

    type: "standard",

    features: ["Parking", "Food & Beverages"],

    shows: [
      {
        id: "show009",
        time: "10:00 AM",
        price: 160,
        available: "Available",
      },

      {
        id: "show010",
        time: "1:00 PM",
        price: 180,
        available: "Available",
      },

      {
        id: "show011",
        time: "4:15 PM",
        price: 190,
        available: "Available",
      },

      {
        id: "show012",
        time: "7:30 PM",
        price: 210,
        available: "Fast Filling",
      },
    ],
  },

  {
    id: "th004",

    name: "INOX",

    location: "Amanora Mall, Pune",

    type: "standard",

    features: ["Parking", "Food Court"],

    shows: [
      {
        id: "show013",
        time: "11:30 AM",
        price: 180,
        available: "Available",
      },

      {
        id: "show014",
        time: "3:00 PM",
        price: 200,
        available: "Available",
      },

      {
        id: "show015",
        time: "6:30 PM",
        price: 220,
        available: "Available",
      },

      {
        id: "show016",
        time: "9:45 PM",
        price: 240,
        available: "Fast Filling",
      },
    ],
  },
];

/* =====================================================
   GET MOVIE ID
===================================================== */

function getMovieId() {
  const params = new URLSearchParams(window.location.search);

  return params.get("id");
}

/* =====================================================
   LOAD MOVIE FROM TMDB
===================================================== */

async function loadMovieFromTMDB() {
  const movieId = getMovieId();

  if (!movieId) {
    console.error("Movie ID is missing.");

    return null;
  }

  console.log("Fetching theatre page movie from TMDB:", movieId);

  try {
    const movie = await getMovieDetails(movieId);

    if (!movie) {
      return null;
    }

    return formatMovieDetails(movie);
  } catch (error) {
    console.error("TMDB movie error:", error);

    return null;
  }
}

/* =====================================================
   LOAD NAVBAR
===================================================== */

async function loadNavbar() {
  const navbar = document.getElementById("navbar");

  if (!navbar) {
    return;
  }

  try {
    const response = await fetch("components/navbar.html");

    if (!response.ok) {
      throw new Error("Navbar could not be loaded.");
    }

    navbar.innerHTML = await response.text();
  } catch (error) {
    console.error("Navbar Error:", error);
  }
}

/* =====================================================
   LOAD COMPONENT
===================================================== */

async function loadTheatreComponent() {
  const container = document.getElementById("theatrePage");

  try {
    const response = await fetch("components/theatre-showtime.html");

    if (!response.ok) {
      throw new Error("Theatre component could not be loaded.");
    }

    container.innerHTML = await response.text();

    initializePage();
  } catch (error) {
    console.error("Theatre Component Error:", error);

    container.innerHTML = `

            <div class="page-loading">

                <h2>
                    Unable to load showtimes
                </h2>

                <p>
                    Please try again.
                </p>

            </div>

        `;
  }
}

/* =====================================================
   INITIALIZE
===================================================== */

function initializePage() {
  populateMovie();

  generateDates();

  renderTheatres();

  setupFilters();

  updateBookingBar();
}

/* =====================================================
   POPULATE TMDB MOVIE
===================================================== */

function populateMovie() {
  if (!currentMovie) {
    return;
  }

  setText("showMovieTitle", currentMovie.title);

  setText("showMovieLanguage", currentMovie.language);

  setText("showMovieGenre", currentMovie.genre);

  setText("showMovieDuration", currentMovie.duration);

  setText("showMovieDescription", currentMovie.description);

  const poster = document.getElementById("showMoviePoster");

  if (poster) {
    poster.src = currentMovie.poster || "";

    poster.alt = currentMovie.title;
  }
}

/* =====================================================
   GENERATE DATES
===================================================== */

function generateDates() {
  const dateList = document.getElementById("dateList");

  if (!dateList) {
    return;
  }

  dateList.innerHTML = "";

  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);

    date.setDate(today.getDate() + i);

    const day = date.toLocaleDateString("en-IN", {
      weekday: "short",
    });

    const month = date.toLocaleDateString("en-IN", {
      month: "short",
    });

    const number = date.getDate();

    const value = date.toISOString().split("T")[0];

    const button = document.createElement("button");

    button.className = "date-card";

    button.dataset.date = value;

    if (i === 0) {
      button.classList.add("active");

      selectedDate = value;
    }

    button.innerHTML = `

            <span class="date-day">

                ${i === 0 ? "Today" : day}

            </span>


            <span class="date-number">

                ${number}

            </span>


            <span class="date-month">

                ${month}

            </span>

        `;

    button.addEventListener("click", () => {
      selectDate(value, button);
    });

    dateList.appendChild(button);
  }
}

/* =====================================================
   SELECT DATE
===================================================== */

function selectDate(date, button) {
  selectedDate = date;

  document.querySelectorAll(".date-card").forEach((item) => {
    item.classList.remove("active");
  });

  button.classList.add("active");

  /*
        Later:

        fetch showtimes based on:

        currentMovie.id
        selectedDate
    */

  resetSelection();
}

/* =====================================================
   RENDER THEATRES
===================================================== */

function renderTheatres() {
  const list = document.getElementById("theatreList");

  const count = document.getElementById("theatreCount");

  if (!list) {
    return;
  }

  list.innerHTML = "";

  const filtered = theatres.filter((theatre) => {
    return activeFilter === "all" || theatre.type === activeFilter;
  });

  if (count) {
    count.textContent = `${filtered.length} theatres`;
  }

  if (!filtered.length) {
    list.innerHTML = `

            <div class="no-theatres">

                <h3>
                    No theatres found
                </h3>

                <p>
                    Try another filter.
                </p>

            </div>

        `;

    return;
  }

  filtered.forEach((theatre) => {
    list.appendChild(createTheatreCard(theatre));
  });
}

/* =====================================================
   CREATE THEATRE CARD
===================================================== */

function createTheatreCard(theatre) {
  const card = document.createElement("div");

  card.className = "theatre-card";

  const features = theatre.features
    .map(
      (feature) => `

                    <span class="theatre-feature">

                        ${feature}

                    </span>

                `,
    )
    .join("");

  const showButtons = theatre.shows
    .map(
      (show) => `

                    <button
                        type="button"
                        class="showtime-button"
                        data-theatre-id="${theatre.id}"
                        data-show-id="${show.id}"
                    >

                        ${show.time}


                        <span class="showtime-price">

                            ₹${show.price}

                        </span>


                        <span class="showtime-available">

                            ${show.available}

                        </span>

                    </button>

                `,
    )
    .join("");

  card.innerHTML = `

        <span class="theatre-type ${theatre.type}">

            ${capitalize(theatre.type)}

        </span>


        <h3 class="theatre-name">

            ${theatre.name}

        </h3>


        <div class="theatre-location">

            📍 ${theatre.location}

        </div>


        <div class="theatre-features">

            ${features}

        </div>


        <div class="showtime-area">

            <div class="showtime-heading">

                Available showtimes

            </div>


            <div class="showtime-list">

                ${showButtons}

            </div>

        </div>

    `;

  card.querySelectorAll(".showtime-button").forEach((button) => {
    button.addEventListener("click", () => {
      selectShow(theatre, button.dataset.showId, button);
    });
  });

  return card;
}

/* =====================================================
   SELECT SHOW
===================================================== */

function selectShow(theatre, showId, button) {
  const show = theatre.shows.find((item) => item.id === showId);

  if (!show) {
    return;
  }

  selectedTheatre = theatre;

  selectedShow = show;

  document.querySelectorAll(".showtime-button").forEach((item) => {
    item.classList.remove("selected");
  });

  button.classList.add("selected");

  updateBookingBar();
}

/* =====================================================
   BOOKING BAR
===================================================== */

function updateBookingBar() {
  const theatreName = document.getElementById("selectedTheatreName");

  const showTime = document.getElementById("selectedShowTime");

  const button = document.getElementById("continueButton");

  if (!theatreName || !showTime || !button) {
    return;
  }

  if (selectedTheatre && selectedShow) {
    theatreName.textContent = selectedTheatre.name;

    showTime.textContent = `${selectedShow.time} • ₹${selectedShow.price}`;

    button.disabled = false;

    button.textContent = "Select Seats";
  } else {
    theatreName.textContent = "Select a showtime";

    showTime.textContent = "Choose your theatre and show";

    button.disabled = true;

    button.textContent = "Select Showtime";
  }
}

/* =====================================================
   RESET SELECTION
===================================================== */

function resetSelection() {
  selectedTheatre = null;

  selectedShow = null;

  document.querySelectorAll(".showtime-button").forEach((button) => {
    button.classList.remove("selected");
  });

  updateBookingBar();
}

/* =====================================================
   FILTERS
===================================================== */

function setupFilters() {
  document.querySelectorAll(".filter-button[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;

      document
        .querySelectorAll(".filter-button[data-filter]")
        .forEach((item) => {
          item.classList.remove("active");
        });

      button.classList.add("active");

      resetSelection();

      renderTheatres();
    });
  });

  const priceButton = document.getElementById("sortPriceButton");

  if (priceButton) {
    priceButton.addEventListener("click", sortByPrice);
  }

  const continueButton = document.getElementById("continueButton");

  if (continueButton) {
    continueButton.addEventListener("click", continueToSeats);
  }
}

/* =====================================================
   SORT PRICE
===================================================== */

function sortByPrice() {
  theatres.forEach((theatre) => {
    theatre.shows.sort((a, b) => a.price - b.price);
  });

  renderTheatres();
}

/* =====================================================
   CONTINUE TO SEATS
===================================================== */

function continueToSeats() {
  if (!currentMovie || !selectedTheatre || !selectedShow || !selectedDate) {
    return;
  }

  const bookingData = {
    movieId: currentMovie.id,

    movieTitle: currentMovie.title,

    moviePoster: currentMovie.poster,

    date: selectedDate,

    theatreId: selectedTheatre.id,

    theatreName: selectedTheatre.name,

    theatreLocation: selectedTheatre.location,

    showId: selectedShow.id,

    showTime: selectedShow.time,

    ticketPrice: selectedShow.price,
  };

  sessionStorage.setItem("bookItBroBooking", JSON.stringify(bookingData));

  /*
        NEXT PAGE:

        seat-selection.html

    */

  window.location.href = `seat-selection.html?id=${encodeURIComponent(currentMovie.id)}`;
}

/* =====================================================
   HELPERS
===================================================== */

function setText(elementId, value) {
  const element = document.getElementById(elementId);

  if (element) {
    element.textContent = value || "";
  }
}

function capitalize(value) {
  if (!value) {
    return "";
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

/* =====================================================
   START
===================================================== */

async function startPage() {
  await loadNavbar();

  /*
        1. Get movie from TMDB
    */

  currentMovie = await loadMovieFromTMDB();

  if (!currentMovie) {
    const page = document.getElementById("theatrePage");

    page.innerHTML = `

            <div class="page-loading">

                <h2>
                    Movie not found
                </h2>

                <p>
                    Please go back and select a movie.
                </p>

            </div>

        `;

    return;
  }

  /*
        2. Load theatre component
    */

  await loadTheatreComponent();
}

startPage();
