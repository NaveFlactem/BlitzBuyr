import React, { memo } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { getThemedStyles } from '../constants/Styles';
import { useThemeContext } from './visuals/ThemeProvider';

/**
 *
 * @namespace NoWifi
 * @memberof Components
 */

/**
 * @function NoWifi
 * @memberof Components.NoWifi
 * @param {Function} onRetry - Function to retry the network connection by calling the parent component's refresh function
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
