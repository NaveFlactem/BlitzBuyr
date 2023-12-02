import { memo } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { screenHeight } from '../../constants/ScreenDimensions.js';
import BouncePulse from './BouncePulse';
import { useThemeContext } from './ThemeProvider';
import { getThemedStyles } from '../../constants/Styles';

export const CustomRefreshControl = memo(
  ({ refreshing, scrollY}) => {
    const styles = getThemedStyles(
      useThemeContext().theme
    ).CustomRefreshControl;
    const bouncePulseStyle = useAnimatedStyle(() => {
      let newOpacity = 1;

      // Normalize and adjust opacity based on scrollY
      if (refreshing) { 
        opacity = 1;
      } else { 
      const normalizedScrollY = Math.abs(scrollY.value); // Convert to positive value
      newOpacity = Math.min(normalizedScrollY / 100, 1); // Adjust 100 to control fade speed
      }
      return {
        opacity: newOpacity,
      };
    });

    return (
      <Animated.View style={[styles.bouncePulseContainer, bouncePulseStyle]}>
        <BouncePulse />
      </Animated.View>
    );
  }
);
