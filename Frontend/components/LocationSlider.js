import React, {memo} from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Animated, {
  Value,
  call,
  concat,
  cond,
  diffClamp,
  divide,
  eq,
  interpolate,
  multiply,
  round,
  sub,
  useCode,
} from "react-native-reanimated";
import { ReText, onGestureEvent, withOffset } from "react-native-redash";

import Knob from './Knob';

const LocationSlider = memo(() => {
    const state = new Value(State.UNDETERMINED);
    const translationX = new Value(0);
    const gestureHandler = onGestureEvent({ state, translationX });
    const x = diffClamp(withOffset(translationX, state), 0, 100);
    const width = Dimensions.get("window").width - 32;
    const snapPoints = new Array(5).fill(0).map((e, i) => i * width / 4);
    const index = round(divide(x, width / 4));
    const translateX = interpolate(x, {
      inputRange: snapPoints,
      outputRange: snapPoints,
    });
    useCode(
      () =>
        cond(
          eq(state, State.END),
          call([index], ([i]) => console.log(i))
        ),
      [index]
    );
    return (
      <View style={styles.container}>
        <View style={styles.slider}>
          <Animated.View style={[styles.background, { width: translateX }]} />
          <Knob {...{ state, translationX, gestureHandler }} />
        </View>
        <ReText text={concat(index)} />
      </View>
    );
})

export default LocationSlider;

const styles = StyleSheet.create({
    background: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "#F4F4F6",
        borderRadius: 8,
        },
    container: {
        flex: 1,
        backgroundColor: "#1E1B26",
        justifyContent: "center",
        },
    slider: {
        height: 50,
        marginHorizontal: 16,
        borderRadius: 8,
        backgroundColor: "white",
        justifyContent: "center",
        },

});