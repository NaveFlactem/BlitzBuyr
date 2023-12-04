/**
 * @namespace CalculateFontSize
 * 
 */

/**
 * @param {number} price
 * @function calculateFontSize
 * @description Calculates the font size for the price based on the number of digits in the price
 * @returns {number} fontSize
 */
export const calculateFontSize = (price) => {
  if (price === undefined || price === null) {
    return 16; // Default font size if price is not provided
  }
  const numberOfDigits = price.toString().length;

  return Math.max(20 - (numberOfDigits - 4) * 2, 4);
};

/**
 *
 * @param {string} city
 * @function calculateFontSizeLocation
 * @description Calculates the font size for the city name based on the length of the city name
 * @returns {number} fontSize
 */
export const calculateFontSizeLocation = (city) => {
  if (city === undefined || city === null) {
    return 16; // Default font size if price is not provided
  }
  const numberOfCharacters = city.length;

  return Math.max(20 - (numberOfCharacters - 2), 10);
};

/**
 * @function calculateTransactionFontSize
 * @param {string} transaction
 * @description Calculates the font size for the transaction preference based on the length of the transaction preference
 * @returns {number} fontSize
 */
export const calculateTransactionFontSize = (transaction) => {
  if (transaction === undefined || transaction === null) {
    return 16; // Default font size if price is not provided
  }
  const numberOfCharacters = transaction.length;

  return Math.min(24 - (numberOfCharacters - 2), 14);
};

/**
 * @function calculateTagTextFontSize
 * @param {string} tag
 * @param {number} defaultFontSize
 * @description Calculates the font size for the tag based on the length of the tag name and the default font size provided as a parameter
* @returns {number} fontSize
 */
export const calculateTagTextFontSize = (tag, defaultFontSize) => {
  if (tag === undefined || tag === null) {
    return defaultFontSize; // Default font size if price is not provided
  }
  const numberOfCharacters = tag.length;

  return Math.min(20 - (numberOfCharacters - 4), defaultFontSize);
};
