const nowShowing = [
  {
    id: "spiderman-3",
    title: "Spider-Man: No Way Home",
    poster: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
    showtimes: [
      { id: "showtime1", time: "09:00 AM", price: 12 },
      { id: "showtime2", time: "12:00 PM", price: 15 },
      { id: "showtime3", time: "04:00 PM", price: 10 },
      { id: "showtime4", time: "07:00 PM", price: 20 },
    ],
  },
  {
    id: "doctor-strange-2",
    title: "Doctor Strange: Multiverse of Madness",
    poster: "https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg",
    showtimes: [
      { id: "showtime5", time: "10:00 AM", price: 11 },
      { id: "showtime6", time: "02:00 PM", price: 14 },
      { id: "showtime7", time: "05:30 PM", price: 18 },
    ],
  },
  {
    id: "black-widow",
    title: "Black Widow",
    poster: "https://image.tmdb.org/t/p/w500/qAZ0pzat24kLdO3o8ejmbLxyOac.jpg",
    showtimes: [
      { id: "showtime8", time: "11:30 AM", price: 13 },
      { id: "showtime9", time: "03:30 PM", price: 16 },
      { id: "showtime10", time: "06:00 PM", price: 14 },
    ],
  },
];

const upcoming = [
  {
    id: "thor-love-and-thunder",
    title: "Thor: Love and Thunder",
    poster: "https://image.tmdb.org/t/p/w500/pIkRyD18kl4FhoCNQuWxWu5cBLM.jpg",
    showtimes: [],
  },
  {
    id: "avatar-2",
    title: "Avatar: The Way of Water",
    poster: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
    showtimes: [],
  },
  {
    id: "black-panther-2",
    title: "Black Panther: Wakanda Forever",
    poster: "https://image.tmdb.org/t/p/w500/sv1xJUazXeYqALzczSZ3O6nkH75.jpg",
    showtimes: [],
  },
];


// DOM elements
const movieGrid = document.getElementById("movie-grid");
const upcomingGrid = document.getElementById("upcoming-grid");
const showtimeModal = document.getElementById("showtime-modal");
const modalMovieTitle = document.getElementById("modal-movie-title");
const showtimeList = document.getElementById("showtime-list");
const closeBtn = document.querySelector(".close-btn");
const searchBar = document.getElementById("search-bar");

// Render now showing movies (with showtimes)
function renderNowShowing(movies) {
  movieGrid.innerHTML = "";
  movies.forEach((movie) => {
    const card = document.createElement("div");
    card.classList.add("movie-card");
    card.innerHTML = `
      <img src="${movie.poster}" alt="${movie.title}" class="movie-poster" />
      <div class="movie-title">${movie.title}</div>
    `;
    card.addEventListener("click", () => openModal(movie));
    movieGrid.appendChild(card);
  });
}

// Render upcoming movies (no showtimes)
function renderUpcoming(movies) {
  upcomingGrid.innerHTML = "";
  movies.forEach((movie) => {
    const card = document.createElement("div");
    card.classList.add("movie-card");
    card.innerHTML = `
      <img src="${movie.poster}" alt="${movie.title}" class="movie-poster" />
      <div class="movie-title">${movie.title}</div>
    `;
    //  Clicking upcoming movies shows alert or nothing
    card.addEventListener("click", () => {
      alert("Showtimes not available yet for upcoming movies.");
    });
    upcomingGrid.appendChild(card);
  });
}

// Open modal and show showtimes for selected movie
function openModal(movie) {
  if (!movie.showtimes || movie.showtimes.length === 0) {
    alert("Showtimes not available for this movie.");
    return;
  }

  modalMovieTitle.textContent = movie.title;8
  showtimeList.innerHTML = "";

  movie.showtimes.forEach((showtime) => {
    const item = document.createElement("button");
    item.classList.add("showtime-item");
    item.textContent = `${showtime.time} - $${showtime.price}`;
    item.addEventListener("click", () => selectShowtime(movie, showtime));
    showtimeList.appendChild(item);
  });

  showtimeModal.style.display = "flex";
}

// Close modal
closeBtn.addEventListener("click", () => {
  showtimeModal.style.display = "none";
});

// Close modal clicking outside content
window.addEventListener("click", (e) => {
  if (e.target === showtimeModal) {
    showtimeModal.style.display = "none";
  }
});

// Handle showtime selection and navigate to seat selection page
function selectShowtime(movie, showtime) {
  const bookingData = {
    movieId: movie.id,
    movieTitle: movie.title,
    showtimeId: showtime.id,
    showtimeTime: showtime.time,
    ticketPrice: showtime.price,
  };
  localStorage.setItem("bookingData", JSON.stringify(bookingData));
  window.location.href = "seating.html";
}

// Search bar filters now showing movies only
searchBar.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  const filtered = nowShowing.filter((m) =>
    m.title.toLowerCase().includes(query)
  );
  renderNowShowing(filtered);
});

// Initial rendering
renderNowShowing(nowShowing);
renderUpcoming(upcoming);

//newly added
fetch('/api/movies')
  .then(res => res.json())
  .then(data => {
    displayMovies(data.nowShowing, nowShowingContainer);
    displayMovies(data.upcoming, upcomingContainer);
  });

function bookTickets(movieTitle) {
  fetch('/api/book', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ movie: movieTitle, tickets: 1 })
  })
  .then(res => res.json())
  .then(data => alert(data.message));
}