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

const TopBar = memo(({ handleMenuPress, handleLocationPress }) => {
  const styles = getThemedStyles(useThemeContext().theme);
  return (
    <View style={styles.TopBarHome.topBar}>
      <TouchableOpacity style={styles.TopBarHome.menu} onPress={handleMenuPress}>
        <MaterialCommunityIcons
          name="menu"
          size={30}
          color={Colors.BB_bone}
          style={(alignSelf = 'center')}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.TopBarHome.location} onPress={handleLocationPress}>
        <MaterialCommunityIcons
          name="map-marker"
          size={30}
          color={Colors.BB_bone}
        />
      </TouchableOpacity>
      <Image
        style={styles.TopBarHome.logo}
        source={require('../assets/blitzbuyr_name_logo.png')}
      />
    </View>
  );
});

export default TopBar;