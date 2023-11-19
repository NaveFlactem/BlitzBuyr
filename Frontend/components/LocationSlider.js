import React, { useState, useCallback, memo } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Animated, { useCode, set, add } from "react-native-reanimated";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { onGestureEvent, withOffset } from "react-native-redash";
import Colors from "../constants/Colors";

const { width: screenWidth } = Dimensions.get("window");

const SLIDER_WIDTH = screenWidth * 0.5;
const KNOB_WIDTH = 30; // Width of the knob for sliding
const MAX_DISTANCE = 100; // Max distance in your desired unit

const LocationSlider = memo(({ onDistanceChange }) => {
  const [sliderWidth, setSliderWidth] = useState(SLIDER_WIDTH);
  const translateX = new Animated.Value(0);
  const state = new Animated.Value(State.UNDETERMINED);

  const gestureHandler = onGestureEvent({ state, translationX: translateX });

  const adjustedTranslateX = withOffset(translateX, state);
  const distance = multiply(divide(adjustedTranslateX, sliderWidth), MAX_DISTANCE);

  useCode(() => set(translateX, diffClamp(adjustedTranslateX, 0, sliderWidth - KNOB_WIDTH)), []);

  const onLayout = useCallback(event => {
    const { width } = event.nativeEvent.layout;
    setSliderWidth(width);
  }, []);

  return (
    <View style={styles.container} onLayout={onLayout}>
      <PanGestureHandler {...gestureHandler}>
        <Animated.View
          style={[
            styles.knob,
            {
              transform: [{ translateX: adjustedTranslateX }],
            },
          ]}
        />
      </PanGestureHandler>
      <Text style={styles.distanceText}>
        {`${Math.round(Animated.divide(distance, MAX_DISTANCE) * 100)} km`}
      </Text>
    </View>
  );

});

export default LocationSlider;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    height: 60, // Adjust height as needed
    width: SLIDER_WIDTH,
    backgroundColor: Colors.white, // Use your color
    borderRadius: 30,
    overflow: "hidden",
  },
  knob: {
    width: KNOB_WIDTH,
    height: KNOB_WIDTH,
    borderRadius: KNOB_WIDTH / 2,
    backgroundColor: Colors.BB_darkRedPurple, // Use your color
    position: "absolute",
    left: 0,
    top: 15,
  },
  distanceText: {
    fontSize: 16,
    color: Colors.dark, // Use your color
    position: "absolute",
    bottom: 10,
  },
});
