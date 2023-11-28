/**
 * @namespace Networking
 * @description - Networking API calls from Frontend -> Backend
 *
 */
import * as SecureStore from 'expo-secure-store';
import { serverIp } from '../config';
import { calculateTimeSince } from '../constants/Utilities';
import {
  getStoredPassword,
  getStoredUsername,
} from '../screens/auth/Authenticate';

/**
 * Initiates the process to fetch listings based on selected criteria. FIXME: I need to make the calls to this await later
 * @function
 * @name fetchListings
 * @param {Array} userLocation - User's geographical location coordinates.
 * @param {number} distance - Maximum distance for listing proximity.
 * @param {Array} selectedTags - Selected tags for filtering listings.
 * @param {Array} selectedTransactions - Selected transaction types for filtering listings.
 * @param {Array} selectedConditions - Selected conditions for filtering listings.
 * @param {function} setListings - Function to set the listings state.
 * @param {function} setIsLoading - Function to set the loading state.
 * @param {function} setRefreshing - Function to set the refreshing state.
 * @param {object} route - Navigation route object.
 * @returns {Promise<void>}
 * @description Fetches listings from the server, updates the listings state, and handles errors.
 * @memberof Networking
 */
const fetchListings = async (
  userLocation,
  distance,
  selectedTags,
  selectedConditions,
  selectedTransactions,
  setListings,
  setIsLoading,
  setRefreshing,
  route
) => {
  console.log('Fetching listings...');
  console.log('Tags:', selectedTags);
  console.log('Distance:', distance < 510 ? distance : 'No Limit');
  if (route?.params?.refresh) route.params.refresh = false;

  try {
    const { latitude, longitude } = userLocation;
    const mergedTags = '&tags[]=' + selectedTags.join('&tags[]=');
    const mergedConditions =
      '&conditions[]=' + selectedConditions.join('&conditions[]=');
    const mergedTransactions =
      '&transactions[]=' + selectedTransactions.join('&transactions[]=');
    console.log('User Location:', userLocation);
    console.log('Latitude:', latitude);
    console.log('Longitude:', longitude);
    console.log('Tags:', mergedTags);
    console.log('Conditions:', mergedConditions);
    console.log('Transactions:', mergedTransactions);

    const username = encodeURIComponent(
      await SecureStore.getItemAsync('username')
    );
    let fetchUrl = `${serverIp}/api/listings?username=${username}&latitude=${latitude}&longitude=${longitude}`;
    if (distance < 510) fetchUrl += `&distance=${distance}`; // don't add distance on unlimited
    if (selectedTags.length > 0) fetchUrl += `&${mergedTags}`;
    if (selectedTransactions.length > 0) fetchUrl += `&${mergedTransactions}`;
    if (selectedConditions.length > 0) fetchUrl += `&${mergedConditions}`;
    console.log(fetchUrl);
    const response = await fetch(fetchUrl, {
      method: 'GET',
    });

    const responseData = await response.json();

    if (response.status <= 201) {
      setListings(
        responseData.map((listing) => {
          const timeSince = calculateTimeSince(listing.PostDate);
          return {
            ...listing,
            TimeSince: timeSince,
          };
        })
      );
      console.log('Listings fetched successfully');
    } else {
      throw `Status code ${response.status}, Error: ${responseData.error}`;
    }
  } catch (error) {
    throw `Failed to fetch listings: ${error}`;
  } finally {
    setIsLoading && setIsLoading(false);
    setRefreshing && setRefreshing(false);
  }
};

/**
 * Sends a POST request to save the updated contact information.
 * @function
 * @name saveContactInfo
 * @param {Array} contactInfo - User's client-side updated contact information form.
 * @returns {Promise<void>}
 * @description Updates contact information on the backend, handles success and errors.
 * @memberof Networking
 */
