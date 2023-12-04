

import React, { memo } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../constants/Colors';
import { screenHeight, screenWidth } from '../constants/ScreenDimensions.js';
import { useThemeContext } from './visuals/ThemeProvider';
import { getThemedStyles } from '../constants/Styles';

/**
 *
 * @namespace NoWifi
 * @memberof Components
 */

/**
 * @function NoWifi
 * @memberof Components.NoWifi
 * @param {Object} onRetry - The object that signifies if the app is reloading
 * @description - Shows the user that they have no wifi
 * @returns {JSX.Element} A logo that signifies no wifi.
 */

const NoWifi = memo(({ onRetry }) => {
  const { theme } = useThemeContext();
  const styles = getThemedStyles(useThemeContext().theme).NoWifi;
  return (
    <View style={styles.noWifiContainer}>
      <Image
        style={styles.noWifiImage}
        source={
          theme === 'dark'
            ? require('../assets/no_wifi_icon_transparent_darkmode.png')
            : require('../assets/no_wifi_icon_transparent.png')
        }
      />
      <Text style={styles.noWifiText}>No network connection available.</Text>
      <TouchableOpacity onPress={onRetry} style={styles.retryButton}>
        <Text style={styles.buttonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
});

export default NoWifi;
