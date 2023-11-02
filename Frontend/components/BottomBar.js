import React from "react";
import { StyleSheet, View, Image, Dimensions } from "react-native";
import { memo } from "react";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  bottomBar: {
    position: "absolute",
    height: 0.2 * screenHeight,
    width: screenWidth,
    bottom: 0,
  },
  bottomBarFiller: {
    position: "absolute",
    bottom: 0,
    height: 0.08 * screenHeight,
    width: screenWidth,
    backgroundColor: "#58293F",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "black",
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: -2 },
  },
  image: {
    position: "absolute",
    alignSelf: "center",
    height: 0.1 * screenHeight,
    width: 0.2 * screenWidth,
    bottom: 0.005 * screenHeight,  
  },
});

const BottomBar = memo(function BottomBar() {
  return (
      <View style={styles.bottomBar}>
        <View style={styles.bottomBarFiller} />

        <Image style={styles.image} source={require("../assets/icon_background_transparent_upright.png")}/>
      </View>
      )
});

export default BottomBar;
