// =========================================
// TMDB CONFIGURATION
// =========================================

const TMDB_API_KEY = "5b051f32b9bfa08eca459e9ab122ca81";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const TMDB_IMAGE_URL = "https://image.tmdb.org/t/p/w500";

// =========================================
// FETCH NOW PLAYING MOVIES
// =========================================

async function getNowPlayingMovies(language = "en-US", region = "IN") {
  try {
    const url =
      `${TMDB_BASE_URL}/movie/now_playing` +
      `?api_key=${TMDB_API_KEY}` +
      `&language=${language}` +
      `&region=${region}` +
      `&page=1`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`TMDB request failed: ${response.status}`);
    }

    const data = await response.json();

    return data.results || [];
  } catch (error) {
    console.error("TMDB Error:", error);

    return [];
  }
}

// =========================================
// CONVERT TMDB MOVIE
// =========================================

function formatMovie(movie) {
  return {
    id: movie.id,

    title: movie.title,

    language: movie.original_language,

    rating: movie.vote_average ? movie.vote_average.toFixed(1) : "N/A",

    genre: "",

    image: movie.poster_path
      ? `${TMDB_IMAGE_URL}${movie.poster_path}`
      : "assets/images/no-poster.jpg",

    backdrop: movie.backdrop_path
      ? `${TMDB_IMAGE_URL}${movie.backdrop_path}`
      : "",

    overview: movie.overview,

    releaseDate: movie.release_date,
  };
}

// =========================================
// GET FORMATTED MOVIES
// =========================================

async function getMovies() {
  const movies = await getNowPlayingMovies();

  return movies.map(formatMovie);
}

// =========================================
// EXPORT
// =========================================

export { getNowPlayingMovies, getMovies, formatMovie };
