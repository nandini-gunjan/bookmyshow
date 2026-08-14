// =========================================
// CATEGORY PAGE
// =========================================


// =========================================
// CATEGORY CONFIGURATION
// =========================================

const categoryConfig = {

  movies: {

    title: "Movies in Mumbai",

    description:
      "Book tickets for the latest movies playing near you.",

    heading: "Recommended Movies",

    carousel: [
      {
        title: "Latest Movies",
        description:
          "Discover the latest movies and book your tickets.",
        image:
          "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba"
      },

      {
        title: "Blockbuster Movies",
        description:
          "Experience the biggest movies on the big screen.",
        image:
          "https://images.unsplash.com/photo-1485846234645-a62644f84728"
      }
    ]

  },


  stream: {

    title: "Stream",

    description:
      "Watch movies, shows and entertainment from anywhere.",

    heading: "Popular on Stream",

    carousel: [
      {
        title: "Watch Anywhere",
        description:
          "Explore movies and shows available to stream.",
        image:
          "https://images.unsplash.com/photo-1586899028174-e7098604235b"
      },

      {
        title: "Trending Now",
        description:
          "Discover what's trending right now.",
        image:
          "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4"
      }
    ]

  },


  events: {

    title: "Events in Mumbai",

    description:
      "Find the best events happening around you.",

    heading: "Popular Events",

    carousel: [
      {
        title: "Live Events",
        description:
          "Discover concerts, shows and live experiences.",
        image:
          "https://images.unsplash.com/photo-1501386761578-eac5c94b800a"
      },

      {
        title: "Upcoming Events",
        description:
          "Don't miss the events happening near you.",
        image:
          "https://images.unsplash.com/photo-1492684223066-81342ee5ff30"
      }
    ]

  },


  plays: {

    title: "Plays in Mumbai",

    description:
      "Discover theatre performances and live plays.",

    heading: "Popular Plays",

    carousel: [
      {
        title: "Live Theatre",
        description:
          "Experience stories brought to life on stage.",
        image:
          "https://images.unsplash.com/photo-1503095396549-807759245b35"
      }
    ]

  },


  sports: {

    title: "Sports in Mumbai",

    description:
      "Book tickets for exciting sporting events.",

    heading: "Popular Sports",

    carousel: [
      {
        title: "Live Sports",
        description:
          "Experience your favourite sports live.",
        image:
          "https://images.unsplash.com/photo-1461896836934-ffe607ba8211"
      }
    ]

  },


  activities: {

    title: "Activities in Mumbai",

    description:
      "Discover exciting activities and experiences.",

    heading: "Popular Activities",

    carousel: [
      {
        title: "Things To Do",
        description:
          "Find exciting activities and experiences around you.",
        image:
          "https://images.unsplash.com/photo-1530789253388-582c481c54b0"
      }
    ]

  }

};


// =========================================
// TEMPORARY CARD DATA
// =========================================

const sampleCards = [

  {
    title: "Sample Movie One",
    image:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba",
    language: "Hindi",
    genre: "Action",
    rating: "8.2"
  },

  {
    title: "Sample Movie Two",
    image:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728",
    language: "English",
    genre: "Drama",
    rating: "7.9"
  },

  {
    title: "Sample Movie Three",
    image:
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c",
    language: "Hindi",
    genre: "Comedy",
    rating: "8.5"
  },

  {
    title: "Sample Movie Four",
    image:
      "https://images.unsplash.com/photo-1514306191717-452ec28c7814",
    language: "English",
    genre: "Thriller",
    rating: "7.8"
  }

];


// =========================================
// CURRENT CATEGORY
// =========================================

let currentCategory = "movies";


// =========================================
// INITIALIZE CATEGORY PAGE
// =========================================

function initializeCategoryPage(category) {

  currentCategory = category;


  const config =
    categoryConfig[category];


  if (!config) {

    console.error(
      `Category configuration not found: ${category}`
    );

    return;

  }


  // =======================================
  // UPDATE TEXT
  // =======================================

  updateCategoryText(config);


  // =======================================
  // CREATE CAROUSEL
  // =======================================

  initializeCarousel(config.carousel);


  // =======================================
  // CREATE FILTERS
  // =======================================

  initializeFilters();


  // =======================================
  // CREATE CARDS
  // =======================================

  renderCards(sampleCards);

}


// =========================================
// UPDATE CATEGORY TEXT
// =========================================

function updateCategoryText(config) {

  const title =
    document.getElementById("categoryTitle");

  const description =
    document.getElementById(
      "categoryDescription"
    );

  const heading =
    document.getElementById("contentHeading");


  if (title) {

    title.textContent =
      config.title;

  }


  if (description) {

    description.textContent =
      config.description;

  }


  if (heading) {

    heading.textContent =
      config.heading;

  }

}


