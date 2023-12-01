import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Colors from '../constants/Colors';
import { useThemeContext } from './visuals/ThemeProvider';
import { getThemedStyles } from '../constants/Styles';

const NoListings = memo(({ onRetry }) => {
  const { theme } = useThemeContext();
  const styles = getThemedStyles(theme).NoListings;
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name="file-document-outline"
        size={100}
        color={theme === 'light' ? Colors.BB_darkRedPurple : Colors.BB_violet}
      />
      <Text style={styles.text}>No listings available</Text>
      <TouchableOpacity onPress={onRetry} style={styles.retryButton}>
        <Text style={styles.buttonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
});

export default NoListings;
