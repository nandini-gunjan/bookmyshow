/* =====================================================
   BOOKITBRO - MOVIE DETAILS
===================================================== */

import { getMovieDetails, formatMovieDetails } from "./tmdb.js";
import { auth } from "./firebase.js";

/* =========================================
   DEMO DATA
=========================================

   This is temporary.

   Later we will replace getMovie()
   with your Movie API.

========================================= */

const demoMovie = {
  id: "demo-001",

  title: "Kalki 2898 AD",

  poster: "https://image.tmdb.org/t/p/w500/1D7Q2hN5r9fL5vK5M7s0W7Z7b7M.jpg",

  backdrop:
    "https://image.tmdb.org/t/p/original/1D7Q2hN5r9fL5vK5M7s0W7Z7b7M.jpg",

  rating: 8.5,

  votes: "125K",

  certificate: "UA",

  duration: "3h 1m",

  language: "Hindi",

  genre: "Action, Sci-Fi, Adventure",

  description:
    "A futuristic epic adventure set in a world where humanity fights for survival.",

  about:
    "This is temporary movie information. Later this section will be populated dynamically using movie API data.",

  trailer: "https://www.youtube.com/embed/kQDd1AhGIHk",

  cast: [
    {
      name: "Prabhas",
      role: "Bhairava",
      image: "https://via.placeholder.com/105",
    },

    {
      name: "Deepika Padukone",
      role: "Sumathi",
      image: "https://via.placeholder.com/105",
    },

    {
      name: "Amitabh Bachchan",
      role: "Ashwatthama",
      image: "https://via.placeholder.com/105",
    },

    {
      name: "Kamal Haasan",
      role: "Yaskin",
      image: "https://via.placeholder.com/105",
    },
  ],

  crew: [
    {
      name: "Nag Ashwin",
      role: "Director",
    },

    {
      name: "C. Ashwini Dutt",
      role: "Producer",
    },

    {
      name: "Santhosh Narayanan",
      role: "Music Director",
    },
  ],
};

/* =========================================
   GET MOVIE ID
========================================= */

function getMovieId() {
  const params = new URLSearchParams(window.location.search);

  return params.get("id");
}

// =========================================
// GET MOVIE
// =========================================

async function getMovie(movieId) {
  if (!movieId) {
    console.error("Movie ID is missing.");

    return null;
  }

  console.log("Fetching movie from TMDB:", movieId);

  const movieData = await getMovieDetails(movieId);

  if (!movieData) {
    return null;
  }

  return formatMovieDetails(movieData);
}

/* =========================================
   LOAD COMPONENT
========================================= */

async function loadMovieDetails() {
  const container = document.getElementById("movieDetailsContainer");

  if (!container) {
    console.error("Movie details container not found.");

    return;
  }

  try {
    /*
         ==========================================
         GET MOVIE ID
         ==========================================
        */

    const movieId = getMovieId();

    /*
         ==========================================
         GET MOVIE DATA
         ==========================================
        */

    const movie = await getMovie(movieId);

    if (!movie) {
      showMovieNotFound();

      return;
    }

    /*
         ==========================================
         LOAD COMPONENT
         ==========================================
        */

    const response = await fetch("components/movie-details.html");

    if (!response.ok) {
      throw new Error("Movie details component could not be loaded.");
    }

    const componentHTML = await response.text();

    container.innerHTML = componentHTML;

    /*
         ==========================================
         POPULATE
         ==========================================
        */

    populateMovie(movie);
  } catch (error) {
    console.error("Movie Details Error:", error);

    container.innerHTML = `

            <div class="movie-details-loading">

                <h2>
                    Unable to load movie
                </h2>

                <p>
                    Please try again.
                </p>

            </div>

        `;
  }
}

/* =========================================
   POPULATE MOVIE
========================================= */

