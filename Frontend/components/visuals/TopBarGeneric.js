import React from 'react';
import { View, Image, Dimensions, StyleSheet, Platform } from 'react-native';
import { memo } from 'react';
import Colors from '../../constants/Colors';
import { screenWidth, screenHeight } from '../../constants/ScreenDimensions.js';
import { useThemeContext } from './ThemeProvider';
import { getThemedStyles } from '../../constants/Styles';

const TopBar = memo(function TopBar() {
  const styles = getThemedStyles(useThemeContext().theme).TopBarGeneric;
  return (
    <View style={styles.topBar}>
      <Image
        style={styles.logo}
        source={require('../../assets/blitzbuyr_name_logo.png')}
      />
    </View>
  );
});

export default TopBar;
