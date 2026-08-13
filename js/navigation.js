// =========================================
// PAGE NAVIGATION
// =========================================

async function loadPage(page) {
  const pageContent = document.getElementById("page-content");

  if (!pageContent) {
    console.error("Page content container not found.");
    return;
  }

  try {
    // -----------------------------------------
    // SHOW LOADING
    // -----------------------------------------

    pageContent.innerHTML = `
            <div class="page-loading">
                Loading...
            </div>
        `;

    // -----------------------------------------
    // LOAD COMPONENT
    // -----------------------------------------

    const response = await fetch(`section-pages/${page}.html`);

    if (!response.ok) {
      throw new Error(`Unable to load ${page}.html`);
    }

    const html = await response.text();

    // -----------------------------------------
    // DISPLAY PAGE
    // -----------------------------------------

    pageContent.innerHTML = html;

    // -----------------------------------------
    // UPDATE ACTIVE NAVBAR LINK
    // -----------------------------------------

    updateActiveNavigation(page);

    // -----------------------------------------
    // PAGE-SPECIFIC INITIALIZATION
    // -----------------------------------------

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
  switch (page) {
    case "movies":
      console.log("Movies page initialized");

      // movies.js will be connected here later

      break;

    case "stream":
      console.log("Stream page initialized");

      break;

    case "events":
      console.log("Events page initialized");

      break;

    case "plays":
      console.log("Plays page initialized");

      break;

    case "sports":
      console.log("Sports page initialized");

      break;

    case "activities":
      console.log("Activities page initialized");

      break;

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
  }
}

// =========================================
// NAVIGATION CLICK HANDLER
// =========================================

function initializeNavigation() {
  document.addEventListener("click", (event) => {
    const link = event.target.closest("[data-page]");

    if (!link) {
      return;
    }

    event.preventDefault();

    const page = link.dataset.page;

    if (!page) {
      return;
    }

    // Update URL

    window.location.hash = page;
  });
}

// =========================================
// LOAD PAGE FROM URL
// =========================================

function loadPageFromHash() {
  let page = window.location.hash.substring(1);

  // Default page

  if (!page) {
    page = "movies";
  }

  loadPage(page);
}

// =========================================
// HASH CHANGE
// =========================================

function initializeHashNavigation() {
  window.addEventListener("hashchange", loadPageFromHash);
}

// =========================================
// INITIALIZE
// =========================================

function initializePageNavigation() {
  initializeNavigation();

  initializeHashNavigation();
}

// =========================================
// EXPORT
// =========================================

export { loadPage, initializePageNavigation };
