import React from "react";
import { StyleSheet, View, Image, Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  bottomBar: {
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
  image : {
    height: 0.1 * screenHeight,
    width: 0.2 * screenWidth,
    
},
});

const BottomBar = () => {
  return (
      <View style={styles.bottomBar}></View>
      )
};

const BottomBarImage = () => {
  return (
      <View>
          <Image style={styles.image} source={require("../assets/icon_background_transparent_upright.png")}/>
      </View>
  )
};

export {BottomBar, BottomBarImage};
