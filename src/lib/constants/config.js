/**
 * Application-wide configuration constants.
 * Single source of truth for magic numbers and limits.
 */

/** Cache TTL for weather data (current / hourly / weekly): 10 minutes. */
export const WEATHER_CACHE_TTL = 10 * 60 * 1000;

/** Cache TTL for geocoding results: 1 hour. */
export const GEOCODING_CACHE_TTL = 60 * 60 * 1000;

/** Maximum number of saved favorite cities. */
export const MAX_FAVORITES = 5;

/** Maximum number of saved search history entries. */
export const MAX_HISTORY = 5;

/** Debounce delay (ms) for geocoding API calls during typing. */
export const DEBOUNCE_DELAY = 300;

/** Maximum number of autocomplete suggestions shown. */
export const MAX_SUGGESTIONS = 8;

/** Maximum local autocomplete matches before geocoding results. */
export const MAX_LOCAL_SUGGESTIONS = 6;

/** Number of geocoding results requested from Open-Meteo. */
export const GEOCODING_RESULT_COUNT = 6;

/** Number of hourly forecast slots to display. */
export const HOURLY_SLOTS = 12;

/** Number of daily forecast slots to display. */
export const WEEKLY_SLOTS = 7;

/** Error display duration (ms) before auto-clearing. */
export const ERROR_DISPLAY_DURATION = 4000;

/** localStorage keys. */
export const STORAGE_KEYS = {
  FAVORITES: "weather_favorites",
  HISTORY: "weather_history",
};
