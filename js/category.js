// =========================================
// CATEGORY PAGE
// =========================================

// =========================================
// CATEGORY CONFIGURATION
// =========================================

const categoryData = {
  // =======================================
  // MOVIES
  // =======================================

  movies: {
    title: "Recommended Movies",

    subtitle: "Explore the latest and most popular movies",

    heroTitle: "Discover Movies",

    heroDescription: "Book tickets for the latest movies playing near you.",

    languages: ["All", "Hindi", "English", "Marathi", "Tamil", "Telugu"],

    items: [
      {
        title: "Saiyaara",
        language: "Hindi",
        rating: "8.2",
        genre: "Romance, Drama",
        image: "https://image.tmdb.org/t/p/w500/saiyaara.jpg",
      },

      {
        title: "Mission Impossible",
        language: "English",
        rating: "8.1",
        genre: "Action, Thriller",
        image: "https://image.tmdb.org/t/p/w500/mission.jpg",
      },

      {
        title: "Thudarum",
        language: "Malayalam",
        rating: "8.0",
        genre: "Drama, Thriller",
        image: "https://image.tmdb.org/t/p/w500/thudarum.jpg",
      },

      {
        title: "Housefull 5",
        language: "Hindi",
        rating: "7.4",
        genre: "Comedy",
        image: "https://image.tmdb.org/t/p/w500/housefull.jpg",
      },

      {
        title: "Marathi Movie",
        language: "Marathi",
        rating: "8.0",
        genre: "Drama",
        image: "https://image.tmdb.org/t/p/w500/marathi.jpg",
      },
    ],
  },

  // =======================================
  // STREAM
  // =======================================

  stream: {
    title: "Stream",

    subtitle: "Watch movies, shows and exclusive content online",

    heroTitle: "Entertainment at Your Fingertips",

    heroDescription: "Stream movies and shows from the comfort of your home.",

    languages: ["All", "Hindi", "English", "Tamil", "Telugu"],

    items: [
      {
        title: "The Last of Us",
        language: "English",
        rating: "8.7",
        genre: "Drama, Thriller",
        image: "https://image.tmdb.org/t/p/w500/stream1.jpg",
      },

      {
        title: "Special Ops",
        language: "Hindi",
        rating: "8.2",
        genre: "Action, Thriller",
        image: "https://image.tmdb.org/t/p/w500/stream2.jpg",
      },

      {
        title: "The Family Man",
        language: "Hindi",
        rating: "8.4",
        genre: "Drama, Action",
        image: "https://image.tmdb.org/t/p/w500/stream3.jpg",
      },
    ],
  },

  // =======================================
  // EVENTS
  // =======================================

  events: {
    title: "Events",

    subtitle: "Discover exciting events happening near you",

    heroTitle: "Experience Something New",

    heroDescription: "Find concerts, festivals, workshops and more.",

    languages: ["All", "Hindi", "English", "Marathi"],

    items: [
      {
        title: "Live Music Concert",
        language: "English",
        rating: "4.7",
        genre: "Music",
        image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a",
      },

      {
        title: "Comedy Night",
        language: "Hindi",
        rating: "4.6",
        genre: "Comedy",
        image: "https://images.unsplash.com/photo-1527224857830-43a7acc85260",
      },

      {
        title: "Music Festival",
        language: "English",
        rating: "4.8",
        genre: "Festival",
        image: "https://images.unsplash.com/photo-1506157786151-b8491531f063",
      },
    ],
  },

  // =======================================
  // PLAYS
  // =======================================

  plays: {
    title: "Plays",

    subtitle: "Experience theatre and live performances",

    heroTitle: "Theatre Comes Alive",

    heroDescription: "Discover amazing plays and live performances.",

    languages: ["All", "Hindi", "English", "Marathi"],

    items: [
      {
        title: "And Then There Were None",
        language: "English",
        rating: "4.8",
        genre: "Drama",
        image: "https://images.unsplash.com/photo-1503095396549-807759245b35",
      },

      {
        title: "Marathi Natak",
        language: "Marathi",
        rating: "4.7",
        genre: "Drama",
        image: "https://images.unsplash.com/photo-1514306191717-452ec28c7814",
      },
    ],
  },

  // =======================================
  // SPORTS
  // =======================================

  sports: {
    title: "Sports",

    subtitle: "Book tickets for live sporting events",

    heroTitle: "Feel the Game",

    heroDescription: "Experience the excitement of live sports.",

    languages: ["All", "Cricket", "Football", "Tennis"],

    items: [
      {
        title: "Cricket Match",
        language: "Cricket",
        rating: "4.9",
        genre: "Cricket",
        image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da",
      },

      {
        title: "Football Championship",
        language: "Football",
        rating: "4.8",
        genre: "Football",
        image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55",
      },

      {
        title: "Tennis Championship",
        language: "Tennis",
        rating: "4.7",
        genre: "Tennis",
        image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8",
      },
    ],
  },

  // =======================================
  // ACTIVITIES
  // =======================================

  activities: {
    title: "Activities",

    subtitle: "Fun experiences and activities for everyone",

    heroTitle: "Discover Amazing Experiences",

    heroDescription: "Find exciting activities and experiences around you.",

    languages: ["All", "Family", "Adventure", "Kids"],

    items: [
      {
        title: "Adventure Park",
        language: "Adventure",
        rating: "4.8",
        genre: "Adventure",
        image: "https://images.unsplash.com/photo-1530789253388-582c481c54b0",
      },

      {
        title: "Kids Activity Zone",
        language: "Kids",
        rating: "4.6",
        genre: "Kids",
        image: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368",
      },
    ],
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

function initializeCategoryPage(category = "movies") {
  console.log("Initializing category:", category);

  currentCategory = category;

  const data = categoryData[category];

  if (!data) {
    console.error(`Category "${category}" does not exist.`);

    return;
  }

  currentItems = data.items;

  // ---------------------------------------
  // UPDATE TEXT
  // ---------------------------------------

  updateCategoryText(data);

  // ---------------------------------------
  // UPDATE LANGUAGES
  // ---------------------------------------

  updateLanguageFilters(data.languages);

  // ---------------------------------------
  // RENDER ITEMS
  // ---------------------------------------

  renderCategoryItems(currentItems);

  // ---------------------------------------
  // INITIALIZE FILTERS
  // ---------------------------------------

  initializeLanguageFilters();

  // ---------------------------------------
  // INITIALIZE CAROUSEL
  // ---------------------------------------

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
          ${item.genre}
        </p>

      </div>

    `;

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
// EXPORT
// =========================================

export { initializeCategoryPage };
