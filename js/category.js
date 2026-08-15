// =========================================
// CATEGORY PAGE
// =========================================

import { getMovies } from "./tmdb.js";

// =========================================
// CATEGORY DATA
// =========================================

const categoryData = {
  movies: {
    title: "Recommended Movies",

    subtitle: "Explore the latest and most popular movies",

    heroTitle: "Discover Movies",

    heroDescription: "Book tickets for the latest movies playing near you.",

    languages: ["All", "Hindi", "English", "Marathi", "Tamil", "Telugu"],

    items: [],
  },

  stream: {
    title: "Stream",

    subtitle: "Watch movies, shows and exclusive content online",

    heroTitle: "Entertainment at Your Fingertips",

    heroDescription: "Stream movies and shows from the comfort of your home.",

    languages: ["All", "Hindi", "English", "Tamil", "Telugu"],

    items: [],
  },

  events: {
    title: "Events",

    subtitle: "Discover exciting events happening near you",

    heroTitle: "Experience Something New",

    heroDescription: "Find concerts, festivals, workshops and more.",

    languages: ["All", "Hindi", "English", "Marathi"],

    items: [],
  },

  plays: {
    title: "Plays",

    subtitle: "Experience theatre and live performances",

    heroTitle: "Theatre Comes Alive",

    heroDescription: "Discover amazing plays and live performances.",

    languages: ["All", "Hindi", "English", "Marathi"],

    items: [],
  },

  sports: {
    title: "Sports",

    subtitle: "Book tickets for live sporting events",

    heroTitle: "Feel the Game",

    heroDescription: "Experience the excitement of live sports.",

    languages: ["All", "Cricket", "Football", "Tennis"],

    items: [],
  },

  activities: {
    title: "Activities",

    subtitle: "Fun experiences and activities for everyone",

    heroTitle: "Discover Amazing Experiences",

    heroDescription: "Find exciting activities and experiences around you.",

    languages: ["All", "Family", "Adventure", "Kids"],

    items: [],
  },
};

// =========================================
// CURRENT CATEGORY
// =========================================

let currentCategory = "movies";

let currentItems = [];

// =========================================
// INITIALIZE CATEGORY PAGE
// =========================================

async function initializeCategoryPage(category = "movies") {
  currentCategory = category;

  const data = categoryData[category];

  if (!data) {
    console.error(`Category "${category}" does not exist.`);

    return;
  }

  // =======================================
  // MOVIES
  // =======================================

  if (category === "movies") {
    showCategoryLoading();

    const movies = await getMovies();

    currentItems = movies;
  } else {
    // =====================================
    // OTHER CATEGORIES
    // =====================================

    currentItems = data.items || [];
  }

  // =======================================
  // UPDATE TEXT
  // =======================================

  updateCategoryText(data);

  // =======================================
  // UPDATE LANGUAGES
  // =======================================

  updateLanguageFilters(data.languages);

  // =======================================
  // RENDER ITEMS
  // =======================================

  renderCategoryItems(currentItems);

  // =======================================
  // INITIALIZE FILTERS
  // =======================================

  initializeLanguageFilters();

  // =======================================
  // INITIALIZE CAROUSEL
  // =======================================

  initializeCarousel();
}

// =========================================
// UPDATE CATEGORY TEXT
// =========================================

function updateCategoryText(data) {
  const title = document.getElementById("categoryTitle");

  const subtitle = document.getElementById("categorySubtitle");

  const heroTitle = document.getElementById("categoryHeroTitle");

  const heroDescription = document.getElementById("categoryHeroDescription");

  if (title) {
    title.textContent = data.title;
  }

  if (subtitle) {
    subtitle.textContent = data.subtitle;
  }

  if (heroTitle) {
    heroTitle.textContent = data.heroTitle;
  }

  if (heroDescription) {
    heroDescription.textContent = data.heroDescription;
  }
}

// =========================================
// UPDATE LANGUAGE FILTERS
// =========================================

function updateLanguageFilters(languages) {
  const container = document.querySelector(".language-filters");

  if (!container) {
    return;
  }

  container.innerHTML = "";

  languages.forEach((language, index) => {
    const button = document.createElement("button");

    button.className = "language-btn";

    if (index === 0) {
      button.classList.add("active");
    }

    button.dataset.language = language.toLowerCase();

    button.textContent = language;

    container.appendChild(button);
  });
}

