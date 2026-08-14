/* =====================================================
   BOOKITBRO - THEATRE / SHOWTIME
===================================================== */


/* =========================================
   MOVIE DATA
========================================= */

const movieData = {

    id: "demo-001",

    title: "Kalki 2898 AD",

    poster:
        "https://via.placeholder.com/300x450?text=Movie+Poster",

    language: "Hindi",

    genre: "Action, Sci-Fi",

    duration: "3h 1m",

    description:
        "Select a theatre and showtime to book your movie tickets."

};



/* =========================================
   THEATRE DATA
=========================================

   This structure is important.

   Later this can come directly
   from your API / Firebase.

========================================= */

const theatres = [

    {

        id: "th001",

        name: "PVR INOX",

        location: "Phoenix Mall, Pune",

        type: "premium",

        features: [
            "IMAX",
            "Dolby Atmos",
            "Recliner"
        ],

        shows: [

            {
                id: "show001",

                time: "10:30 AM",

                price: 250,

                available: "Available"
            },

            {
                id: "show002",

                time: "1:45 PM",

                price: 280,

                available: "Available"
            },

            {
                id: "show003",

                time: "5:15 PM",

                price: 300,

                available: "Fast Filling"
            },

            {
                id: "show004",

                time: "8:30 PM",

                price: 320,

                available: "Available"
            }

        ]

    },


    {

        id: "th002",

        name: "Cinepolis",

        location: "Seasons Mall, Pune",

        type: "premium",

        features: [
            "Dolby Atmos",
            "Recliner",
            "Premium Seats"
        ],

        shows: [

            {
                id: "show005",

                time: "11:00 AM",

                price: 220,

                available: "Available"
            },

            {
                id: "show006",

                time: "2:30 PM",

                price: 250,

                available: "Available"
            },

            {
                id: "show007",

                time: "6:00 PM",

                price: 290,

                available: "Fast Filling"
            },

            {
                id: "show008",

                time: "9:15 PM",

                price: 310,

                available: "Available"
            }

        ]

    },


    {

        id: "th003",

        name: "City Pride",

        location: "Kothrud, Pune",

        type: "standard",

        features: [
            "Parking",
            "Food & Beverages"
        ],

        shows: [

            {
                id: "show009",

                time: "10:00 AM",

                price: 160,

                available: "Available"
            },

            {
                id: "show010",

                time: "1:00 PM",

                price: 180,

                available: "Available"
            },

            {
                id: "show011",

                time: "4:15 PM",

                price: 190,

                available: "Available"
            },

            {
                id: "show012",

                time: "7:30 PM",

                price: 210,

                available: "Fast Filling"
            }

        ]

    },


    {

        id: "th004",

        name: "INOX",

        location: "Amanora Mall, Pune",

        type: "standard",

        features: [
            "Parking",
            "Food Court"
        ],

        shows: [

            {
                id: "show013",

                time: "11:30 AM",

                price: 180,

                available: "Available"
            },

            {
                id: "show014",

                time: "3:00 PM",

                price: 200,

                available: "Available"
            },

            {
                id: "show015",

                time: "6:30 PM",

                price: 220,

                available: "Available"
            },

            {
                id: "show016",

                time: "9:45 PM",

                price: 240,

                available: "Fast Filling"
            }

        ]

    }

];



/* =========================================
   SELECTED DATA
========================================= */

let selectedDate = null;

let selectedTheatre = null;

let selectedShow = null;

let activeFilter = "all";



/* =========================================
   LOAD NAVBAR
========================================= */

async function loadNavbar() {

    const navbar =
        document.getElementById("navbar");


    if (!navbar) {

        return;

    }


    try {

        const response =
            await fetch(
                "components/navbar.html"
            );


        if (!response.ok) {

            throw new Error(
                "Navbar failed to load."
            );

        }


        navbar.innerHTML =
            await response.text();


    } catch (error) {

        console.error(
            "Navbar error:",
            error
        );

    }

}



/* =========================================
   LOAD COMPONENT
========================================= */

async function loadTheatreComponent() {

    const page =
        document.getElementById(
            "theatrePage"
        );


    try {

        const response =
            await fetch(
                "components/theatre-showtime.html"
            );


        if (!response.ok) {

            throw new Error(
                "Theatre component failed to load."
            );

        }


        page.innerHTML =
            await response.text();


        initializeTheatrePage();


    } catch (error) {

        console.error(
            error
        );


        page.innerHTML = `

            <div class="theatre-loading">

                <h2>
                    Unable to load theatres
                </h2>

                <p>
                    Please refresh the page.
                </p>

            </div>

        `;

    }

}



/* =========================================
   INITIALIZE
========================================= */

function initializeTheatrePage() {

    populateMovie();

    generateDates();

    renderTheatres();

    setupFilters();

    updateBottomBar();

}



/* =========================================
   MOVIE INFORMATION
========================================= */

