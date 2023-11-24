import React, { useState, memo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Hexagon from './Hexagon'; // Assuming Hexagon is in the same folder
import { screenWidth, screenHeight } from '../../constants/ScreenDimensions.js';

const HoneycombLayout = memo(() => {
  const [layout, setLayout] = useState({ width: 0, height: 0 });
  const hexagonWidth = 80; // Set the width of a single hexagon
  const hexagonHeight = 70; // Approximate height of a hexagon
  const hexagonVerticalSpacing = hexagonHeight * 0.75;

  const onLayout = memo((event) => {
    const { width, height } = event.nativeEvent.layout;
    setLayout({ width, height });
  });

  const renderHexagons = memo(() => {
    const rows = Math.ceil(layout.height / hexagonVerticalSpacing);
    const hexagonsPerRow = Math.floor(layout.width / hexagonWidth);
    let hexagons = [];

    for (let row = 0; row < rows; row++) {
      let rowHexagons = [];
      for (let i = 0; i < hexagonsPerRow; i++) {
        rowHexagons.push(<Hexagon key={`hex-${row}-${i}`} />);
      }
      hexagons.push(
        <View key={`row-${row}`} style={styles.row}>
          {rowHexagons}
        </View>,
      );
    }

    return hexagons;
  });

  return (
    <View style={styles.container} onLayout={onLayout}>
      {layout.width && layout.height ? renderHexagons() : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HoneycombLayout;
