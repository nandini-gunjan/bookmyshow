// =========================================
// TMDB CONFIGURATION
// =========================================

const TMDB_ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YjA1MWYzMmI5YmZhMDhlY2E0NTllOWFiMTIyY2E4MSIsIm5iZiI6MTc4Njc5MDUwOC4yOTIsInN1YiI6IjZhODA0MjZjZGMwNjE3NWExMWIzMmYzOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.zSKn50ikKCJI5Ooqiu5ysCKJX8vX6tJBooRdYeYyEA4";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const TMDB_POSTER_URL = "https://image.tmdb.org/t/p/w500";
const TMDB_BACKDROP_URL = "https://image.tmdb.org/t/p/original";
const TMDB_CAST_IMAGE_URL = "https://image.tmdb.org/t/p/w185";


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
      throw new Error(`TMDB request failed: ${response.status}`);
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
  if (!movie) {
    return null;
  }

  return {
    id: movie.id,

    title: movie.title || movie.original_title || "Untitled",

    language: movie.original_language || "Unknown",

    rating:
      movie.vote_average !== undefined && movie.vote_average !== null
        ? movie.vote_average.toFixed(1)
        : "N/A",

    genre: "",

    image: movie.poster_path
      ? `${TMDB_POSTER_URL}${movie.poster_path}`
      : "assets/images/no-poster.jpg",

    backdrop: movie.backdrop_path
      ? `${TMDB_IMAGE_URL}${movie.backdrop_path}`
      : "",

    overview: movie.overview || "",

    releaseDate: movie.release_date || "",
  };
}


// =========================================
// GET FORMATTED MOVIES
// =========================================

async function getMovies() {
  const movies = await getNowPlayingMovies();

  return movies
    .map(formatMovie)
    .filter((movie) => movie !== null);
}


// =========================================
// GET MOVIE DETAILS
// =========================================

async function getMovieDetails(movieId) {

  if (!movieId) {
    console.error("Movie ID is missing.");
    return null;
  }

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
      throw new Error(`TMDB movie details request failed: ${response.status}`);
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
    ur: "Urdu",
    or: "Odia",

  };


  const language =
    languageMap[movie.original_language] ||
    movie.original_language ||
    "Unknown";


  // =======================================
  // GENRES
  // =======================================

  const genre = movie.genres?.length
    ? movie.genres.map((genre) => genre.name).join(", ")
    : "N/A";


  // =======================================
  // RUNTIME
  // =======================================

  let duration = "N/A";

  if (movie.runtime) {

    const hours = Math.floor(movie.runtime / 60);

    const minutes = movie.runtime % 60;

    if (hours > 0) {

      duration =
        minutes > 0
          ? `${hours}h ${minutes}m`
          : `${hours}h`;

    } else {

      duration = `${minutes}m`;
    }
  }


  // =======================================
  // RATING
  // =======================================

  const rating =
    movie.vote_average !== undefined &&
    movie.vote_average !== null
      ? movie.vote_average.toFixed(1)
      : "N/A";


  // =======================================
  // VOTES
  // =======================================

  let votes = "0";

  if (movie.vote_count) {

    if (movie.vote_count >= 1000000) {

      votes =
        `${(movie.vote_count / 1000000).toFixed(1)}M`;

    } else if (movie.vote_count >= 1000) {

      votes =
        `${(movie.vote_count / 1000).toFixed(1)}K`;

    } else {

      votes = movie.vote_count.toString();
    }
  }


  // =======================================
  // POSTER
  // =======================================

  const poster = movie.poster_path
    ? `${TMDB_POSTER_URL}${movie.poster_path}`
    : "assets/images/no-poster.jpg";


  // =======================================
  // BACKDROP
  // =======================================

  const backdrop = movie.backdrop_path
    ? `${TMDB_BACKDROP_URL}${movie.backdrop_path}`
    : "";


  // =======================================
  // TRAILER
  // =======================================

  let trailer = "";

  const videos = movie.videos?.results || [];

  // First try official trailer
  let trailerVideo = videos.find(
    (video) =>
      video.site === "YouTube" &&
      video.type === "Trailer" &&
      video.official === true
  );

  // If official trailer doesn't exist,
  // find any YouTube trailer
  if (!trailerVideo) {

    trailerVideo = videos.find(
      (video) =>
        video.site === "YouTube" &&
        video.type === "Trailer"
    );
  }

  // If trailer exists
  if (trailerVideo) {

    trailer =
      `https://www.youtube.com/embed/${trailerVideo.key}`;
  }


  // =======================================
  // CAST
  // =======================================

  const cast =
    movie.credits?.cast
      ?.slice(0, 10)
      .map((person) => ({

        name: person.name || "Unknown",

        role: person.character || "Unknown",

        image: person.profile_path
          ? `${TMDB_CAST_IMAGE_URL}${person.profile_path}`
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
          person.job === "Original Music Composer"
      )
      .slice(0, 10)
      .map((person) => ({

        name: person.name || "Unknown",

        role: person.job || "Unknown",

      })) || [];


  // =======================================
  // RETURN BOOKITBRO FORMAT
  // =======================================

  return {

    id: movie.id,

    title:
      movie.title ||
      movie.original_title ||
      "Untitled",

    poster,

    backdrop,

    rating,

    votes,

    certificate: "UA",

    duration,

    language,

    genre,

    description:
      movie.overview ||
      "No description available.",

    about:
      movie.overview ||
      "No information available.",

    trailer,

    cast,

    crew,

    releaseDate:
      movie.release_date || "",

    tagline:
      movie.tagline || "",

    popularity:
      movie.popularity || 0,

  };
}


// =========================================
// GET AND FORMAT MOVIE DETAILS
// =========================================

async function getFormattedMovieDetails(movieId) {

  const movie = await getMovieDetails(movieId);

  if (!movie) {
    return null;
  }

  return formatMovieDetails(movie);
}


// =========================================
// EXPORT
// =========================================

export { getNowPlayingMovies, getMovies, formatMovie, getMovieDetails, formatMovieDetails };
