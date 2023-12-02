/**
 * @namespace Authenticate
 * @description Headless authentication screen which uses the device cache to automatically login into BlitzBuyer
 */
import { Asset } from 'expo-asset';
import * as SecureStore from 'expo-secure-store';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { checkListingExpiration } from '../../components/Notifications.js';
import { serverIp } from '../../config.js';
import Colors from '../../constants/Colors';
import * as Settings from '../../hooks/UserSettings.js';
import { useThemeContext } from '../../components/visuals/ThemeProvider.js';
import { getThemedStyles } from '../../constants/Styles.js';

const assetsToPreload = [
  require('../../assets/blitzbuyr_name_logo.png'),
  require('../../assets/blitzbuyr_name_logo_darkmode.png'),
  require('../../assets/blitzbuyr_name_transparent_horizontal.png'),
  require('../../assets/blitzbuyr_name_transparent.png'),
  require('../../assets/blitzbuyr_name.png'),
  require('../../assets/icon_background_transparent_upright.png'),
  require('../../assets/icon_background_transparent_upright_mini_darkmode.png'),
  require('../../assets/icon_background_transparent.png'),
  require('../../assets/icon_transparent_background_filled_upright.png'),
  require('../../assets/icon_transparent_background_filled_upright_mini.png'),
  require('../../assets/icon_transparent_background_filled.png'),
  require('../../assets/icon_transparent.png'),
  require('../../assets/icon.png'),
  require('../../assets/no_wifi_icon_transparent.png'),
  require('../../assets/no_wifi_icon_transparent_darkmode.png'),
  require('../../assets/card_background.png'),
];

let storedUsername;
let storedPassword;

/**
 * Returns the username stored in the device cache.
 * @function
 * @name getStoredUsername
 * @returns {string} The stored username.
 * @memberof Authenticate
 */
const getStoredUsername = () => storedUsername;

/**
 * Returns the password stored in the device cache.
 * @function
 * @name getStoredPassword
 * @returns {string} The stored password.
 * @memberof Authenticate
 */
const getStoredPassword = () => storedPassword;

/**
 * Sets the stored credentials in the cache.
 * @function
 * @name setStoredCredentials
 * @param {string} username - The username to be stored.
 * @param {string} password - The password to be stored.
 * @returns {Promise<void>}
 * @memberof Authenticate
 */
const setStoredCredentials = async (username, password) => {
  storedUsername = username;
  storedPassword = password;
  await SecureStore.setItemAsync('username', username);
  await SecureStore.setItemAsync('password', password);
};

/**
 * Clears the stored credentials.
 * @function
 * @name clearStoredCredentials
 * @returns {Promise<void>}
 * @memberof Authenticate
 */
const clearStoredCredentials = async () => {
  try {
    await SecureStore.deleteItemAsync('username');
    await SecureStore.deleteItemAsync('password');
    console.log('Stored credentials cleared.');
  } catch (error) {
    console.error('Error clearing stored credentials:', error);
  }
};

/**
 * Component for authentication screen.
 * @function
 * @name AuthenticateScreen
 * @param {Object} props - React component props.
 * @param {Object} props.navigation - Navigation object for navigating between screens.
 * @returns {JSX.Element} The authentication screen component.
 * @memberof Authenticate
 */
const AuthenticateScreen = ({ navigation }) => {
  useEffect(() => {
    // Load and cache the assets when the component mounts
    async function loadAssetsAsync() {
      const assetPromises = assetsToPreload.map((asset) =>
        Asset.fromModule(asset).downloadAsync(),
      );
      await Promise.all(assetPromises);
    }

    loadAssetsAsync();
  }, []);

  useEffect(() => {
    /**
     * Loads user settings.
     * @function
     * @name loadSettings
     * @returns {Promise<void>}
     * @memberof Authenticate
     */
    const loadSettings = async () => {
      const settings = await Settings.getUserSettings();
      console.log('User settings:', settings);
    };

    /**
     * Checks stored credentials and performs login.
     * @function
     * @name checkStoredCredentials
     * @returns {Promise<void>}
     * @memberof Authenticate
     */
    const checkStoredCredentials = async () => {
      storedUsername = await SecureStore.getItemAsync('username');
      storedPassword = await SecureStore.getItemAsync('password');

      if (storedUsername && storedPassword) {
        // Stored credentials exist, use them for login
        const loginData = {
          username: storedUsername,
          password: storedPassword,
        };

        const response = await fetch(`${serverIp}/api/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(loginData),
        });

        let responseData = await response.json();

        if (response.status <= 201) {
          loadSettings();
          console.log('Response data:', responseData);
          navigation.navigate('BottomNavOverlay');
          const settingsStatus = await SecureStore.getItemAsync('accountActivityStatus');
          if(settingsStatus === 'true'){
            checkListingExpiration();
          }
        } else {
          navigation.navigate('Login');
        }
      } else {
        navigation.navigate('Login');
      }
    };

    checkStoredCredentials();
  }, []);

  const styles = getThemedStyles(useThemeContext().theme).Authentication;

  return <View style={styles.container}></View>;
};

export {
  getStoredUsername,
  getStoredPassword,
  setStoredCredentials,
  clearStoredCredentials,
};
export default AuthenticateScreen;
