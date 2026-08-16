// =========================================
// GLOBAL SEARCH
// =========================================

import { searchMovies } from "./tmdb.js";

// =========================================
// INITIALIZE SEARCH
// =========================================

function initializeSearch() {
  const searchInput = document.getElementById("globalSearchInput");
  const searchResults = document.getElementById("searchResults");

  if (!searchInput || !searchResults) {
    console.error("Search elements not found.");

    return;
  }

  let searchTimeout;

  // =======================================
  // SEARCH INPUT
  // =======================================

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim();

    clearTimeout(searchTimeout);

    // Empty search
    if (!query) {
      searchResults.innerHTML = "";
      searchResults.classList.remove("show");

      return;
    }

    // Wait before searching
    searchTimeout = setTimeout(async () => {
      await performSearch(query);
    }, 500);
  });

  // =======================================
  // PERFORM SEARCH
  // =======================================

  async function performSearch(query) {
    searchResults.classList.add("show");

    searchResults.innerHTML = `
      <div class="search-loading">
        Searching...
      </div>
    `;

    const movies = await searchMovies(query);

    // =====================================
    // NO RESULTS
    // =====================================

    if (!movies || movies.length === 0) {
      searchResults.innerHTML = `
        <div class="search-no-results">
          No movies found.
        </div>
      `;

      return;
    }

    // =====================================
    // SHOW RESULTS
    // =====================================

    searchResults.innerHTML = "";

    movies.slice(0, 6).forEach((movie) => {
      const result = document.createElement("div");

      result.className = "search-result-item";

      result.innerHTML = `
        <img
          src="${movie.image}"
          alt="${movie.title}"
        />

        <div class="search-result-info">

          <h4>${movie.title}</h4>

          <p>
            ${movie.releaseDate || "Release date unavailable"}
          </p>

        </div>
      `;

      // ===================================
      // OPEN MOVIE DETAILS
      // ===================================

      result.addEventListener("click", () => {
        window.location.href = `movie-details.html?id=${movie.id}`;
      });

      searchResults.appendChild(result);
    });
  }

  // =======================================
  // CLOSE SEARCH
  // =======================================

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".search-container")) {
      searchResults.classList.remove("show");
    }
  });

  // =======================================
  // ESCAPE
  // =======================================

  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      searchResults.classList.remove("show");

      searchInput.blur();

      return;
    }

    if (event.key === "Enter") {
      const firstResult = searchResults.querySelector(".search-result-item");

      if (firstResult) {
        firstResult.click();
      }
    }
  });
}

// =========================================
// EXPORT
// =========================================

export { initializeSearch };