const saveContactInfo = async (contactInfo) => {
  try {
    const response = await fetch(`${serverIp}/api/editcontactinfo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: getStoredUsername(),
        password: getStoredPassword(),
        contactInfo: contactInfo,
      }),
    });

    const responseData = await response.json();

    if (response.ok) {
      console.log('Saved contact info');
    } else {
      throw `Status code ${response.status}, Error: ${responseData.error}`;
    }
  } catch (error) {
    throw `Failed to save contact info: ${error}`;
  }
};

/**
 * Deletes a user's account.
 * @function
 * @name handleDeleteAccount
 * @param {string} username - User's username.
 * @param {string} password - User's password.
 * @returns {Promise<void>}
 * @description Deletes the user's account on the backend, handles success and errors.
 * @memberof Networking
 */
const handleDeleteListing = async (listingId) => {
  try {
    const username = getStoredUsername();
    const password = getStoredPassword();
    const response = await fetch(`${serverIp}/api/deletelisting`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, listingId }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw `Status code ${response.status}, Error: ${responseData.error}`;
    }
  } catch (error) {
    throw `Error deleting listing: ${error}`;
  }
};

/**
 * Handles the process of liking or unliking a listing.
 * @function
 * @name handleLike
 * @param {string} listingId - The ID of the listing to be liked or unliked.
 * @param {boolean} isLiked - Indicates whether the listing is currently liked or not.
 * @returns {Promise<void>}
 * @description Updates the like status of a listing on the backend, handling success and errors.
 * @memberof Networking
 */
const handleLike = async (listingId, isLiked) => {
  const username = getStoredUsername();
  const password = getStoredPassword();
  const method = isLiked ? 'DELETE' : 'POST';
  try {
    const response = await fetch(`${serverIp}/api/like`, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, listingId: listingId }),
    });

    const responseData = await response.json();

    if (response.ok) {
      console.log(
        `Listing ${listingId} ${isLiked ? 'unliked' : 'liked'} successfully!`
      );
    } else {
      throw `Status code ${response.status}, Error: ${responseData.error}`;
    }
  } catch (error) {
    throw `Error updating like status: ${error}`;
  }
};

/**
 * Handles the process of creating a new listing.
 * @function
 * @name handleListingCreation
 * @param {object} listingData - Data for creating a new listing.
 * @returns {Promise<void>}
 * @description Creates a new listing on the backend, handling success and errors.
 * @memberof Networking
 */
const handleListingCreation = async (listingData) => {
  try {
    const response = await fetch(`${serverIp}/api/createlisting`, {
      method: 'POST',
      body: listingData,
      timeout: 10000,
    });

    const responseData = await response.json();

    if (response.ok) {
      console.log('Listing created successfully:', responseData);
    } else {
      throw `Status code ${response.status}, Error: ${responseData.error}`;
    }
  } catch (error) {
    throw `Error creating listing: ${error}`;
  }
};

/**
 * Saves edited profile information to the backend.
 * @function
 * @name saveProfileInfo
 * @param {object} profileData - Data containing the edited profile information.
 * @returns {Promise<void>}
 * @description Sends a POST request to update profile information, handling success and errors.
 * @memberof Networking
 */
const saveProfileInfo = async (profileData) => {
  try {
    const response = await fetch(`${serverIp}/api/editprofile`, {
      method: 'POST',
      body: profileData,
      timeout: 10000,
    });

    const responseData = await response.json();

    if (response.ok) {
      console.log('Profile edited successfully:', responseData);
    } else {
      throw `Status code ${response.status}, Error: ${responseData.error}`;
    }
  } catch (error) {
    throw `Failed to save profile data: ${error}`;
  }
};

/**
 * Handles the process of deleting a user account.
 * @function
 * @name handleDeleteAccount
 * @param {string} username - The username of the account to be deleted.
 * @param {string} password - The password of the account for verification.
 * @returns {Promise<void>}
 * @description Deletes a user account on the backend, handling success and errors.
 * @memberof Networking
 */
const handleDeleteAccount = async (username, password) => {
  try {
    const response = await fetch(
      `${serverIp}/api/deleteaccount?username=${username}&password=${password}`,
      {
        method: 'DELETE',
        timeout: 10000,
      }
    );

    const responseData = await response.json();

    if (response.ok) {
      console.log(
        `Account ${getStoredUsername()} deleted successfully: ${responseData}`
      );
    } else {
      throw `Status code ${response.status}, Error: ${responseData.error}`;
    }
  } catch (error) {
    throw `Error deleting account: ${responseData.error}`;
  }
};

export {
  fetchListings,
  saveContactInfo,
  handleDeleteListing,
  handleLike,
  handleListingCreation,
  saveProfileInfo,
  handleDeleteAccount,
};
