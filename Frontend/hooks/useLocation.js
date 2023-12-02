/**
 * @namespace Hooks
 * @description - Hooks allow use to use in-built features
 *
 */
import { useEffect, useState } from 'react';
import { getLocationWithRetry } from '../constants/Utilities';

/**
 * Custom hook for retrieving user location.
 *
 * @function
 * @name useLocation
 * @memberof Hooks
 * @returns {Object | null} User location object containing latitude and longitude
 * @description Retrieves the user's location using the device's geolocation API.
 */
const useLocation = () => {
  const [userLocation, setUserLocation] = useState(null);

  const getUserLocation = async () => {
    try {
      const location = await getLocationWithRetry();
      const { latitude, longitude } = location.coords;
      setUserLocation({ latitude, longitude });
    } catch (error) {
      console.error('Error getting location:', error);
      // Handle the error appropriately
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  return userLocation;
};

export default useLocation;
