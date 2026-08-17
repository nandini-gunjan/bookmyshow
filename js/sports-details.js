// =========================================
// SPORTS DETAILS
// =========================================

const SPORTS_API_BASE = "https://www.thesportsdb.com/api/v1/json/123";

// =========================================
// GET EVENT ID
// =========================================

function getEventId() {
  const params = new URLSearchParams(window.location.search);

  return params.get("id");
}

// =========================================
// GET SPORTS EVENT DETAILS
// =========================================

async function getSportsEventDetails(eventId) {
  if (!eventId) {
    console.error("Sports event ID not found.");

    return null;
  }

  try {
    const url = `${SPORTS_API_BASE}/lookupevent.php?id=${eventId}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Sports details request failed: ${response.status}`);
    }

    const data = await response.json();

    console.log("Sports event details:", data);

    return data.events?.[0] || null;
  } catch (error) {
    console.error("Sports Details Error:", error);

    return null;
  }
}

// =========================================
// RENDER SPORTS DETAILS
// =========================================

function renderSportsDetails(event) {
  const container = document.getElementById("sportsDetailsContainer");

  if (!container) {
    return;
  }

  if (!event) {
    container.innerHTML = `

      <section class="sports-details-error">

        <h2>
          Sports event not found
        </h2>

        <p>
          We couldn't load the details
          for this sports event.
        </p>

        <button
          class="back-btn"
          onclick="history.back()"
        >
          Go Back
        </button>

      </section>

    `;

    return;
  }

  // ---------------------------------------
  // IMAGE
  // ---------------------------------------

  const backdrop = event.strThumb || event.strPoster || "";

  // ---------------------------------------
  // EVENT INFORMATION
  // ---------------------------------------

  const title = event.strEvent || "Sports Event";

  const sport = event.strSport || "Sports";

  const league = event.strLeague || "N/A";

  const date = event.dateEvent || "N/A";

  const time = event.strTime || "N/A";

  const venue = event.strVenue || "N/A";

  const city = event.strCity || "N/A";

  const country = event.strCountry || "N/A";

  const homeTeam = event.strHomeTeam || "N/A";

  const awayTeam = event.strAwayTeam || "N/A";

  const status = event.strStatus || "Upcoming";

  // ---------------------------------------
  // RENDER
  // ---------------------------------------

  container.innerHTML = `

    <section class="sports-details-page">

      <!-- =================================
           HERO
      ================================== -->

      <section class="sports-details-hero">

        ${
          backdrop
            ? `
              <img
                class="sports-details-backdrop"
                src="${backdrop}"
                alt="${title}"
              >
            `
            : ""
        }

        <div class="sports-details-overlay"></div>

        <div class="sports-details-hero-content">

          <span class="sports-details-label">
            ${sport}
          </span>

          <h1>
            ${title}
          </h1>

          <p>
            ${league}
          </p>

        </div>

      </section>


      <!-- =================================
           DETAILS CONTENT
      ================================== -->

      <section class="sports-details-content">

        <div class="sports-details-main">

          <h2>
            ${title}
          </h2>

          <div class="sports-match-info">

            <div class="sports-info-item">

              <span>
                Date
              </span>

              <strong>
                ${date}
              </strong>

            </div>


            <div class="sports-info-item">

              <span>
                Time
              </span>

              <strong>
                ${time}
              </strong>

            </div>


            <div class="sports-info-item">

              <span>
                Sport
              </span>

              <strong>
                ${sport}
              </strong>

            </div>


            <div class="sports-info-item">

              <span>
                League
              </span>

              <strong>
                ${league}
              </strong>

            </div>


            <div class="sports-info-item">

              <span>
                Venue
              </span>

              <strong>
                ${venue}
              </strong>

            </div>


            <div class="sports-info-item">

              <span>
                Location
              </span>

              <strong>
                ${city}, ${country}
              </strong>

            </div>

          </div>


          <!-- =================================
               TEAMS
          ================================== -->

          <section class="sports-teams">

            <h2>
              Teams
            </h2>

            <div class="teams-container">

              <div class="team">

                <h3>
                  ${homeTeam}
                </h3>

                <span>
                  Home Team
                </span>

              </div>


              <div class="team-vs">
                VS
              </div>


              <div class="team">

                <h3>
                  ${awayTeam}
                </h3>

                <span>
                  Away Team
                </span>

              </div>

            </div>

          </section>


          <!-- =================================
               EVENT STATUS
          ================================== -->

          <section class="sports-status">

            <span>
              Status
            </span>

            <strong>
              ${status}
            </strong>

          </section>

        </div>


        <!-- =================================
             BOOKING CARD
        ================================== -->

        <aside class="sports-booking-card">

          <h3>
            Watch / Book
          </h3>

          <p>
            Secure your place for this
            upcoming sports event.
          </p>

          <button
            class="sports-book-btn"
            id="preBookButton"
            type="button"
          >
            Pre-Book Now
          </button>

        </aside>

      </section>

    </section>

  `;
}

// =========================================
// PRE-BOOK
// =========================================

function preBook(event) {
  if (!event) {
    console.error("Sports event data is missing.");

    return;
  }

  /*
      Store the complete sports event
      returned by TheSportsDB.

      The next page can use this data
      without making the API request again.
  */

  sessionStorage.setItem("bookItBroSportBooking", JSON.stringify(event));

  console.log("Sports pre-booking data:", event);

  /*
      Move to sports pre-booking page.
  */

  window.location.href = "sport-prebooking.html";
}

// =========================================
// INITIALIZE
// =========================================

async function initializeSportsDetails() {
  const eventId = getEventId();

  if (!eventId) {
    renderSportsDetails(null);

    return;
  }

  const event = await getSportsEventDetails(eventId);

  renderSportsDetails(event);

  /*
      IMPORTANT:
      The button is created dynamically
      inside renderSportsDetails().
  */

  const preBookButton = document.getElementById("preBookButton");

  if (preBookButton) {
    preBookButton.addEventListener("click", () => {
      preBook(event);
    });
  }
}

// =========================================
// START
// =========================================

initializeSportsDetails();
