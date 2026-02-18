/**
 * Service responsible for geocoding operations:
 *  - Forward geocoding (city name → coordinates) via Open-Meteo
 *  - Reverse geocoding (coordinates → city name) via Nominatim
 *  - Browser geolocation API wrapper
 */

import {
  OPEN_METEO_GEOCODING_URL,
  NOMINATIM_REVERSE_URL,
} from "../constants/api.js";
import {
  GEOCODING_CACHE_TTL,
  GEOCODING_RESULT_COUNT,
} from "../constants/config.js";
import { CacheService } from "./CacheService.js";

export class GeocodingService {
  /**
   * Search cities by name using Open-Meteo geocoding API.
   * Results are cached for GEOCODING_CACHE_TTL.
   *
   * @param {string} query - Search text.
   * @returns {Promise<Array<{ name: string, lat: number, lon: number, country: string, source: string }>>}
   */
  static async searchCities(query) {
    if (!query) return [];

    const cacheKey = `geo_${query}`;
    const cached = CacheService.read(cacheKey, GEOCODING_CACHE_TTL);
    if (cached) return cached;

    try {
      const url = `${OPEN_METEO_GEOCODING_URL}?name=${encodeURIComponent(query)}&count=${GEOCODING_RESULT_COUNT}&language=en`;
      const res = await fetch(url);
      if (!res.ok) return [];

      const data = await res.json();
      const results = (data?.results || []).map((r) => ({
        name: `${r.name}${r.admin1 ? ", " + r.admin1 : ""}${r.country ? ", " + r.country : ""}`,
        lat: r.latitude,
        lon: r.longitude,
        country: r.country,
        source: "geo",
      }));

      CacheService.write(cacheKey, results);
      return results;
    } catch {
      return [];
    }
  }

  /**
   * Reverse geocode coordinates to a city name using Nominatim.
   *
   * @param {number} lat
   * @param {number} lon
   * @returns {Promise<{ name: string, lat: number, lon: number }>}
   */
  static async reverseGeocode(lat, lon) {
    try {
      const res = await fetch(
        `${NOMINATIM_REVERSE_URL}?lat=${lat}&lon=${lon}&format=json`,
      );
      const data = await res.json();
      const city =
        data.address?.city ||
        data.address?.town ||
        data.address?.village ||
        data.name ||
        "My location";
      const country = data.address?.country || "";
      const name = country ? `${city}, ${country}` : city;
      return { name, lat, lon };
    } catch {
      const name = `${lat.toFixed(3)}, ${lon.toFixed(3)}`;
      return { name, lat, lon };
    }
  }

  /**
   * Get the user's current position using the browser Geolocation API.
   * Returns a Promise that resolves with coords or rejects on error.
   *
   * @returns {Promise<{ latitude: number, longitude: number }>}
   */
  static getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported"));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          }),
        (err) => reject(err),
      );
    });
  }
}
