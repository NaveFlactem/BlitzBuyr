import { serverIp } from "../config";
import * as SecureStore from "expo-secure-store";

const fetchListings = async (userLocation, selectedTags, distance) => {
  try {
    const { latitude, longitude } = userLocation;
    const mergedTags = "&tags[]=" + selectedTags.join("&tags[]=");
    const username = encodeURIComponent(
      await SecureStore.getItemAsync("username"),
    );
    let fetchUrl = `${serverIp}/api/listings?username=${username}&latitude=${latitude}&longitude=${longitude}`;
    if (distance < 510) fetchUrl += `&distance=${distance}`;
    if (selectedTags.length > 0) fetchUrl += `&${mergedTags}`;

    const listingsResponse = await fetch(fetchUrl, { method: "GET" });

    if (listingsResponse.status <= 201) {
      return await listingsResponse.json();
    } else {
      console.error("Error fetching listings:", listingsResponse.status);
      return null;
    }
  } catch (err) {
    console.error("Error:", err);
    return null;
  }
};

export default fetchListings;
