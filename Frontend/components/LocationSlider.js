import React, { useState, memo, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';
import Colors from '../constants/Colors';
import * as Settings from '../hooks/UserSettings.js';
import { screenHeight, screenWidth } from '../constants/ScreenDimensions';
const Slider =
  Platform.OS == 'ios'
    ? require('@react-native-community/slider').default
    : require('react-native-slider').default;

const LocationSlider = memo(({ setDistance }) => {
  const [sliderValue, setSliderValue] = useState(30);

  useEffect(() => {
    const fetchDistance = async () => {
      const initialDistance = await Settings.getDistance();
      console.log('Initial distance:', initialDistance);
      setSliderValue(initialDistance);
    };

    fetchDistance();
  }, []);

  return (
    <View style={styles.box}>
      <Text style={styles.valueText}>
        {sliderValue <= 500 ? sliderValue + ' miles' : 'No Limit'}
      </Text>
      <Slider
        style={{ width: '90%', height: 40, top: '10%' }}
        minimumValue={10}
        maximumValue={510}
        step={10}
        value={sliderValue}
        onValueChange={(value) => setSliderValue(value)}
        minimumTrackTintColor={Colors.BB_pink}
        maximumTrackTintColor="#000000"
        thumbImage={require('../assets/icon_transparent_background_filled_upright_mini.png')}
        onSlidingComplete={(value) => {
          setDistance(value);
          Settings.updateDistance(value);
        }}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  box: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.BB_darkRedPurple,
    position: 'absolute',
    right: 0 * screenWidth,
    bottom: Platform.OS == 'ios' ? screenHeight * 0.67 : screenHeight * 0.75,
    width: screenWidth * 0.7,
    height: screenHeight * 0.07,
    borderRadius: 80,
    ...Platform.select({
      ios: {
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
      },
      android: {
        elevation: 20,
      },
    }),
  },
  valueText: {
    position: 'absolute',
    bottom: '65%',
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default LocationSlider;
