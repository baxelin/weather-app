/**
 * Generic localStorage cache with TTL (stale-while-revalidate pattern).
 * Single Responsibility: read/write cached values with expiration.
 */

export class CacheService {
  /**
   * Read a cached value if it exists and hasn't expired.
   * @param {string} key  - localStorage key.
   * @param {number} ttl  - Time-to-live in milliseconds.
   * @returns {*|null}       Cached value or null if miss/expired.
   */
  static read(key, ttl) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;

      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.ts) return null;

      const isExpired = Date.now() - parsed.ts > ttl;
      if (isExpired) {
        localStorage.removeItem(key);
        return null;
      }

      return parsed.v;
    } catch {
      return null;
    }
  }

  /**
   * Write a value to cache with a timestamp.
   * @param {string} key - localStorage key.
   * @param {*}      val - Value to cache (must be JSON-serializable).
   */
  static write(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify({ ts: Date.now(), v: val }));
    } catch {
      // localStorage full or unavailable — fail silently
    }
  }

  /**
   * Remove a cached entry.
   * @param {string} key
   */
  static remove(key) {
    try {
      localStorage.removeItem(key);
    } catch {
      // fail silently
    }
  }
}