function populateMovie() {

    setText(
        "showMovieTitle",
        movieData.title
    );


    setText(
        "showMovieLanguage",
        movieData.language
    );


    setText(
        "showMovieGenre",
        movieData.genre
    );


    setText(
        "showMovieDuration",
        movieData.duration
    );


    setText(
        "showMovieDescription",
        movieData.description
    );


    const poster =
        document.getElementById(
            "showMoviePoster"
        );


    if (poster) {

        poster.src =
            movieData.poster;

        poster.alt =
            movieData.title;

    }

}



/* =========================================
   GENERATE DATES
========================================= */

function generateDates() {

    const dateList =
        document.getElementById(
            "dateList"
        );


    if (!dateList) {

        return;

    }


    dateList.innerHTML = "";


    const today =
        new Date();


    for (
        let i = 0;
        i < 7;
        i++
    ) {

        const date =
            new Date(today);


        date.setDate(
            today.getDate() + i
        );


        const day =
            date.toLocaleDateString(
                "en-IN",
                {
                    weekday: "short"
                }
            );


        const month =
            date.toLocaleDateString(
                "en-IN",
                {
                    month: "short"
                }
            );


        const number =
            date.getDate();


        const dateValue =
            date.toISOString()
                .split("T")[0];


        const button =
            document.createElement(
                "button"
            );


        button.type = "button";

        button.className =
            "date-card";


        if (i === 0) {

            button.classList.add(
                "active"
            );

            selectedDate =
                dateValue;

        }


        button.dataset.date =
            dateValue;


        button.innerHTML = `

            <span class="date-day">
                ${i === 0 ? "Today" : day}
            </span>

            <span class="date-number">
                ${number}
            </span>

            <span class="date-month">
                ${month}
            </span>

        `;


        button.addEventListener(
            "click",
            () => {

                selectDate(
                    dateValue,
                    button
                );

            }
        );


        dateList.appendChild(
            button
        );

    }

}



/* =========================================
   SELECT DATE
========================================= */

function selectDate(
    date,
    selectedButton
) {

    selectedDate =
        date;


    document
        .querySelectorAll(
            ".date-card"
        )
        .forEach(
            (button) => {

                button.classList.remove(
                    "active"
                );

            }
        );


    selectedButton.classList.add(
        "active"
    );


    /*
        Later:
        API request can happen here
        based on selected date.
    */


    resetSelectedShow();

}



/* =========================================
   RENDER THEATRES
========================================= */

function renderTheatres() {

    const list =
        document.getElementById(
            "theatreList"
        );


    const count =
        document.getElementById(
            "theatreCount"
        );


    if (!list) {

        return;

    }


    list.innerHTML = "";


    let visibleCount = 0;


    theatres.forEach(
        (theatre) => {

            const matchesFilter =
                activeFilter === "all" ||
                theatre.type === activeFilter;


            if (!matchesFilter) {

                return;

            }


            visibleCount++;


            const card =
                createTheatreCard(
                    theatre
                );


            list.appendChild(
                card
            );

        }
    );


    if (count) {

        count.textContent =
            `${visibleCount} theatres`;

    }


    if (!visibleCount) {

        list.innerHTML = `

            <div class="no-theatres">

                <h3>
                    No theatres found
                </h3>

                <p>
                    Try another filter.
                </p>

            </div>

        `;

    }

}



/* =========================================
   CREATE THEATRE CARD
========================================= */

function createTheatreCard(
    theatre
) {

    const card =
        document.createElement(
            "div"
        );


    card.className =
        "theatre-card";


    card.dataset.type =
        theatre.type;


    const features =
        theatre.features
            .map(
                (feature) => `

                    <span class="theatre-feature">
                        ${feature}
                    </span>

                `
            )
            .join("");


    const shows =
        theatre.shows
            .map(
                (show) =>
                    createShowButton(
                        theatre,
                        show
                    )
            )
            .join("");


    card.innerHTML = `

        <div class="theatre-main">


            <div class="theatre-info">

                <span class="theatre-type ${theatre.type}">
                    ${capitalize(theatre.type)}
                </span>


                <h3 class="theatre-name">
                    ${theatre.name}
                </h3>


                <div class="theatre-location">
                    📍 ${theatre.location}
                </div>


                <div class="theatre-features">
                    ${features}
                </div>

            </div>


        </div>


        <div class="showtime-area">

            <div class="showtime-heading">
                Available showtimes
            </div>


            <div class="showtime-list">

                ${shows}

            </div>

        </div>

    `;


    /*
        Add event listeners
    */

    card
        .querySelectorAll(
            ".showtime-button"
        )
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        selectShow(
                            theatre,
                            button.dataset.showId
                        );

                    }
                );

            }
        );


    return card;

}



/* =========================================
   CREATE SHOW BUTTON
========================================= */

