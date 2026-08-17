/* =========================================
   BOOKITBRO
   CONFIRMATION PAGE
========================================= */

/* =========================================
   STATE
========================================= */

let confirmationData = null;

/* =========================================
   LOAD CONFIRMATION DATA
========================================= */

function loadConfirmationData() {
  const storedData = sessionStorage.getItem("bookItBroConfirmation");

  if (!storedData) {
    showConfirmationError();

    return false;
  }

  try {
    confirmationData = JSON.parse(storedData);

    console.log("Confirmation Data:", confirmationData);

    return true;
  } catch (error) {
    console.error("Unable to read confirmation data:", error);

    showConfirmationError();

    return false;
  }
}

/* =========================================
   DISPLAY MOVIE
========================================= */

function displayMovie() {
  const title = confirmationData.movieTitle || "Movie";

  document.getElementById("movieTitle").textContent = title;

  document.getElementById("movieTitleSmall").textContent = title;

  /*
        Movie metadata
    */

  const language = confirmationData.language || "Movie";

  const certificate = confirmationData.certificate || "UA";

  document.getElementById("movieMeta").textContent =
    `${language} • ${certificate}`;

  /*
        Rating
    */

  document.getElementById("movieRating").textContent =
    confirmationData.rating || "N/A";

  /*
        Poster
    */

  const poster = confirmationData.moviePoster || confirmationData.poster || "";

  const posterElement = document.getElementById("moviePoster");

  if (poster) {
    posterElement.src = poster;

    posterElement.onerror = () => {
      posterElement.style.display = "none";
    };
  } else {
    posterElement.style.display = "none";
  }
}

/* =========================================
   DISPLAY SHOW DETAILS
========================================= */

function displayShowDetails() {
  document.getElementById("theatreName").textContent =
    confirmationData.theatreName || "Theatre";

  document.getElementById("screenName").textContent =
    confirmationData.screen || "Screen 1";

  document.getElementById("showDate").textContent = formatDate(
    confirmationData.date,
  );

  document.getElementById("showTime").textContent =
    confirmationData.showTime || "—";

  /*
        Seats
    */

  const seats = Array.isArray(confirmationData.seats)
    ? confirmationData.seats
    : [];

  document.getElementById("selectedSeats").textContent = seats.length
    ? seats.join(", ")
    : "—";

  /*
        Ticket count
    */

  const ticketCount = Number(confirmationData.ticketCount) || seats.length || 0;

  document.getElementById("ticketCount").textContent = ticketCount;
}

/* =========================================
   DISPLAY PAYMENT
========================================= */

function displayPayment() {
  /*
        Booking ID
    */

  document.getElementById("bookingId").textContent =
    confirmationData.bookingId || "BIB000000000";

  /*
        Payment method
    */

  const method = confirmationData.paymentMethod || "upi";

  document.getElementById("paymentMethod").textContent =
    formatPaymentMethod(method);

  /*
        Total amount
    */

  const total = Number(confirmationData.totalAmount) || 0;

  document.getElementById("totalAmount").textContent = formatCurrency(total);
}

/* =========================================
   PAYMENT METHOD LABEL
========================================= */

function formatPaymentMethod(method) {
  const methods = {
    upi: "UPI",

    card: "Credit / Debit Card",

    netbanking: "Net Banking",

    wallet: "Wallet",
  };

  return methods[method] || "Online Payment";
}

/* =========================================
   FORMAT CURRENCY
========================================= */

function formatCurrency(amount) {
  return `₹${Number(amount).toFixed(2)}`;
}

/* =========================================
   FORMAT DATE
========================================= */

