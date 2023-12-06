/**
 * @namespace Visuals
 * @memberof Components
 */

import React, { memo, useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Colors from '../../constants/Colors';
import { getThemedStyles } from '../../constants/Styles';
import { useThemeContext } from './ThemeProvider';

/**
 * @namespace BouncePulse
 * @memberof Visuals
 * @memberof Components.Visuals
 * @description A component that creates a bouncing pulse effect with animated dots.
 */

/**
 * @function
 * @name BouncePulse
 * @memberof Visuals.BouncePulse
 * @memberof Components.Visuals.BouncePulse
 * @description memoized function that creates a bouncing pulse effect with animated dots using react-native-reanimated.
 * @param {object} props - Component properties.
 * @param {number} props.opacity - Opacity of the pulse effect.
 * @param {number} props.dotTop - Top position of the animated dot.
 * @param {number} props.dotBottom - Bottom position of the animated dot.
 * @param {number} props.dotLeft - Left position of the animated dot.
 * @param {number} props.dotRight - Right position of the animated dot.
 * @param {number} props.top - Top position of the pulse effect container
 * @param {number} props.bottom - Bottom position of the pulse effect container
 * @param {number} props.left - Left position of the pulse effect container
 * @param {number} props.right - Right position of the pulse effect container
 * @param {number} props.color - Color of the pulse effect
 * @param {number} props.size - Size of the dots in pixels
 * @returns {JSX.Element} React component for the BouncePulse effect.
 */

const BouncePulse = memo((props) => {
  const { theme } = useThemeContext();
  const styles = getThemedStyles(useThemeContext().theme).BouncePulse;
  const translateY1 = useSharedValue(0);
  const translateY2 = useSharedValue(0);
  const translateY3 = useSharedValue(0);

  /**
   * @function startAnimation
   * @memberof Components.Visuals.BouncePulse
   * @param {Animated.SharedValue<number>} animatedValue - useSharedValue object to animate.
   * @param {number} delay - Delay before animation starts.
   */
  const startAnimation = (animatedValue, delay) => {
    animatedValue.value = withRepeat(
      withSequence(
        withDelay(delay, withTiming(1, { duration: 300 })),
        withTiming(0, { duration: 300 })
      ),
      -1, // infinite repeats
      true // reverse the animation on every second iteration
    );
  };

  useEffect(() => {
    startAnimation(translateY1, 0);
    startAnimation(translateY2, 333);
    startAnimation(translateY3, 666);
  }, []);

  /**
   * @constant animatedStyle1
   * @memberof Components.Visuals.BouncePulse
   * @description - Animated style for the first dot.
   * @returns {object} - Animated style for the first dot.
   */
  const animatedStyle1 = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY1.value * -15 }],
    };
  });

  /**
   * @constant animatedStyle2
   * @memberof Components.Visuals.BouncePulse
   * @description - Animated style for the second dot.
   * @returns {object} - Animated style for the second dot.
   */
  const animatedStyle2 = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY2.value * -15 }],
    };
  });

  /**
   * @constant animatedStyle3
   * @memberof Components.Visuals.BouncePulse
   * @description - Animated style for the third dot.
   * @returns {object} - Animated style for the third dot.
   */
  const animatedStyle3 = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY3.value * -15 }],
    };
  });

  return (
    <View
      style={[
        styles.container,
        {
          opacity: props.opacity,
          top: props.top,
          bottom: props.bottom,
          left: props.left,
          right: props.right,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.dot,
          animatedStyle1,
          {
            top: props.dotTop,
            bottom: props.dotBottom,
            left: props.dotLeft,
            right: props.dotRight,
            width: props.size ? props.size : 20,
            height: props.size ? props.size : 20,
            backgroundColor: props.color
              ? props.color
              : theme === 'dark'
              ? Colors.BB_violet
              : Colors.BB_darkRedPurple,
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
            width: props.size ? props.size : 20,
            height: props.size ? props.size : 20,
            backgroundColor: props.color
              ? props.color
              : theme === 'dark'
              ? Colors.BB_violet
              : Colors.BB_darkRedPurple,
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
            width: props.size ? props.size : 20,
            height: props.size ? props.size : 20,
            backgroundColor: props.color
              ? props.color
              : theme === 'dark'
              ? Colors.BB_violet
              : Colors.BB_darkRedPurple,
          },
        ]}
      />
    </View>
  );
});

export default BouncePulse;
