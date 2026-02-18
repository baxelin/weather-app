/**
 * Manages the user's favorite cities in localStorage.
 * Enforces a maximum limit and provides CRUD operations.
 */

import { STORAGE_KEYS, MAX_FAVORITES } from "../constants/config.js";

export class FavoritesStore {
  /**
   * Retrieve all saved favorite cities.
   * @returns {Array<{ name: string, lat: number, lon: number }>}
   */
  static getAll() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES) || "[]");
    } catch {
      return [];
    }
  }

  /**
   * Persist the favorites array.
   * @param {Array} favorites
   */
  static save(favorites) {
    try {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    } catch {
      // fail silently
    }
  }

  /**
   * Check if a city name is already in favorites.
   * @param {string} name
   * @returns {boolean}
   */
  static isFavorite(name) {
    return FavoritesStore.getAll().some((f) => f.name === name);
  }

  /**
   * Toggle a city in/out of favorites.
   * If the city exists, remove it. Otherwise add it (respecting MAX_FAVORITES).
   * @param {{ name: string, lat: number, lon: number }} city
   */
  static toggle(city) {
    const favorites = FavoritesStore.getAll();
    const index = favorites.findIndex((f) => f.name === city.name);

    if (index >= 0) {
      favorites.splice(index, 1);
    } else {
      favorites.push(city);
      if (favorites.length > MAX_FAVORITES) favorites.shift();
    }

    FavoritesStore.save(favorites);
  }
}
