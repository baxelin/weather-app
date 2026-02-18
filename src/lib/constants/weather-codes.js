/**
 * WMO Weather Interpretation Codes (WW)
 * @see https://open-meteo.com/en/docs#weathervariables
 */

/** Human-readable description for each WMO weather code. */
export const weatherCodeMap = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  56: "Light freezing drizzle",
  57: "Dense freezing drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Light freezing rain",
  67: "Heavy freezing rain",
  71: "Slight snow fall",
  73: "Moderate snow fall",
  75: "Heavy snow fall",
  77: "Snow grains",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  85: "Slight snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail",
};

/** Emoji icon for each WMO weather code. */
export const weatherIconMap = {
  0: "☀️",
  1: "🌤️",
  2: "⛅",
  3: "☁️",
  45: "🌫️",
  48: "🌫️",
  51: "🌦️",
  53: "🌦️",
  55: "🌧️",
  56: "🥶🌧️",
  57: "🥶🌧️",
  61: "🌧️",
  63: "🌧️",
  65: "🌧️",
  66: "🥶🌧️",
  67: "🥶🌧️",
  71: "🌨️",
  73: "🌨️",
  75: "🌨️",
  77: "🌨️",
  80: "🌧️",
  81: "🌧️",
  82: "⛈️",
  85: "🌨️",
  86: "🌨️",
  95: "⛈️",
  96: "⛈️",
  99: "⛈️",
};

/** WMO codes that represent severe weather conditions worth alerting about. */
export const ALERT_CODES = new Set([
  63, 65, 67, 80, 81, 82, 85, 86, 95, 96, 99,
]);

/**
 * Resolve display description for a given WMO code.
 * @param {number} code
 * @returns {string}
 */
export function getWeatherDescription(code) {
  return weatherCodeMap[code] ?? "Unknown";
}

/**
 * Resolve display icon for a given WMO code.
 * @param {number} code
 * @returns {string}
 */
export function getWeatherIcon(code) {
  return weatherIconMap[code] ?? "🌡️";
}

/**
 * Check whether a WMO code triggers a severe weather alert.
 * @param {number} code
 * @returns {boolean}
 */
export function isAlertCode(code) {
  return ALERT_CODES.has(code);
}
