import React, { memo } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../constants/Colors';
import { screenHeight, screenWidth } from '../constants/ScreenDimensions.js';

const NoWifi = memo(({ onRetry }) => {
  return (
    <View style={styles.noWifiContainer}>
      <Image
        style={styles.noWifiImage}
        source={require('../assets/no_wifi_icon_transparent.png')}
      />
      <Text style={styles.noWifiText}>No network connection available.</Text>
      <TouchableOpacity onPress={onRetry} style={styles.retryButton}>
        <Text style={styles.buttonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = {
  noWifiContainer: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 0.1 * screenHeight,
  },
  noWifiText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'gray',
    marginTop: 20,
  },
  noWifiImage: {
    position: 'absolute',
    width: 0.3 * screenWidth,
    height: 0.15 * screenHeight,
    alignSelf: 'center',
    top: 0.2 * screenHeight,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.BB_bone,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    justifyContent: 'center',
    backgroundColor: Colors.BB_darkRedPurple,
    padding: 10,
    borderRadius: 40,
    width: '20%',
    height: '7%',
    ...Platform.select({
      ios: {
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
      },
      android: {
        elevation: 5,
      },
    }),
  },
};

export default NoWifi;
