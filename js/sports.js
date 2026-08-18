// =========================================
// SPORTS API
// =========================================

const SPORTS_API_BASE =
  "https://www.thesportsdb.com/api/v1/json/123/eventsday.php";

// =========================================
// GET DATE STRING
// =========================================

function formatDate(date) {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// =========================================
// GET UPCOMING SPORTS EVENTS
// =========================================

async function getUpcomingSports(days = 7) {
  try {
    const today = new Date();

    const requests = [];

    // ---------------------------------------
    // FETCH THE NEXT SEVERAL DAYS
    // ---------------------------------------

    for (let i = 0; i < days; i++) {
      const date = new Date(today);

      date.setDate(today.getDate() + i);

      const dateString = formatDate(date);

      const url = `${SPORTS_API_BASE}?d=${dateString}`;

      requests.push(
        fetch(url)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Sports API failed: ${response.status}`);
            }

            return response.json();
          })
          .catch((error) => {
            console.error(`Sports request failed for ${dateString}:`, error);

            return {
              events: [],
            };
          }),
      );
    }

    const results = await Promise.all(requests);

    // ---------------------------------------
    // COMBINE EVENTS
    // ---------------------------------------

    const allEvents = results.flatMap((result) => result.events || []);

    // ---------------------------------------
    // REMOVE DUPLICATES
    // ---------------------------------------

    const uniqueEvents = [];

    const eventIds = new Set();

    allEvents.forEach((event) => {
      if (!event.idEvent) {
        return;
      }

      if (eventIds.has(event.idEvent)) {
        return;
      }

      eventIds.add(event.idEvent);

      uniqueEvents.push(event);
    });

    // ---------------------------------------
    // SORT BY DATE
    // ---------------------------------------

    uniqueEvents.sort((a, b) => {
      const dateA = new Date(`${a.dateEvent || ""} ${a.strTime || ""}`);

      const dateB = new Date(`${b.dateEvent || ""} ${b.strTime || ""}`);

      return dateA - dateB;
    });

    console.log("Upcoming sports events:", uniqueEvents);

    return uniqueEvents;
  } catch (error) {
    console.error("Upcoming Sports API Error:", error);

    return [];
  }
}

// =========================================
// FORMAT SPORTS EVENT
// =========================================

function formatSportsEvent(event) {
  return {
    id: event.idEvent,

    title: event.strEvent || "Sports Event",

    language: "sports",

    rating: "Upcoming",

    genre: event.strSport || "Sports",

    image: event.strThumb || event.strPoster || "assets/images/no-poster.jpg",

    backdrop: event.strThumb || "",

    overview: `${event.strLeague || "Sports"} event`,

    date: event.dateEvent || "",

    time: event.strTime || "",

    league: event.strLeague || "",

    sport: event.strSport || "",

    homeTeam: event.strHomeTeam || "",

    awayTeam: event.strAwayTeam || "",

    venue: event.strVenue || "",

    city: event.strCity || "",

    country: event.strCountry || "",

    status: event.strStatus || "Not Started",
  };
}

// =========================================
// GET FORMATTED UPCOMING SPORTS
// =========================================

async function getSports() {
  const events = await getUpcomingSports(7);

  return events.map(formatSportsEvent);
}

// =========================================
// EXPORT
// =========================================

export { getUpcomingSports, formatSportsEvent, getSports };
