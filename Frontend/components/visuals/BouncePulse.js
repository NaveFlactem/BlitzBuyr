/**
 * @namespace Visuals
 * 
 */

/**
 * @namespace BouncePulse
 * @memberof Visuals
 * @description A component that creates a bouncing pulse effect with animated dots.
 * @param {object} props - Component properties.
 * @param {number} props.opacity - Opacity of the pulse effect.
 * @param {number} props.dotTop - Top position of the animated dot.
 * @param {number} props.dotBottom - Bottom position of the animated dot.
 * @param {number} props.dotLeft - Left position of the animated dot.
 * @param {number} props.dotRight - Right position of the animated dot.
 * @returns {JSX.Element} React component for the BouncePulse effect.
 */
 


import React, { memo, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Colors from '../../constants/Colors';
import { screenHeight } from '../../constants/ScreenDimensions.js';
import { useThemeContext } from './ThemeProvider';
import { getThemedStyles } from '../../constants/Styles';

const BouncePulse = memo((props) => {
  const styles = getThemedStyles(useThemeContext().theme).BouncePulse;
  const translateY1 = useSharedValue(0);
  const translateY2 = useSharedValue(0);
  const translateY3 = useSharedValue(0);

  const startAnimation = (animatedValue, delay) => {
    animatedValue.value = withRepeat(
      withSequence(
        withDelay(delay, withTiming(1, { duration: 300 })),
        withTiming(0, { duration: 300 }),
      ),
      -1, // infinite repeats
      true, // reverse the animation on every second iteration
    );
  };

  useEffect(() => {
    startAnimation(translateY1, 0);
    startAnimation(translateY2, 333);
    startAnimation(translateY3, 666);
  }, []);

  const animatedStyle1 = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY1.value * -15 }],
    };
  });

  const animatedStyle2 = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY2.value * -15 }],
    };
  });

  const animatedStyle3 = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY3.value * -15 }],
    };
  });

  return (
    <View style={[styles.container, { opacity: props.opacity }]}>
      <Animated.View
        style={[
          styles.dot,
          animatedStyle1,
          {
            top: props.dotTop,
            bottom: props.dotBottom,
            left: props.dotLeft,
            right: props.dotRight,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.dot,
          animatedStyle2,
          {
            top: props.dotTop,
            bottom: props.dotBottom,
            left: props.dotLeft,
            right: props.dotRight,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.dot,
          animatedStyle3,
          {
            top: props.dotTop,
            bottom: props.dotBottom,
            left: props.dotLeft,
            right: props.dotRight,
          },
        ]}
      />
    </View>
  );
});

export default BouncePulse;
