import React, { useState, useRef, memo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Slider } from 'react-native-awesome-slider';
import Colors from '../constants/Colors';

const LocationSlider = memo(({ distance, setDistance }) => {
  // Ensure that the distance is a valid number
  if (isNaN(distance)) {
    setDistance(0); // Set a default value if distance is NaN
  }

  const min = 0;
  const max = 100;

  return (
    <Slider
      style={styles.container}
      progress={distance}
      minimumValue={min}
      maximumValue={max}
    />
  );
});

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    width: 300, // Ensure this is a valid number
    height: 50,
    justifyContent: 'center',
    top: 0.1 * screenHeight,
    left: 50,
  },
});

export default LocationSlider;