function populateMovie(movie) {
  /* =====================================
       TITLE
    ===================================== */

  setText("movieTitle", movie.title);

  /* =====================================
       RATING
    ===================================== */

  setText("movieRating", movie.rating);

  setText("movieVotes", movie.votes);

  /* =====================================
       META
    ===================================== */

  setText("movieCertificate", movie.certificate);

  setText("movieDuration", movie.duration);

  setText("movieLanguage", movie.language);

  setText("movieGenre", movie.genre);

  /* =====================================
       DESCRIPTION
    ===================================== */

  setText("movieDescription", movie.description);

  setText("movieAbout", movie.about);

  /* =====================================
       POSTER
    ===================================== */

  const poster = document.getElementById("moviePoster");

  if (poster) {
    poster.src = movie.poster;

    poster.alt = movie.title;
  }

  /* =====================================
       BACKDROP
    ===================================== */

  const backdrop = document.getElementById("movieBackdrop");

  if (backdrop) {
    backdrop.style.setProperty("--movie-backdrop", `url("${movie.backdrop}")`);
  }

  /* =====================================
       TRAILER
    ===================================== */

  const trailer = document.getElementById("movieTrailer");

  if (trailer && movie.trailer) {
    trailer.src = movie.trailer;
  }

  /* =====================================
       CAST
    ===================================== */

  renderCast(movie.cast);

  /* =====================================
       CREW
    ===================================== */

  renderCrew(movie.crew);

  /* =====================================
       BUTTONS
    ===================================== */

  setupBookButtons(movie);

  setupTrailerButton();
}

/* =========================================
   SET TEXT
========================================= */

function setText(elementId, value) {
  const element = document.getElementById(elementId);

  if (!element) {
    return;
  }

  element.textContent = value ?? "";
}

/* =========================================
   CAST
========================================= */

function renderCast(cast = []) {
  const grid = document.getElementById("movieCastGrid");

  if (!grid) {
    return;
  }

  grid.innerHTML = "";

  if (!cast.length) {
    grid.innerHTML = `
            <p>No cast information available.</p>
        `;

    return;
  }

  cast.forEach((person) => {
    const card = document.createElement("div");

    card.className = "movie-cast-card";

    card.innerHTML = `

                <img
                    class="movie-cast-image"
                    src="${person.image || "https://via.placeholder.com/105"}"
                    alt="${person.name}"
                >

                <div class="movie-cast-name">
                    ${person.name}
                </div>

                <div class="movie-cast-role">
                    ${person.role || ""}
                </div>

            `;

    grid.appendChild(card);
  });
}

/* =========================================
   CREW
========================================= */

function renderCrew(crew = []) {
  const grid = document.getElementById("movieCrewGrid");

  if (!grid) {
    return;
  }

  grid.innerHTML = "";

  if (!crew.length) {
    grid.innerHTML = `
            <p>No crew information available.</p>
        `;

    return;
  }

  crew.forEach((person) => {
    const card = document.createElement("div");

    card.className = "movie-crew-card";

    card.innerHTML = `

                <div class="movie-crew-name">
                    ${person.name}
                </div>

                <div class="movie-crew-role">
                    ${person.role || ""}
                </div>

            `;

    grid.appendChild(card);
  });
}

/* =========================================
   BOOK BUTTONS
========================================= */

function setupBookButtons(movie) {
  const buttons = [
    document.getElementById("bookTicketButton"),

    document.getElementById("bottomBookButton"),
  ];

  buttons.forEach((button) => {
    if (!button) {
      return;
    }

    button.addEventListener("click", () => {
      if (!auth.currentUser) {
        alert("Please sign in first to book tickets.");
        return;
      }
      window.location.href = `theatre-showtime.html?id=${encodeURIComponent(movie.id)}`;
    });
  });
}

/* =========================================
   TRAILER BUTTON
========================================= */

function setupTrailerButton() {
  const button = document.getElementById("watchTrailerButton");

  if (!button) {
    return;
  }

  button.addEventListener("click", () => {
    const section = document.getElementById("trailerSection");

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
      });
    }
  });
}

/* =========================================
   MOVIE NOT FOUND
========================================= */

function showMovieNotFound() {
  const container = document.getElementById("movieDetailsContainer");

  container.innerHTML = `

        <div class="movie-details-loading">

            <h2>
                Movie not found
            </h2>

            <p>
                The requested movie could not be found.
            </p>

            <button
                class="movie-book-button"
                id="goBackButton"
            >
                Go Back
            </button>

        </div>

    `;

  document
    .getElementById("goBackButton")
    ?.addEventListener("click", () => history.back());
}

/* =========================================
   START
========================================= */

loadMovieDetails();
