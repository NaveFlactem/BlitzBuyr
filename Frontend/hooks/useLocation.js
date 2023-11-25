import { useEffect, useState } from 'react';
import { getLocationWithRetry } from '../constants/Utilities';

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
