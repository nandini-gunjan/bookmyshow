// =========================================
// TMDB CONFIGURATION
// =========================================

const TMDB_ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YjA1MWYzMmI5YmZhMDhlY2E0NTllOWFiMTIyY2E4MSIsIm5iZiI6MTc4Njc5MDUwOC4yOTIsInN1YiI6IjZhODA0MjZjZGMwNjE3NWExMWIzMmYzOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.zSKn50ikKCJI5Ooqiu5ysCKJX8vX6tJBooRdYeYyEA4";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const TMDB_IMAGE_URL = "https://image.tmdb.org/t/p/w500";

// =========================================
// FETCH NOW PLAYING MOVIES
// =========================================

async function getNowPlayingMovies(language = "en-US", region = "IN") {
  try {
    const url =
      `${TMDB_BASE_URL}/movie/now_playing` +
      `?language=${language}` +
      `&region=${region}` +
      `&page=1`;

    const response = await fetch(url, {
      method: "GET",

      headers: {
        accept: "application/json",

        Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();

      console.error("TMDB HTTP Error:", response.status, errorText);

      throw new Error(`TMDB request failed with status ${response.status}`);
    }



    console.log("hello");
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
      ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
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
// GET MOVIE DETAILS
// =========================================

async function getMovieDetails(movieId) {
  try {
    const url =
      `${TMDB_BASE_URL}/movie/${movieId}` +
      `?language=en-US` +
      `&append_to_response=credits,videos`;

    const response = await fetch(url, {
      method: "GET",

      headers: {
        accept: "application/json",

        Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();

      console.error(
        "TMDB Movie Details HTTP Error:",
        response.status,
        errorText,
      );

      throw new Error(
        `TMDB movie details request failed with status ${response.status}`,
      );
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("TMDB Movie Details Error:", error);

    return null;
  }
}

// =========================================
// FORMAT MOVIE DETAILS
// =========================================

function formatMovieDetails(movie) {
  if (!movie) {
    return null;
  }

  // =======================================
  // LANGUAGE
  // =======================================

  const languageMap = {
    en: "English",
    hi: "Hindi",
    mr: "Marathi",
    ta: "Tamil",
    te: "Telugu",
    ml: "Malayalam",
    kn: "Kannada",
    bn: "Bengali",
    pa: "Punjabi",
    gu: "Gujarati",
  };

  const language =
    languageMap[movie.original_language] ||
    movie.original_language ||
    "Unknown";

  // =======================================
  // GENRES
  // =======================================

  const genre = movie.genres
    ? movie.genres.map((genre) => genre.name).join(", ")
    : "";

  // =======================================
  // RUNTIME
  // =======================================

  let duration = "N/A";

  if (movie.runtime) {
    const hours = Math.floor(movie.runtime / 60);

    const minutes = movie.runtime % 60;

    if (hours > 0) {
      duration = `${hours}h ${minutes}m`;
    } else {
      duration = `${minutes}m`;
    }
  }

  // =======================================
  // RATING
  // =======================================

  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";

  // =======================================
  // VOTES
  // =======================================

  let votes = "0";

  if (movie.vote_count) {
    votes =
      movie.vote_count >= 1000
        ? `${(movie.vote_count / 1000).toFixed(1)}K`
        : movie.vote_count.toString();
  }

  // =======================================
  // POSTER
  // =======================================

  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "";

  // =======================================
  // BACKDROP
  // =======================================

  const backdrop = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : "";

  // =======================================
  // TRAILER
  // =======================================

  let trailer = "";

  if (movie.videos?.results) {
    const trailerVideo = movie.videos.results.find(
      (video) => video.site === "YouTube" && video.type === "Trailer",
    );

    if (trailerVideo) {
      trailer = `https://www.youtube.com/embed/${trailerVideo.key}`;
    }
  }

  // =======================================
  // CAST
  // =======================================

  const cast =
    movie.credits?.cast?.slice(0, 10).map((person) => ({
      name: person.name,
      role: person.character || "",
      image: person.profile_path
        ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
        : "",
    })) || [];

  // =======================================
  // CREW
  // =======================================

  const crew =
    movie.credits?.crew
      ?.filter(
        (person) =>
          person.job === "Director" ||
          person.job === "Producer" ||
          person.job === "Music Director" ||
          person.job === "Original Music Composer",
      )
      .slice(0, 10)
      .map((person) => ({
        name: person.name,

        role: person.job,
      })) || [];

  // =======================================
  // RETURN BOOKITBRO FORMAT
  // =======================================

  return {
    id: movie.id,
    title: movie.title,
    poster,
    backdrop,
    rating,
    votes,
    certificate: "UA",
    duration,
    language,
    genre,
    description: movie.overview || "",
    about: movie.overview || "",
    trailer,
    cast,
    crew,
  };
}

// =========================================
// EXPORT
// =========================================

export {
  getNowPlayingMovies,
  getMovies,
  formatMovie,
  getMovieDetails,
  formatMovieDetails,
};
