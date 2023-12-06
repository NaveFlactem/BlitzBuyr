/**
 * @namespace UserSettings
 * @description - Functions to help with updating the User Preference
 *
 */

import * as SecureStore from 'expo-secure-store';

const USER_SETTINGS_KEY = 'USER_SETTINGS';

const defaultSettings = {
  colorMode: 'light',
  distance: 30,
};

/**
 * Set default user settings.
 *
 * @function
 * @name setDefaultUserSettings
 * @memberof UserSettings
 * @async
 * @returns {Promise<Object>} Default user settings
 */
export const setDefaultUserSettings = async () => {
  await saveUserSettings(defaultSettings);
  return defaultSettings;
};

/**
 * Save user settings.
 *
 * @function
 * @name saveUserSettings
 * @memberof UserSettings
 * @param {Object} settings - User settings to be saved
 */
export const saveUserSettings = async (settings) => {
  try {
    await SecureStore.setItemAsync(USER_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving user settings:', error);
  }
};

/**
 * Get user settings.
 *
 * @function
 * @name getUserSettings
 * @memberof UserSettings
 * @async
 * @returns {Promise<Object>} Retrieved user settings
 */
export const getUserSettings = async () => {
  try {
    const settings = await SecureStore.getItemAsync(USER_SETTINGS_KEY);
    return settings ? JSON.parse(settings) : setDefaultUserSettings();
  } catch (error) {
    console.error('Error retrieving user settings:', error);
    return defaultSettings;
  }
};

/**
 * Clear user settings.
 *
 * @async
 * @function
 * @name clearUserSettings
 * @memberof UserSettings
 */
export const clearUserSettings = async () => {
  try {
    await SecureStore.deleteItemAsync(USER_SETTINGS_KEY);
  } catch (error) {
    console.error('Error clearing user settings:', error);
  }
};

/**
 * Update user distance setting.
 *
 * @function
 * @name updateDistance
 * @memberof UserSettings
 * @param {number} userDistance - User's preferred distance
 */
export const updateDistance = async (userDistance) => {
  const settings = await getUserSettings();
  await saveUserSettings({ ...settings, distance: userDistance });
};

/**
 * Get user distance setting.
 *
 * @function
 * @name getDistance
 * @memberof UserSettings
 * @async
 * @returns {Promise<number>} User's preferred distance
 */
export const getDistance = async () => {
  const settings = await getUserSettings();
  console.log('Settings object:', JSON.stringify(settings));
  const distance = settings.distance;
  console.log('Distance is now:', distance);
  return distance;
};

/**
 * Update user color mode setting.
 *
 * @function
 * @name updateColorMode
 * @memberof UserSettings
 * @param {string} colorMode - User's preferred color mode
 */
export const updateColorMode = async (colorMode) => {
  const settings = await getUserSettings();
  await saveUserSettings({ ...settings, colorMode });
};

/**
 * Get user color mode setting.
 *
 * @function
 * @name getColorMode
 * @memberof UserSettings
 * @async
 * @returns {Promise<string>} User's preferred color mode
 */
export const getColorMode = async () => {
  const settings = await getUserSettings();
  return settings.colorMode;
};
