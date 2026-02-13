import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

export const TMDB_CONFIG = {
  getPoster: (path, size = 'w500') => `${IMAGE_BASE_URL}/${size}${path}`,
  getBackdrop: (path, size = 'original') => `${IMAGE_BASE_URL}/${size}${path}`,
};

export const fetchTrending = async (type = 'movie', timeWindow = 'day') => {
  const { data } = await tmdbApi.get(`/trending/${type}/${timeWindow}`);
  return data.results;
};

export const fetchMovies = async (category = 'popular', page = 1) => {
  const { data } = await tmdbApi.get(`/movie/${category}`, { params: { page } });
  return data.results;
};

export const fetchTVShows = async (category = 'popular', page = 1) => {
  const { data } = await tmdbApi.get(`/tv/${category}`, { params: { page } });
  return data.results;
};

export const searchContent = async (query, page = 1) => {
  const { data } = await tmdbApi.get('/search/multi', { params: { query, page } });
  return data.results;
};

export const fetchDetails = async (id, type) => {
  const { data } = await tmdbApi.get(`/${type}/${id}`, {
    params: { append_to_response: 'videos,credits,recommendations' },
  });
  return { ...data, media_type: type }; // Ensure media_type is persistent
};

export const fetchSeasonDetails = async (tvId, seasonNumber) => {
  const { data } = await tmdbApi.get(`/tv/${tvId}/season/${seasonNumber}`);
  return data;
};

// New functions for cinematic home page
export const fetchByProvider = async (type = 'tv', providerId) => {
  const { data } = await tmdbApi.get(`/discover/${type}`, {
    params: {
      with_watch_providers: providerId,
      watch_region: 'US',
      sort_by: 'popularity.desc'
    }
  });
  return data.results;
};

export const fetchByGenre = async (type = 'movie', genreId) => {
  const { data } = await tmdbApi.get(`/discover/${type}`, {
    params: {
      with_genres: genreId,
      sort_by: 'popularity.desc'
    }
  });
  return data.results;
};

export const WATCH_PROVIDERS = {
  NETFLIX: 8,
  PRIME: 9,
  DISNEY: 337,
  APPLE: 350,
  MAX: 1899,
  PARAMOUNT: 531
};

export const GENRE_IDS = {
  ACTION: 28,
  COMEDY: 35,
  DRAMA: 18,
  SCIFI: 878,
  HORROR: 27,
  ROMANCE: 10749,
  ANIMATION: 16
};

export default tmdbApi;
