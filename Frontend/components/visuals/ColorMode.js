import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
  Text,
  TouchableOpacity,
} from 'react-native';
import Colors from '../../constants/Colors';
import { screenWidth, screenHeight } from '../../constants/ScreenDimensions.js';
import * as Settings from '../../hooks/UserSettings.js';

const ColorMode = (props) => {
  const [colorMode, setColorMode] = useState('light');

  const toggleColorMode = useCallback(async () => {
    const mode = colorMode === 'light' ? 'dark' : 'light';
    setColorMode(mode);
    await Settings.updateColorMode(mode);
  }, [colorMode]);

  useEffect(() => {
    const getColorMode = async () => {
      const mode = await Settings.getColorMode();
      setColorMode(mode);
    };
    getColorMode();
  }, []);

  return (
    <View style={styles.modalContent}>
      <TouchableOpacity onPress={toggleColorMode}>
        <Text>Toggle Color Mode</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ColorMode;

const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.BB_bone,
  },
});
