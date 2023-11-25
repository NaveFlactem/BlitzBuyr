import { memo } from 'react';
import BouncePulse from './BouncePulse';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { StyleSheet } from 'react-native';
import { screenHeight } from '../../constants/ScreenDimensions.js';

export const CustomRefreshControl = memo(({ refreshing, scrollY }) => {
  const bouncePulseStyle = useAnimatedStyle(() => {
    let newYPosition = -100; // Initial off-screen position
    let newOpacity = 1;

    if (refreshing) {
      newYPosition = withTiming(0, { duration: 300 }); // Bring into view when refreshing
    } else {
      // Normalize and adjust opacity based on scrollY
      const normalizedScrollY = Math.abs(scrollY.value); // Convert to positive value
      newOpacity = Math.min(normalizedScrollY / 100, 1); // Adjust 100 to control fade speed
      newYPosition = -100 - scrollY.value;
    }

    return {
      transform: [{ translateY: newYPosition }],
      opacity: newOpacity,
    };
  });

  return (
    <Animated.View style={[styles.bouncePulseContainer, bouncePulseStyle]}>
      <BouncePulse />
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  bouncePulseContainer: {
    position: 'absolute',
    alignSelf: 'center',
    top: 0.08 * screenHeight,
    alignItems: 'center',
  },
});