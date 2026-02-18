/**
 * Service responsible for fetching weather data from the Open-Meteo API.
 * Encapsulates all three forecast endpoints (current, hourly, daily)
 * and applies the stale-while-revalidate caching strategy.
 */

import { OPEN_METEO_FORECAST_URL } from "../constants/api.js";
import {
  WEATHER_CACHE_TTL,
  HOURLY_SLOTS,
  WEEKLY_SLOTS,
} from "../constants/config.js";
import { getWeatherDescription } from "../constants/weather-codes.js";
import { CacheService } from "./CacheService.js";

/** Build a cache key from prefix + coordinates. */
function cacheKey(prefix, lat, lon) {
  return `${prefix}_${lat}_${lon}`;
}

export class WeatherService {
  /**
   * Fetch current weather for given coordinates.
   * Returns a normalized weather object.
   * @param {{ lat: number, lon: number, name: string }} location
   * @returns {Promise<object>}
   */
  static async fetchCurrent(location) {
    const { lat, lon, name } = location;
    const key = cacheKey("current_v2", lat, lon);

    const url =
      `${OPEN_METEO_FORECAST_URL}` +
      `?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,uv_index,visibility,weather_code,is_day` +
      `&daily=sunrise,sunset` +
      `&timezone=auto`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const cur = data?.current ?? {};
    const daily = data?.daily ?? {};
    const temp = cur.temperature_2m;
    const code = cur.weather_code;

    if (typeof temp !== "number")
      throw new Error("Temperature data not available");

    const weather = {
      city: name,
      tempC: temp,
      code,
      desc: getWeatherDescription(code),
      lat,
      lon,
      humidity: cur.relative_humidity_2m,
      windspeed: cur.wind_speed_10m,
      apparent_tempC: cur.apparent_temperature,
      uv_index: cur.uv_index,
      visibility: cur.visibility,
      is_day: cur.is_day,
      sunrise: (daily.sunrise ?? [])[0] ?? null,
      sunset: (daily.sunset ?? [])[0] ?? null,
    };

    CacheService.write(key, weather);
    return weather;
  }

  /**
   * Read cached current weather if available.
   * @param {number} lat
   * @param {number} lon
   * @returns {object|null}
   */
  static getCachedCurrent(lat, lon) {
    return CacheService.read(
      cacheKey("current_v2", lat, lon),
      WEATHER_CACHE_TTL,
    );
  }

  /**
   * Fetch hourly forecast (next N hours) for given coordinates.
   * @param {number} lat
   * @param {number} lon
   * @returns {Promise<Array<{ time: string, tempC: number, code: number, precip: number }>>}
   */
  static async fetchHourly(lat, lon) {
    const key = cacheKey("hourly", lat, lon);

    const url =
      `${OPEN_METEO_FORECAST_URL}` +
      `?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}` +
      `&hourly=temperature_2m,weathercode,precipitation` +
      `&current_weather=true&timezone=auto`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const times = data?.hourly?.time ?? [];
    const temps = data?.hourly?.temperature_2m ?? [];
    const codes = data?.hourly?.weathercode ?? [];
    const precips = data?.hourly?.precipitation ?? [];

    const currentTime = data?.current_weather?.time;
    let startIndex = 0;

    if (currentTime) {
      const curr = new Date(currentTime);
      const needsRoundUp =
        curr.getMinutes() > 0 ||
        curr.getSeconds() > 0 ||
        curr.getMilliseconds() > 0;
      const target = new Date(curr);
      if (needsRoundUp) target.setHours(curr.getHours() + 1, 0, 0, 0);
      else target.setMinutes(0, 0, 0);

      startIndex = times.findIndex(
        (t) => new Date(t).getTime() >= target.getTime(),
      );
      if (startIndex === -1) {
        startIndex = Math.max(0, times.length - HOURLY_SLOTS);
      }
    }

    const slice = [];
    for (
      let i = startIndex;
      i < Math.min(startIndex + HOURLY_SLOTS, times.length);
      i++
    ) {
      slice.push({
        time: times[i],
        tempC: temps[i],
        code: codes[i],
        precip: precips[i] ?? 0,
      });
    }

    CacheService.write(key, slice);
    return slice;
  }

  /**
   * Read cached hourly forecast if available.
   * @param {number} lat
   * @param {number} lon
   * @returns {Array|null}
   */
  static getCachedHourly(lat, lon) {
    const cached = CacheService.read(
      cacheKey("hourly", lat, lon),
      WEATHER_CACHE_TTL,
    );
    return cached && Array.isArray(cached) && cached.length ? cached : null;
  }

  /**
   * Fetch weekly (daily) forecast for given coordinates.
   * @param {number} lat
   * @param {number} lon
   * @returns {Promise<Array<{ date: string, maxC: number, minC: number, code: number }>>}
   */
  static async fetchWeekly(lat, lon) {
    const key = cacheKey("weekly", lat, lon);

    const url =
      `${OPEN_METEO_FORECAST_URL}` +
      `?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}` +
      `&daily=temperature_2m_max,temperature_2m_min,weathercode` +
      `&timezone=auto`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const times = data?.daily?.time ?? [];
    const maxs = data?.daily?.temperature_2m_max ?? [];
    const mins = data?.daily?.temperature_2m_min ?? [];
    const codes = data?.daily?.weathercode ?? [];

    // Start from next day (index 1) when data has more than 7 entries.
    const start = times.length > WEEKLY_SLOTS ? 1 : 0;
    const arr = [];

    for (let i = start; i < Math.min(start + WEEKLY_SLOTS, times.length); i++) {
      arr.push({
        date: times[i],
        maxC: Number(maxs[i]),
        minC: Number(mins[i]),
        code: codes[i],
      });
    }

    CacheService.write(key, arr);
    return arr;
  }

  /**
   * Read cached weekly forecast if available.
   * @param {number} lat
   * @param {number} lon
   * @returns {Array|null}
   */
  static getCachedWeekly(lat, lon) {
    const cached = CacheService.read(
      cacheKey("weekly", lat, lon),
      WEATHER_CACHE_TTL,
    );
    return cached && Array.isArray(cached) && cached.length ? cached : null;
  }
}