// =========================================
// RENDER CATEGORY ITEMS
// =========================================

function renderCategoryItems(items) {
  const grid = document.getElementById("categoryGrid");

  const noResults = document.getElementById("noResults");

  if (!grid) {
    return;
  }

  grid.innerHTML = "";

  // ---------------------------------------
  // NO RESULTS
  // ---------------------------------------

  if (!items || items.length === 0) {
    grid.style.display = "none";

    if (noResults) {
      noResults.style.display = "block";
    }

    return;
  }

  grid.style.display = "grid";

  if (noResults) {
    noResults.style.display = "none";
  }

  // ---------------------------------------
  // CREATE CARDS
  // ---------------------------------------

  items.forEach((item) => {
    const card = document.createElement("article");

    card.className = "content-card";

    card.innerHTML = `
    
    <div class="card-image">

      <img
        src="${item.image}"
        alt="${item.title}"
        loading="lazy"
      />

      <div class="card-rating">
        ⭐ ${item.rating}
      </div>

    </div>


    <div class="card-details">

      <h3 class="card-title">
        ${item.title}
      </h3>

      <p class="card-meta">
        ${item.genre || item.language || ""}
      </p>

    </div>

  `;

    // =========================================
    // OPEN MOVIE DETAILS
    // =========================================

    card.addEventListener("click", () => {
      if (!item.id) {
        console.error("Movie ID is missing:", item);

        return;
      }

      window.location.href = `movie-details.html?id=${encodeURIComponent(item.id)}`;
    });

    grid.appendChild(card);
  });
}

// =========================================
// LANGUAGE FILTER
// =========================================

function initializeLanguageFilters() {
  const buttons = document.querySelectorAll(".language-btn");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      // ---------------------------------
      // REMOVE ACTIVE
      // ---------------------------------

      buttons.forEach((btn) => {
        btn.classList.remove("active");
      });

      // ---------------------------------
      // ADD ACTIVE
      // ---------------------------------

      button.classList.add("active");

      // ---------------------------------
      // GET LANGUAGE
      // ---------------------------------

      const language = button.dataset.language;

      // ---------------------------------
      // ALL
      // ---------------------------------

      if (language === "all") {
        renderCategoryItems(currentItems);

        return;
      }

      // ---------------------------------
      // FILTER
      // ---------------------------------

      const filteredItems = currentItems.filter((item) => {
        return item.language.toLowerCase() === language;
      });

      renderCategoryItems(filteredItems);
    });
  });
}

// =========================================
// CAROUSEL
// =========================================

function initializeCarousel() {
  const slides = document.querySelectorAll(".hero-slide");

  const indicators = document.querySelectorAll(".carousel-indicator");

  const previous = document.querySelector(".carousel-prev");

  const next = document.querySelector(".carousel-next");

  if (slides.length === 0 || indicators.length === 0) {
    return;
  }

  let currentSlide = 0;

  // ---------------------------------------
  // SHOW SLIDE
  // ---------------------------------------

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });

    indicators.forEach((indicator, i) => {
      indicator.classList.toggle("active", i === index);
    });
  }

  // ---------------------------------------
  // NEXT
  // ---------------------------------------

  if (next) {
    next.addEventListener("click", () => {
      currentSlide++;

      if (currentSlide >= slides.length) {
        currentSlide = 0;
      }

      showSlide(currentSlide);
    });
  }

  // ---------------------------------------
  // PREVIOUS
  // ---------------------------------------

  if (previous) {
    previous.addEventListener("click", () => {
      currentSlide--;

      if (currentSlide < 0) {
        currentSlide = slides.length - 1;
      }

      showSlide(currentSlide);
    });
  }

  // ---------------------------------------
  // INDICATORS
  // ---------------------------------------

  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => {
      currentSlide = index;

      showSlide(currentSlide);
    });
  });
}

// =========================================
// CATEGORY LOADING
// =========================================

function showCategoryLoading() {
  const grid = document.getElementById("categoryGrid");

  if (!grid) {
    return;
  }

  grid.style.display = "grid";

  grid.innerHTML = `

    <div class="category-loading">

      <div class="loading-spinner"></div>

      <p>
        Loading movies...
      </p>

    </div>

  `;
}

// =========================================
// EXPORT
// =========================================

export { initializeCategoryPage };
