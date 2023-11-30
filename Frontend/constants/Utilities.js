/**
 * @namespace Utilities
 */
import * as Location from 'expo-location';

/**
 * Calculate the time difference between the provided time and the current time.
 * @memberof Utilities
 * @function
 * @param {string} time - The time to calculate the difference from.
 * @returns {number} - The time difference in seconds.
 */
const calculateTimeSince = (time) => {
  // format the date into UTC friendly format
  const [datePart, timePart] = time.split(' ');
  const timestampString = datePart + 'T' + timePart + 'Z';
  const timestamp = new Date(timestampString);

  // Calculate the time difference in milliseconds, in UTC
  const timeDifference = new Date().getTime() - timestamp.getTime();

  // Return the time difference in seconds
  return Math.floor(timeDifference / 1000);
};

/**
 * Get the device's location with retry mechanism.
 * @memberof Utilities
 * @function
 * @async
 * @param {number} retries - The number of retries in case of failure.
 * @returns {Promise<Location.LocationObject>} - A promise that resolves to the device's location.
 * @throws {Error} - Throws an error if the location cannot be retrieved.
 */
const getLocationWithRetry = async function (retries = 20) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Timeout exceeded')), 300),
  );
  try {
    // Request location permission
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Location permission not granted');
      // FIXME: Handle location permission not granted
      return;
    }
    // Get the device's location
    const locationPromise = Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Low, // low to avoid retries
      distanceInterval: 0,
    });
    const location = await Promise.race([locationPromise, timeout]);
    return location;
  } catch (error) {
    if (retries > 0) {
      return getLocationWithRetry(retries - 1);
    } else {
      const lastKnownLocation = await Location.getLastKnownPositionAsync();
      if (!lastKnownLocation) {
        throw error;
      }
      console.log(
        'Failed to get current location, using last known location instead.',
      );
      return lastKnownLocation;
    }
  }
};

export { getLocationWithRetry, calculateTimeSince };
