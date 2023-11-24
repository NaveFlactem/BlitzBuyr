// userSettings.js
import * as SecureStore from 'expo-secure-store';

const USER_SETTINGS_KEY = 'USER_SETTINGS';

const defaultSettings = {
  colorMode: 'light',
  distance: 30,
};

export const setDefaultUserSettings = async () => {
  await saveUserSettings(defaultSettings);
  return defaultSettings;
};

export const saveUserSettings = async (settings) => {
  try {
    await SecureStore.setItemAsync(USER_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving user settings:', error);
  }
};

export const getUserSettings = async () => {
  try {
    const settings = await SecureStore.getItemAsync(USER_SETTINGS_KEY);
    return settings ? JSON.parse(settings) : setDefaultUserSettings();
  } catch (error) {
    console.error('Error retrieving user settings:', error);
    return defaultSettings;
  }
};

export const clearUserSettings = async () => {
  try {
    await SecureStore.deleteItemAsync(USER_SETTINGS_KEY);
  } catch (error) {
    console.error('Error clearing user settings:', error);
  }
};

export const updateDistance = async (userDistance) => {
  const settings = await getUserSettings();
  await saveUserSettings({ ...settings, distance: userDistance });
};

export const getDistance = async () => {
  const settings = await getUserSettings();
  console.log('Settings object:', JSON.stringify(settings));
  const distance = settings.distance;
  console.log('Distance is now:', distance);
  return distance;
};

export const updateColorMode = async (colorMode) => {
  const settings = await getUserSettings();
  await saveUserSettings({ ...settings, colorMode });
};

export const getColorMode = async () => {
  const settings = await getUserSettings();
  return settings.colorMode;
};
