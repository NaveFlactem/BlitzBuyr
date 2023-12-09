/**
 * @namespace Auth
 * @memberof Screens
 */

/**
 * @namespace Authenticate
 * @memberof Auth
 * @memberof Screens.Auth
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

let storedUsername;
let storedPassword;

/**
 * Returns the username stored in the device cache.
 * @function
 * @name getStoredUsername
 * @returns {string} The stored username.
 * @memberof Screens.Auth.Authenticate
 */
const getStoredUsername = () => storedUsername;

/**
 * Returns the password stored in the device cache.
 * @function
 * @name getStoredPassword
 * @returns {string} The stored password.
 * @memberof Screens.Auth.Authenticate
 */
const getStoredPassword = () => storedPassword;

/**
 * Sets the stored credentials in the cache.
 * @function
 * @name setStoredCredentials
 * @param {string} username - The username to be stored.
 * @param {string} password - The password to be stored.
 * @returns {Promise<void>}
 * @memberof Screens.Auth.Authenticate
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
 * @async
 * @memberof Screens.Auth.Authenticate
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
 * @param {Object} navigation - Navigation object for navigating between screens.
 * @returns {JSX.Element} The authentication screen component.
 * @memberof Screens.Auth.Authenticate
 */
const AuthenticateScreen = ({ navigation }) => {

  useEffect(() => {
    /**
     * Loads user settings.
     * @function
     * @name loadSettings
     * @returns {Promise<void>}
     * @async
     * @memberof Screens.Auth.Authenticate
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
     * @async
     * @memberof Screens.Auth.Authenticate
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
          const settingsStatus = await SecureStore.getItemAsync(
            'accountActivityStatus',
          );
          if (settingsStatus === 'true') {
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
