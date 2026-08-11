document.addEventListener("DOMContentLoaded", () => {
  loadNavbar();
});

/* =========================================
   LOAD GLOBAL NAVBAR
========================================= */

async function loadNavbar() {
  try {
    const response = await fetch("components/navbar.html");

    if (!response.ok) {
      throw new Error("Navbar could not be loaded.");
    }

    const navbarHTML = await response.text();

    document.getElementById("navbar").innerHTML = navbarHTML;

    // Initialize navbar features
    initializeLocationModal();
  } catch (error) {
    console.error("Navbar Error:", error);
  }
}

/* =========================================
   LOCATION MODAL
========================================= */

function initializeLocationModal() {
  const locationButton = document.querySelector(".location-btn");

  const locationModal = document.getElementById("locationModal");

  const closeButton = document.getElementById("closeLocationModal");

  const locationSearch = document.getElementById("locationSearch");

  const cityOptions = document.querySelectorAll(".city-option");

  /* -----------------------------------------
       Open Modal
    ----------------------------------------- */

  locationButton.addEventListener("click", () => {
    locationModal.classList.add("show");

    document.body.style.overflow = "hidden";

    setTimeout(() => {
      locationSearch.focus();
    }, 200);
  });

  /* -----------------------------------------
       Close Modal
    ----------------------------------------- */

  closeButton.addEventListener("click", closeLocationModal);

  /* -----------------------------------------
       Close When Clicking Outside
    ----------------------------------------- */

  locationModal.addEventListener("click", (event) => {
    if (event.target === locationModal) {
      closeLocationModal();
    }
  });

  /* -----------------------------------------
       Close With ESC
    ----------------------------------------- */

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && locationModal.classList.contains("show")) {
      closeLocationModal();
    }
  });

  /* -----------------------------------------
       Select City
    ----------------------------------------- */

  cityOptions.forEach((city) => {
    city.addEventListener("click", () => {
      const selectedCity = city.dataset.city;

      updateSelectedLocation(selectedCity);

      closeLocationModal();
    });
  });

  /* -----------------------------------------
       Search Cities
    ----------------------------------------- */

  locationSearch.addEventListener("input", () => {
    const searchValue = locationSearch.value.toLowerCase().trim();

    cityOptions.forEach((city) => {
      const cityName = city.dataset.city.toLowerCase();

      if (cityName.includes(searchValue)) {
        city.style.display = "";
      } else {
        city.style.display = "none";
      }
    });
  });

  /* -----------------------------------------
       Close Function
    ----------------------------------------- */

  function closeLocationModal() {
    locationModal.classList.remove("show");

    document.body.style.overflow = "";

    locationSearch.value = "";

    cityOptions.forEach((city) => {
      city.style.display = "";
    });
  }

  /* -----------------------------------------
       Update Navbar Location
    ----------------------------------------- */

  function updateSelectedLocation(city) {
    const locationText = document.querySelector(".location-btn span");

    locationText.textContent = city;
  }
}
