import React, { useState, memo } from "react";
import { View, StyleSheet, Dimensions, TouchableOpacity, Text, Platform } from "react-native";
import Colors from "../constants/Colors";
import Slider from "@react-native-community/slider";

const LocationSlider = memo(({ distance, setDistance, distanceChanged }) => {
  const [sliderValue, setSliderValue] = useState(30);



  return (
      <View style={styles.box}>
        <Text style={styles.valueText}>
          {(sliderValue <= 500) ? sliderValue + " miles" : "No Limit"}
        </Text>
        <Slider
          style={{ width: "90%", height: 40, top: "10%"}}
          minimumValue={10}
          maximumValue={510}
          step={10}
          value={sliderValue}
          onValueChange={(value) => setSliderValue(value)}
          minimumTrackTintColor={Colors.BB_pink}
          maximumTrackTintColor="#000000"
          thumbImage={require("../assets/icon_transparent_background_filled_upright_mini.png")}
          onSlidingComplete={(value) => setDistance(value)}
        />
      </View>
  );
});
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  box: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.BB_darkRedPurple,
    position: "absolute",
    right: 0 * screenWidth,
    bottom: 0.75 * screenHeight,
    width: screenWidth * 0.7,
    height: screenHeight * 0.07,
    borderRadius: 80,
    ...Platform.select({
      ios: {
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
      },
      android: {
        elevation: 20,
      },
    }),
  },
  valueText: {
    position: "absolute",
    bottom: "65%",
    color: Colors.white,
    fontWeight: "bold",
    fontSize: "14",
  },
});

export default LocationSlider;