function formatDate(dateString) {
  if (!dateString) {
    return "—";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* =========================================
   GENERATE QR STYLE
========================================= */

function generateQRCode() {
  const qr = document.getElementById("qrCode");

  if (!qr) {
    return;
  }

  /*
        Generate deterministic visual pattern
        from booking ID.

        This is a visual ticket QR-style code,
        not a real payment QR.
    */

  const bookingId = confirmationData.bookingId || "BOOKITBRO";

  qr.innerHTML = "";

  const canvas = document.createElement("canvas");

  const size = 21;

  const scale = 5;

  canvas.width = size * scale;

  canvas.height = size * scale;

  const context = canvas.getContext("2d");

  context.fillStyle = "#ffffff";

  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "#111111";

  /*
        Create seed from booking ID.
    */

  let seed = 0;

  for (let i = 0; i < bookingId.length; i++) {
    seed = (seed * 31 + bookingId.charCodeAt(i)) >>> 0;
  }

  function random() {
    seed = (seed * 1664525 + 1013904223) >>> 0;

    return seed / 4294967296;
  }

  /*
        Draw finder patterns.
    */

  function drawFinder(startX, startY) {
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {
        const outer = x === 0 || x === 6 || y === 0 || y === 6;

        const inner = x >= 2 && x <= 4 && y >= 2 && y <= 4;

        if (outer || inner) {
          context.fillRect(
            (startX + x) * scale,

            (startY + y) * scale,

            scale,
            scale,
          );
        }
      }
    }
  }

  drawFinder(0, 0);

  drawFinder(14, 0);

  drawFinder(0, 14);

  /*
        Random data modules.
    */

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const insideFinder =
        (x < 8 && y < 8) || (x >= 13 && y < 8) || (x < 8 && y >= 13);

      if (insideFinder) {
        continue;
      }

      /*
                Keep quiet zone around
                finder patterns.
            */

      if (random() > 0.56) {
        context.fillRect(x * scale, y * scale, scale, scale);
      }
    }
  }

  qr.appendChild(canvas);
}

/* =========================================
   DOWNLOAD TICKET
========================================= */

function downloadTicket() {
  /*
        The page already contains a
        print-friendly CSS section.

        Open browser print dialog so
        the user can save the ticket
        as PDF.
    */

  window.print();
}

/* =========================================
   HOME BUTTON
========================================= */

function goHome() {
  /*
        Change this path if your project's
        home page has a different filename.
    */

  window.location.href = "index.html";
}

/* =========================================
   SETUP ACTIONS
========================================= */

function setupActions() {
  document
    .getElementById("downloadTicketButton")
    .addEventListener("click", downloadTicket);

  document.getElementById("homeButton").addEventListener("click", goHome);
}

/* =========================================
   CONFIRMATION ERROR
========================================= */

function showConfirmationError() {
  document.body.innerHTML = `

        <div style="
            min-height:100vh;
            display:flex;
            align-items:center;
            justify-content:center;
            padding:20px;
            background:#f4f5f7;
            font-family:Arial,sans-serif;
            text-align:center;
        ">

            <div style="
                max-width:430px;
            ">

                <div style="
                    font-size:52px;
                    margin-bottom:15px;
                ">
                    🎟️
                </div>

                <h2 style="
                    margin-bottom:10px;
                ">
                    Booking Not Found
                </h2>

                <p style="
                    color:#777;
                    line-height:1.6;
                    margin-bottom:22px;
                ">
                    We couldn't find your booking
                    confirmation. Please complete
                    your booking again.
                </p>

                <button
                    onclick="window.location.href='index.html'"
                    style="
                        border:none;
                        padding:12px 25px;
                        border-radius:7px;
                        background:#e51937;
                        color:white;
                        font-weight:600;
                        cursor:pointer;
                    "
                >
                    Back to Home
                </button>

            </div>

        </div>

    `;
}

/* =========================================
   INITIALIZE
========================================= */

function initialize() {
  /*
        Load confirmation.
    */

  const loaded = loadConfirmationData();

  if (!loaded) {
    return;
  }

  /*
        Display information.
    */

  displayMovie();

  displayShowDetails();

  displayPayment();

  /*
        Generate ticket QR.
    */

  generateQRCode();

  /*
        Setup buttons.
    */

  setupActions();
}

/* =========================================
   START
========================================= */

initialize();
