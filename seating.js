const seatsContainer = document.getElementById("seats-container");
const movieTitleElem = document.getElementById("movie-title");
const showtimeInfoElem = document.getElementById("showtime-info");
const ticketPriceElem = document.getElementById("ticket-price");
const confirmBtn = document.getElementById("confirm-btn");
const confirmationDiv = document.getElementById("confirmation");

const ROWS = 5;
const COLS = 11;
const ROW_LABELS = ["A", "B", "C", "D", "E"];

let occupiedSeats = new Set(); // seat numbers occupied (example)
let selectedSeats = [];

function loadBookingData() {
  const dataStr = localStorage.getItem("bookingData");
  if (!dataStr) {
    movieTitleElem.textContent = "No booking data found.";
    confirmBtn.disabled = true;
    return null;
  }
  return JSON.parse(dataStr);
}

function renderBookingInfo() {
  const data = loadBookingData();
  if (!data) return;

  movieTitleElem.textContent = data.movieTitle;
  showtimeInfoElem.textContent = `Showtime: ${data.showtimeTime}`;
  ticketPriceElem.textContent = `Ticket Price: $${data.ticketPrice}`;
}

//  randomly mark some seats occupied
function generateRandomOccupied() {
  occupiedSeats.clear();
  while (occupiedSeats.size < 10) {
    let seatNum = Math.floor(Math.random() * (ROWS * COLS)) + 1;
    occupiedSeats.add(seatNum);
  }
}

function renderSeats() {
  seatsContainer.innerHTML = "";

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const seatNum = row * COLS + col + 1;
      const seat = document.createElement("div");
      seat.classList.add("seat");

      // Label each seat as "A1", "A2", ... "E11"
      seat.textContent = `${ROW_LABELS[row]}${col + 1}`;

      if (occupiedSeats.has(seatNum)) {
        seat.classList.add("occupied");
      }

      if (!seat.classList.contains("occupied")) {
        seat.addEventListener("click", () => {
          if (seat.classList.contains("selected")) {
            seat.classList.remove("selected");
            selectedSeats = selectedSeats.filter((s) => s !== seatNum);
          } else {
            seat.classList.add("selected");
            selectedSeats.push(seatNum);
          }
          confirmBtn.disabled = selectedSeats.length === 0;
          confirmationDiv.textContent = "";
        });
      }

      seatsContainer.appendChild(seat);
    }
  }
}

confirmBtn.addEventListener("click", () => {
  if (selectedSeats.length === 0) return;

  const seatLabels = selectedSeats
    .map((num) => {
      const rowIndex = Math.floor((num - 1) / COLS);
      const colIndex = (num - 1) % COLS;
      return `${ROW_LABELS[rowIndex]}${colIndex + 1}`;
    })
    .join(", ");

  confirmationDiv.textContent = `Booking confirmed for seats: ${seatLabels}`;
  showTicket(
    "Sample Movie",
    "06-01-2026",
    "7:30 PM",
    seatLabels
  );

  // Optionally, store booking to localStorage or send to server here

  // Reset selection and disable button
  selectedSeats = [];
  confirmBtn.disabled = true;
  renderSeats();
});

// Initialize
generateRandomOccupied();
renderBookingInfo();
renderSeats();
function showTicket(movie, date, time, seats) {
  document.getElementById("ticketSlip").style.display = "block";

  document.getElementById("movieName").innerText = movie;
  document.getElementById("movieDate").innerText = date;
  document.getElementById("movieTime").innerText = time;
  document.getElementById("movieSeats").innerText = seats;

  document.getElementById("bookingId").innerText =
    "BK" + Math.floor(Math.random() * 100000);
}

function downloadTicket() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  pdf.text("Movie Ticket Confirmation", 20, 20);
  pdf.text("Movie: " + movieName.innerText, 20, 40);
  pdf.text("Date: " + movieDate.innerText, 20, 50);
  pdf.text("Time: " + movieTime.innerText, 20, 60);
  pdf.text("Seats: " + movieSeats.innerText, 20, 70);
  pdf.text("Theatre: Cineplex", 20, 80);
  pdf.text("Booking ID: " + bookingId.innerText, 20, 90);

  pdf.save("Movie_Ticket.pdf");
}
