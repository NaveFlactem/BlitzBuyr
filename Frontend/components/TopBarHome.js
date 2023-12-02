import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { memo } from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Colors from '../constants/Colors';
import { useThemeContext } from './visuals/ThemeProvider';
import { getThemedStyles } from '../constants/Styles';

/**
 * Represents a memoized TopBar component for the home screen.
 *
 * @function
 * @name TopBar
 * @param {Object} props - Component props
 * @param {Function} props.handleMenuPress - Function handling the menu press event
 * @param {Function} props.handleLocationPress - Function handling the location press event
 * @returns {JSX.Element} Memoized TopBar component for the home screen
 */
const TopBar = memo(({ handleMenuPress, handleLocationPress }) => {
  const { theme } = useThemeContext();
  const styles = getThemedStyles(theme).TopBarHome;
  return (
    <View style={styles.topBar}>
      <TouchableOpacity style={styles.menu} onPress={handleMenuPress}>
        <MaterialCommunityIcons
          name="menu"
          size={30}
          color={theme === 'dark' ? Colors.BB_violet : Colors.BB_bone}
          style={(alignSelf = 'center')}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.location} onPress={handleLocationPress}>
        <MaterialCommunityIcons
          name="map-marker"
          size={30}
          color={theme === 'dark' ? Colors.BB_violet : Colors.BB_bone}
        />
      </TouchableOpacity>
      <Image
        style={styles.logo}
        source={require('../assets/blitzbuyr_name_logo.png')}
      />
    </View>
  );
});

export default TopBar;
