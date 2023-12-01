/**
 * @namespace SettingsScreen
 * @memberof Screens
 * 
 *
 */

import React, { memo } from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { useThemeContext } from '../components/visuals/ThemeProvider.js';
import { getThemedStyles } from '../constants/Styles.js';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { screenHeight, screenWidth } from '../constants/ScreenDimensions.js';

const SettingsScreen = memo(({ navigation, route }) => {
  const { toggleTheme } = useThemeContext();
  const styles = getThemedStyles(useThemeContext().theme).SettingsScreen;
  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('BottomNavOverlay');
        }}
        style={styles.circleContainer}
      >
        <View style={styles.circle}>
          <MaterialCommunityIcons name="arrow-left" size={30} color="black" />
        </View>
      </TouchableOpacity>

      {/* Theme Toggle */}
      <TouchableOpacity
        onPress={toggleTheme}
        style={{
          position: 'absolute',
          top: 0.28 * screenHeight,
          left: 0.03 * screenHeight,
        }}
      >
        <MaterialCommunityIcons
          name="theme-light-dark"
          size={30}
          color="black"
        />
      </TouchableOpacity>

      {/* Settings Header */}
      <Text style={styles.headerText}>Settings Screen</Text>

      {/* Additional Settings */}

      {/* Notifications */}

      {/* More settings options... */}
    </View>
  );
});

export default SettingsScreen;
