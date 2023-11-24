import * as Location from "expo-location";

const getLocationWithRetry = async function (retries = 20) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Timeout exceeded")), 300),
  );
  try {
    // Request location permission
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.error("Location permission not granted");
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
        "Failed to get current location, using last known location instead.",
      );
      return lastKnownLocation;
    }
  }
};

export { getLocationWithRetry };
