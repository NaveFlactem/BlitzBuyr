import React, { memo, useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Colors from '../constants/Colors';
import { screenHeight, screenWidth } from '../constants/ScreenDimensions';
import * as Settings from '../hooks/UserSettings.js';
import { useThemeContext } from './visuals/ThemeProvider';
import { getThemedStyles } from '../constants/Styles';
const Slider =
  Platform.OS == 'ios'
    ? require('@react-native-community/slider').default
    : require('react-native-slider').default;

const LocationSlider = memo(
  ({
    setDistance,
    isLocationSliderVisible,
    setIsLocationSliderVisible,
    locationSliderHeight,
  }) => {
    const styles = getThemedStyles(useThemeContext().theme).LocationSlider;
    const locationSliderStyle = useAnimatedStyle(() => {
      return {
        transform: [{ translateY: locationSliderHeight.value }],
        bottom: 0.085 * screenHeight,
      };
    });

    const onSwipeUpLocationSlider = useAnimatedGestureHandler({
      onStart: (_, context) => {
        context.startY = locationSliderHeight.value;
      },
      onActive: (event, context) => {
        if (event.translationY < 0) {
          // Detect swipe up
          let newLocationSliderHeight = context.startY + event.translationY;
          locationSliderHeight.value = Math.max(newLocationSliderHeight, -300);
        }
      },
      onEnd: (_) => {
        const shouldClose = locationSliderHeight.value < -20; // Halfway point
        locationSliderHeight.value = withTiming(shouldClose ? -300 : 0, {
          duration: 300,
        });
        runOnJS(setIsLocationSliderVisible)(!shouldClose);
      },
    });

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
      <PanGestureHandler onGestureEvent={onSwipeUpLocationSlider}>
        <Animated.View style={locationSliderStyle}>
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
        </Animated.View>
      </PanGestureHandler>
    );
  },
);

export default LocationSlider;
