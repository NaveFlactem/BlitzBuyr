import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';
import { screenWidth, screenHeight } from '../../constants/ScreenDimensions.js';

const Hexagon = memo(() => {
  return (
    <View style={styles.hexagon}>
      <View style={styles.hexagonInner} />
      <View style={styles.hexagonBefore} />
      <View style={styles.hexagonAfter} />
    </View>
  );
});

const styles = StyleSheet.create({
  hexagon: {
    width: 80,
    height: 40,
    backgroundColor: 'yellow',
  },
  hexagonInner: {
    width: 80,
    height: 40,
    backgroundColor: 'yellow',
  },
  hexagonBefore: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderRightWidth: 40,
    borderRightColor: 'transparent',
    borderBottomWidth: 20,
    borderBottomColor: 'yellow',
    borderLeftWidth: 40,
    borderLeftColor: 'transparent',
    backgroundColor: 'yellow',
    transform: [{ rotate: '-30deg' }],
  },
  hexagonAfter: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderRightWidth: 40,
    borderRightColor: 'transparent',
    borderTopWidth: 20,
    borderTopColor: 'yellow',
    borderLeftWidth: 40,
    borderLeftColor: 'transparent',
    backgroundColor: 'yellow',
    transform: [{ rotate: '30deg' }],
  },
});

export default Hexagon;
