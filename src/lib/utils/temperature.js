/**
 * Temperature conversion and formatting utilities.
 */

/**
 * Convert Celsius to Fahrenheit.
 * @param {number} celsius
 * @returns {number}
 */
export function toFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32;
}

/**
 * Round temperature to one decimal place.
 * @param {number} temp
 * @returns {number}
 */
export function formatTemp(temp) {
  return Math.round(temp * 10) / 10;
}

/**
 * Get the display temperature in the requested unit.
 * @param {number} celsius - Temperature in Celsius.
 * @param {'C'|'F'} unit   - Desired unit.
 * @returns {number}
 */
export function convertTemp(celsius, unit) {
  return unit === "F" ? toFahrenheit(celsius) : celsius;
}

/**
 * Get the unit symbol string for display.
 * @param {'C'|'F'} unit
 * @returns {string}
 */
export function unitSymbol(unit) {
  return unit === "F" ? "°F" : "°C";
}
