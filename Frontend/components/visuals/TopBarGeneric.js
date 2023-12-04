/**
 * @namespace TopBarGeneric
 * @memberof Visuals
 * @memberof Components.Visuals
 * @description - File defines a TopBar component used to display a generic top bar/header within the application. It primarily contains an image logo, which may or may not be visible based on the imageVisible prop.
 */




import React from 'react';
import { View, Image, Dimensions, StyleSheet, Platform } from 'react-native';
import { memo } from 'react';
import Colors from '../../constants/Colors';
import { screenWidth, screenHeight } from '../../constants/ScreenDimensions.js';
import { useThemeContext } from './ThemeProvider';
import { getThemedStyles } from '../../constants/Styles';

/**
 * @function TopBar
 * @memberof Visuals.TopBarGeneric
 * @memberof Components.Visuals.TopBarGeneric
 * @description - A memoized function component that creates a generic top bar/header within the application
 * @param {Object} props - Component props
 * @param {boolean} props.imageVisible - Boolean indicating whether the image is visible
 * @returns {JSX.Element} - React component
 */
const TopBar = memo(({ imageVisible }) => {
  const { theme } = useThemeContext();
  const styles = getThemedStyles(useThemeContext().theme).TopBarGeneric;
  return (
    <View style={styles.topBar}>
      <Image
        style={[styles.logo, { opacity: imageVisible ? 1 : 0 }]}
        source={
          theme === 'dark'
            ? require('../../assets/blitzbuyr_name_logo_darkmode.png')
            : require('../../assets/blitzbuyr_name_logo.png')
        }
      />
    </View>
  );
});

export default TopBar;
