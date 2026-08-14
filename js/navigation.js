// =========================================
// PAGE NAVIGATION
// =========================================

import { initializeCategoryPage } from "./category.js";

// =========================================
// CATEGORY PAGES
// =========================================

const categoryPages = [
  "movies",
  "stream",
  "events",
  "plays",
  "sports",
  "activities",
];

// =========================================
// LOAD PAGE
// =========================================

async function loadPage(page) {
  const pageContent = document.getElementById("page-content");

  if (!pageContent) {
    console.error("Page content container not found.");

    return;
  }

  try {
    // =======================================
    // SHOW LOADING
    // =======================================

    pageContent.innerHTML = `
      <div class="page-loading">
        Loading...
      </div>
    `;

    // =======================================
    // DETERMINE PAGE FILE
    // =======================================

    let pageFile;

    if (categoryPages.includes(page)) {
      // Movies, Stream, Events, Plays,
      // Sports and Activities all use
      // the same category structure.

      pageFile = "components/category.html";
    } else {
      // Other sections have their
      // own HTML files.

      pageFile = `section-pages/${page}.html`;
    }

    // =======================================
    // LOAD HTML
    // =======================================

    const response = await fetch(pageFile);

    if (!response.ok) {
      throw new Error(`Unable to load ${pageFile}`);
    }

    const html = await response.text();

    // =======================================
    // DISPLAY PAGE
    // =======================================

    pageContent.innerHTML = html;

    // =======================================
    // UPDATE ACTIVE NAVIGATION
    // =======================================

    updateActiveNavigation(page);

    // =======================================
    // INITIALIZE PAGE
    // =======================================

    initializePage(page);
  } catch (error) {
    console.error("Page Loading Error:", error);

    pageContent.innerHTML = `
      <section class="page-error">

        <h2>Something went wrong</h2>

        <p>
          Unable to load this section.
          Please try again.
        </p>

      </section>
    `;
  }
}

// =========================================
// ACTIVE NAVIGATION
// =========================================

function updateActiveNavigation(page) {
  const navLinks = document.querySelectorAll("[data-page]");

  navLinks.forEach((link) => {
    link.classList.remove("active");

    if (link.dataset.page === page) {
      link.classList.add("active");
    }
  });
}

// =========================================
// PAGE INITIALIZATION
// =========================================

function initializePage(page) {
  // =======================================
  // CATEGORY PAGES
  // =======================================

  if (categoryPages.includes(page)) {
    initializeCategoryPage(page);

    return;
  }

  // =======================================
  // OTHER PAGES
  // =======================================

  switch (page) {
    case "list-your-show":
      console.log("List Your Show page initialized");

      break;

    case "corporates":
      console.log("Corporates page initialized");

      break;

    case "offers":
      console.log("Offers page initialized");

      break;

    case "gift-cards":
      console.log("Gift Cards page initialized");

      break;

    default:
      console.warn(`Unknown page: ${page}`);

      break;
  }
}

// =========================================
// NAVIGATION CLICK HANDLER
// =========================================

function initializeNavigation() {
  document.addEventListener("click", (event) => {
    const link = event.target.closest("[data-page]");

    // Not a navigation link

    if (!link) {
      return;
    }

    event.preventDefault();

    const page = link.dataset.page;

    if (!page) {
      return;
    }

    // =====================================
    // UPDATE URL
    // =====================================

    window.location.hash = page;
  });
}

// =========================================
// LOAD PAGE FROM URL HASH
// =========================================

function loadPageFromHash() {
  let page = window.location.hash.substring(1);

  // =======================================
  // REDIRECT ROOT TO MOVIES
  // =======================================

  if (!page) {
    window.location.hash = "movies";

    return;
  }

  // =======================================
  // LOAD REQUESTED PAGE
  // =======================================

  loadPage(page);
}

// =========================================
// HASH CHANGE
// =========================================

function initializeHashNavigation() {
  window.addEventListener("hashchange", loadPageFromHash);
}

// =========================================
// INITIALIZE PAGE NAVIGATION
// =========================================

function initializePageNavigation() {
  initializeNavigation();

  initializeHashNavigation();

  // Load the initial page
  loadPageFromHash();
}

// =========================================
// EXPORT
// =========================================

export { loadPage, initializePageNavigation };
