/**
 * @namespace Components
 * @description - Components is a folder where we have different features
 *
 */

import React, { memo } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../constants/Colors';
import { screenHeight, screenWidth } from '../constants/ScreenDimensions.js';
import { useThemeContext } from './visuals/ThemeProvider';
import { getThemedStyles } from '../constants/Styles';

/**
 *
 * @function
 * @name NoWifi
 * @memberof Components
 * @param {Object} onRetry - The object that signifies if the app is reloading
 * @description - Shows the user that they have no wifi
 * @returns {JSX.Element} A logo that signifies no wifi.
 */

const NoWifi = memo(({ onRetry }) => {
  const styles = getThemedStyles(useThemeContext().theme).NoWifi;
  return (
    <View style={styles.noWifiContainer}>
      <Image
        style={styles.noWifiImage}
        source={require('../assets/no_wifi_icon_transparent.png')}
      />
      <Text style={styles.noWifiText}>No network connection available.</Text>
      <TouchableOpacity onPress={onRetry} style={styles.retryButton}>
        <Text style={styles.buttonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
});

export default NoWifi;
