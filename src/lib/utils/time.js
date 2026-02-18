/**
 * Time and date formatting utilities.
 */

/**
 * Extract HH:MM from an ISO datetime string.
 * @param {string|null} isoStr
 * @returns {string} Formatted time or '--'
 */
export function formatTime(isoStr) {
  if (!isoStr) return "--";
  const match = isoStr.match(/T(\d{2}:\d{2})/);
  return match ? match[1] : "--";
}

/**
 * Convert an ISO datetime to a short hour label (e.g. "14h").
 * @param {string} iso
 * @returns {string}
 */
export function hourLabel(iso) {
  const match = iso.match(/T(\d{2}):/);
  return match ? `${Number(match[1])}h` : iso;
}

/**
 * Convert an ISO date string to a short weekday label (e.g. "MON").
 * @param {string} isoDate
 * @returns {string}
 */
export function dayLabel(isoDate) {
  try {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
  } catch {
    return isoDate;
  }
}
