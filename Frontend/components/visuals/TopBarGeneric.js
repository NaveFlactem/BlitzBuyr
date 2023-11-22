import React from "react";
import { View, Image, Dimensions, StyleSheet, Platform } from "react-native";
import { memo } from "react";
import Colors from "../../constants/Colors";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  logo: {
    height: 0.1 * screenWidth,
    width: 0.55 * screenWidth,
    top: 0.025 * screenHeight,
    right: 0.01 * screenWidth,
    ...Platform.select({
      ios: {
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
      },
    }),
  },
  topBar: {
    position: "absolute",
    height: 0.09 * screenHeight,
    width: screenWidth,
    backgroundColor: Colors.BB_darkRedPurple,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 3,
    borderColor:
      Platform.OS == "ios" ? "rgba(0, 0, 0, 0.2)" : "rgba(0, 0, 0, 0.3)",
    ...Platform.select({
      ios: {
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
      },
    }),
    zIndex: 10,
  },
});

const TopBar = memo(function TopBar() {
  return (
    <View style={styles.topBar}>
      <Image
        style={styles.logo}
        source={require("../../assets/blitzbuyr_name_logo.png")}
      />
    </View>
  );
});

export default TopBar;
