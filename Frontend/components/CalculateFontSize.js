/**
 * @namespace CalculateFontSize
 * @memberof Components
 */

/**
 * @function calculateFontSize
 * @memberof Components.CalculateFontSize
 * @description Calculates the font size for the price based on the number of digits in the price
 * @param {number} price - Price of the item
 * @returns {number} fontSize
 * @example style={{ fontSize: calculateFontSize(price) }}
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
 * @function calculateFontSizeLocation
 * @memberof Components.CalculateFontSize
 * @description Calculates the font size for the city name based on the length of the city name
 * @param {string} city - City name
 * @returns {number} fontSize
 * @example style={{ fontSize: calculateFontSizeLocation(city) }}
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
 * @memberof Components.CalculateFontSize
 * @description Calculates the font size for the transaction preference based on the length of the transaction preference
 * @param {string} transaction - Transaction preference
 * @returns {number} fontSize
 * @example style={{ fontSize: calculateTransactionFontSize(transaction) }}
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
 * @memberof Components.CalculateFontSize
 * @description Calculates the font size for the tag based on the length of the tag name and the default font size provided as a parameter
 * @param {string} tag - Tag name
 * @param {number} defaultFontSize - Default font size if tag is not provided or if a different default font size is desired
 * @returns {number} fontSize
 * @example style={{ fontSize: calculateTagTextFontSize(tag, 16) }}
 */
export const calculateTagTextFontSize = (tag, defaultFontSize) => {
  if (tag === undefined || tag === null) {
    return defaultFontSize; // Default font size if price is not provided
  }
  const numberOfCharacters = tag.length;

  return Math.min(20 - (numberOfCharacters - 4), defaultFontSize);
};

/**
 * @function calculateTitleFontSize
 * @param {String} title
 * @returns {number} fontSize
 * @example style={{ fontSize: calculateTitleFontSize(title) }}
 * @memberof Components.CalculateFontSize
 * @description Calculates the font size for the title based on the length of the title
 */
export const calculateTitleFontSize = (title) => {
  if (title === undefined || title === null) {
    return 16; // Default font size if price is not provided
  }
  const numberOfCharacters = title.length;

  // console.log(numberOfCharacters);
  if (numberOfCharacters < 30) {
    return 20;
  }
  return Math.min(60 - (numberOfCharacters - 4), 14);
};

/**
 * @function calculateDescriptionFontSize
 * @memberof Components.CalculateFontSize
 * @param {String} description
 * @returns {number} fontSize
 * @example style={{ fontSize: calculateDescriptionFontSize(description) }}
 * @description Calculates the font size for the description based on the length of the description
 */
export const calculateDescriptionFontSize = (description) => {
  if (description === undefined || description === null) {
    return 16; // Default font size if price is not provided
  }
  const numberOfCharacters = description.length;
  if (numberOfCharacters < 100) {
    return 16;
  }

  return Math.min(500 - (numberOfCharacters - 4), 12);
};