// =========================================
// CAROUSEL
// =========================================

function initializeCarousel(slides) {

  const carousel =
    document.getElementById(
      "categoryCarousel"
    );

  const dots =
    document.getElementById(
      "carouselDots"
    );

  const previous =
    document.getElementById(
      "carouselPrev"
    );

  const next =
    document.getElementById(
      "carouselNext"
    );


  if (!carousel) {
    return;
  }


  carousel.innerHTML = "";

  dots.innerHTML = "";


  // =======================================
  // CREATE SLIDES
  // =======================================

  slides.forEach((slide, index) => {

    const slideElement =
      document.createElement("div");


    slideElement.className =
      "carousel-slide";


    if (index === 0) {

      slideElement.classList.add(
        "active"
      );

    }


    slideElement.innerHTML = `

      <img
        src="${slide.image}"
        alt="${slide.title}"
      >

      <div class="carousel-info">

        <h2>
          ${slide.title}
        </h2>

        <p>
          ${slide.description}
        </p>

      </div>

    `;


    carousel.appendChild(
      slideElement
    );


    // =====================================
    // DOT
    // =====================================

    const dot =
      document.createElement("button");


    dot.className =
      "carousel-dot";


    if (index === 0) {

      dot.classList.add("active");

    }


    dot.addEventListener(
      "click",
      () => {

        showCarouselSlide(index);

      }
    );


    dots.appendChild(dot);

  });


  let currentSlide = 0;


  // =======================================
  // SHOW SLIDE
  // =======================================

  function showCarouselSlide(index) {

    const allSlides =
      carousel.querySelectorAll(
        ".carousel-slide"
      );

    const allDots =
      dots.querySelectorAll(
        ".carousel-dot"
      );


    if (!allSlides.length) {
      return;
    }


    currentSlide =
      (index + allSlides.length) %
      allSlides.length;


    allSlides.forEach(
      (slide, slideIndex) => {

        slide.classList.toggle(
          "active",
          slideIndex === currentSlide
        );

      }
    );


    allDots.forEach(
      (dot, dotIndex) => {

        dot.classList.toggle(
          "active",
          dotIndex === currentSlide
        );

      }
    );

  }


  // =======================================
  // PREVIOUS
  // =======================================

  previous.addEventListener(
    "click",
    () => {

      showCarouselSlide(
        currentSlide - 1
      );

    }
  );


  // =======================================
  // NEXT
  // =======================================

  next.addEventListener(
    "click",
    () => {

      showCarouselSlide(
        currentSlide + 1
      );

    }
  );

}


// =========================================
// FILTERS
// =========================================

function initializeFilters() {

  const languages = [
    "Hindi",
    "English",
    "Marathi",
    "Tamil",
    "Telugu"
  ];


  const genres = [
    "Action",
    "Comedy",
    "Drama",
    "Thriller",
    "Romance"
  ];


  const languageFilter =
    document.getElementById(
      "languageFilter"
    );


  const genreFilter =
    document.getElementById(
      "genreFilter"
    );


  // =======================================
  // LANGUAGE OPTIONS
  // =======================================

  languageFilter.innerHTML = `
    <option value="all">
      All Languages
    </option>
  `;


  languages.forEach((language) => {

    languageFilter.innerHTML += `
      <option value="${language}">
        ${language}
      </option>
    `;

  });


  // =======================================
  // GENRE OPTIONS
  // =======================================

  genreFilter.innerHTML = `
    <option value="all">
      All Genres
    </option>
  `;


  genres.forEach((genre) => {

    genreFilter.innerHTML += `
      <option value="${genre}">
        ${genre}
      </option>
    `;

  });

}


// =========================================
// RENDER CARDS
// =========================================

function renderCards(cards) {

  const grid =
    document.getElementById(
      "categoryGrid"
    );


  const noResults =
    document.getElementById(
      "noResults"
    );


  if (!grid) {
    return;
  }


  grid.innerHTML = "";


  if (!cards.length) {

    noResults.hidden = false;

    return;

  }


  noResults.hidden = true;


  cards.forEach((card) => {

    const cardElement =
      document.createElement("article");


    cardElement.className =
      "category-card";


    cardElement.innerHTML = `

      <div class="card-image">

        <img
          src="${card.image}"
          alt="${card.title}"
          loading="lazy"
        >

      </div>


      <div class="card-info">

        <h3 class="card-title">
          ${card.title}
        </h3>


        <div class="card-meta">

          <span>
            ${card.language}
          </span>

          <span>•</span>

          <span>
            ${card.genre}
          </span>

        </div>


        <div class="card-rating">

          ★ ${card.rating}

        </div>

      </div>

    `;


    grid.appendChild(
      cardElement
    );

  });

}


// =========================================
// EXPORT
// =========================================

export {
  initializeCategoryPage
};