import React from "react";
import { View, Text, Image, Dimensions, StyleSheet } from "react-native";
import { memo } from "react";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  logo: {
    height: 0.04 * screenHeight,
    width: 0.5 * screenWidth,
    top: 0.02 * screenHeight,
    right: 0.01 * screenWidth,
  },
  topBar: {
    position: "absolute",
    top: 0,
    height: 0.09 * screenHeight,
    width: screenWidth,
    backgroundColor: "#58293F",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "black",
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 10,
  },
});

const TopBar = memo(function TopBar() {
  return (
    <View style={styles.topBar}>
      <Image
        style={styles.logo}
        source={require("../assets/blitzbuyr_name_logo.png")}
      />
    </View>
  );
});

export default TopBar;
