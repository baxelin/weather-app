/**
 * Manages the user's recent search history in localStorage.
 * New entries are prepended; duplicates are removed; the list is capped.
 */

import { STORAGE_KEYS, MAX_HISTORY } from "../constants/config.js";

export class HistoryStore {
  /**
   * Retrieve all saved history entries (most recent first).
   * @returns {Array<{ name: string, lat: number, lon: number }>}
   */
  static getAll() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || "[]");
    } catch {
      return [];
    }
  }

  /**
   * Add a city to the top of the history.
   * Removes any existing entry with the same name.
   * @param {{ name: string, lat: number, lon: number }} city
   */
  static add(city) {
    const history = HistoryStore.getAll().filter((h) => h.name !== city.name);
    history.unshift(city);

    try {
      localStorage.setItem(
        STORAGE_KEYS.HISTORY,
        JSON.stringify(history.slice(0, MAX_HISTORY)),
      );
    } catch {
      // fail silently
    }
  }
}
