import React from "react";
import { View, Text, Image, Dimensions, StyleSheet } from "react-native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  image: {
    height: 0.08 * screenHeight,
    width: 0.08 * screenHeight,
    top: 0.015 * screenHeight,
  },
  topBar: {
    position: "absolute",
    top: 0,
    height: 0.13 * screenHeight,
    width: screenWidth,
    backgroundColor: "#58293F",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 4,
    borderBottomColor: "#F7A859",
    zIndex: 1,
  },
});

const TopBar = () => {
  return (
    <View style={styles.topBar}>
      <Image
        style={styles.image}
        source={require("../assets/icon_transparent.png")}
      />
    </View>
  );
};

export default TopBar;