function createShowButton(
    theatre,
    show
) {

    return `

        <button
            type="button"
            class="showtime-button"
            data-show-id="${show.id}"
            data-theatre-id="${theatre.id}"
        >

            ${show.time}

            <span class="showtime-price">
                ₹${show.price}
            </span>

            <span class="showtime-available">
                ${show.available}
            </span>

        </button>

    `;

}



/* =========================================
   SELECT SHOW
========================================= */

function selectShow(
    theatre,
    showId
) {

    const show =
        theatre.shows.find(
            (item) =>
                item.id === showId
        );


    if (!show) {

        return;

    }


    selectedTheatre =
        theatre;


    selectedShow =
        show;


    /*
        Remove previous selection
    */

    document
        .querySelectorAll(
            ".showtime-button"
        )
        .forEach(
            (button) => {

                button.classList.remove(
                    "selected"
                );

            }
        );


    /*
        Select clicked button
    */

    const selectedButton =
        document.querySelector(
            `[data-show-id="${showId}"]`
        );


    if (selectedButton) {

        selectedButton.classList.add(
            "selected"
        );

    }


    updateBottomBar();

}



/* =========================================
   UPDATE BOTTOM BAR
========================================= */

function updateBottomBar() {

    const theatreName =
        document.getElementById(
            "selectedTheatreName"
        );


    const showTime =
        document.getElementById(
            "selectedShowTime"
        );


    const continueButton =
        document.getElementById(
            "continueButton"
        );


    if (
        !theatreName ||
        !showTime ||
        !continueButton
    ) {

        return;

    }


    if (
        selectedTheatre &&
        selectedShow
    ) {

        theatreName.textContent =
            selectedTheatre.name;


        showTime.textContent =
            `${selectedShow.time} • ₹${selectedShow.price}`;


        continueButton.disabled =
            false;


        continueButton.textContent =
            "Select Seats";


    } else {

        theatreName.textContent =
            "Select a showtime";


        showTime.textContent =
            "Choose your preferred theatre and time.";


        continueButton.disabled =
            true;


        continueButton.textContent =
            "Select Showtime";

    }

}



/* =========================================
   RESET SELECTED SHOW
========================================= */

function resetSelectedShow() {

    selectedTheatre =
        null;


    selectedShow =
        null;


    document
        .querySelectorAll(
            ".showtime-button"
        )
        .forEach(
            (button) => {

                button.classList.remove(
                    "selected"
                );

            }
        );


    updateBottomBar();

}



/* =========================================
   FILTERS
========================================= */

function setupFilters() {

    document
        .querySelectorAll(
            ".filter-button[data-filter]"
        )
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        activeFilter =
                            button.dataset.filter;


                        document
                            .querySelectorAll(
                                ".filter-button[data-filter]"
                            )
                            .forEach(
                                (item) => {

                                    item.classList.remove(
                                        "active"
                                    );

                                }
                            );


                        button.classList.add(
                            "active"
                        );


                        resetSelectedShow();


                        renderTheatres();

                    }
                );

            }
        );


    /*
        Price button
    */

    const priceButton =
        document.getElementById(
            "priceFilter"
        );


    if (priceButton) {

        priceButton.addEventListener(
            "click",
            () => {

                sortByPrice();

            }
        );

    }


    /*
        Continue button
    */

    const continueButton =
        document.getElementById(
            "continueButton"
        );


    if (continueButton) {

        continueButton.addEventListener(
            "click",
            goToSeatSelection
        );

    }

}



/* =========================================
   SORT BY PRICE
========================================= */

function sortByPrice() {

    theatres.forEach(
        (theatre) => {

            theatre.shows.sort(
                (a, b) =>
                    a.price - b.price
            );

        }
    );


    renderTheatres();

}



/* =========================================
   GO TO SEAT SELECTION
========================================= */

function goToSeatSelection() {

    if (
        !selectedTheatre ||
        !selectedShow
    ) {

        return;

    }


    /*
        Save selected booking data.

        This makes the next page
        easy to build.
    */

    const bookingData = {

        movieId:
            movieData.id,

        movieTitle:
            movieData.title,

        date:
            selectedDate,

        theatreId:
            selectedTheatre.id,

        theatreName:
            selectedTheatre.name,

        location:
            selectedTheatre.location,

        showId:
            selectedShow.id,

        showTime:
            selectedShow.time,

        price:
            selectedShow.price

    };


    sessionStorage.setItem(
        "bookItBroBooking",
        JSON.stringify(
            bookingData
        )
    );


    /*
        NEXT MODULE:

        seat-selection.html
    */

    window.location.href =
        `seat-selection.html?movie=${encodeURIComponent(movieData.id)}`;

}



/* =========================================
   HELPERS
========================================= */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value ?? "";

    }

}


function capitalize(
    text
) {

    if (!text) {

        return "";

    }


    return text.charAt(0).toUpperCase()
        + text.slice(1);

}



/* =========================================
   START PAGE
========================================= */

async function startTheatrePage() {

    await loadNavbar();

    await loadTheatreComponent();

}


startTheatrePage();