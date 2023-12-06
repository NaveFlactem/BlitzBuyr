/**
 * @namespace LocationSlider
 * @memberof Components
 * @description - LocationSlider is a component that allows the user to change the distance of the listings they see
 */
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
/**
 * @constant Slider - import the slider component from the appropriate library depending on the platform the app is running on. IOS uses the @react-native-community/slider library, while Android uses the react-native-slider library.
 * @memberof Components.LocationSlider
 */
const Slider =
  Platform.OS == 'ios'
    ? require('@react-native-community/slider').default
    : require('react-native-slider').default;

/**
 * Represents a memoized LocationSlider component.
 * @function
 * @name LocationSlider
 * @memberof Components.LocationSlider
 * @param {Function} setDistance - Function to set the distance state
 * @param {boolean} isLocationSliderVisible - Boolean representing whether the location slider is visible
 * @param {Function} setIsLocationSliderVisible - Function to set the location slider visibility state
 * @param {Object} locationSliderHeight - Object representing the location slider height
 * @returns {JSX.Element} Memoized LocationSlider component
 */
const LocationSlider = memo(
  ({
    setDistance,
    isLocationSliderVisible,
    setIsLocationSliderVisible,
    locationSliderHeight,
  }) => {
    const { theme } = useThemeContext();
    const styles = getThemedStyles(useThemeContext().theme).LocationSlider;
    const locationSliderStyle = useAnimatedStyle(() => {
      return {
        transform: [{ translateY: locationSliderHeight.value }],
        bottom: 0.085 * screenHeight,
      };
    });

    /**
     * @constant onSwipeUpLocationSlider - Function to handle the swipe up gesture on the location slider
     * @memberof Components.LocationSlider
     * @descrciption - This function is called when the user swipes up on the location slider. It detects the swipe up gesture and moves the location slider up accordingly. If the user swipes up past the halfway point, the location slider is closed. Otherwise, the location slider is opened.
     */
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

    /**
     * @function useEffect
     * @memberof Components.LocationSlider
     * @description - This function is called when the component is mounted. It fetches the user's initial distance setting and sets the slider value accordingly.
     * @returns {void}
     */
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
              minimumTrackTintColor={
                theme === 'dark' ? Colors.BB_violet : Colors.BB_pink
              }
              maximumTrackTintColor="#000000"
              thumbImage={
                theme === 'dark'
                  ? require('../assets/icon_background_transparent_upright_mini_darkmode.png')
                  : require('../assets/icon_transparent_background_filled_upright_mini.png')
              }
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
