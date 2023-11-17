import React, { useEffect, memo } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  withRepeat,
  withSequence,
  useAnimatedStyle,
  withDelay,
} from "react-native-reanimated";
import Colors from "../constants/Colors";

const BouncePulse = memo(() => {
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
    <View style={styles.container}>
      <Animated.View style={[styles.dot, animatedStyle1]} />
      <Animated.View style={[styles.dot, animatedStyle2]} />
      <Animated.View style={[styles.dot, animatedStyle3]} />
    </View>
  );
});

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    height: 0.1 * screenHeight,
  },
  dot: {
    backgroundColor: Colors.BB_darkRedPurple,
    width: 20,
    height: 20,
    borderRadius: 10,
    marginHorizontal: 4,
    ...Platform.select({
      ios: {
        shadowColor: Colors.BB_darkRedPurple,
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.3,
        shadowRadius: 2,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});

export default BouncePulse;
