import React, { memo, useState } from "react";
import {
  View,
  Image,
  Dimensions,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../constants/Colors";

const TopBar = memo(({ handleMenuPress, handleLocationPress }) => {
  return (
    <View style={styles.topBar}>
      <TouchableOpacity style={styles.menu} onPress={handleMenuPress}>
        <MaterialCommunityIcons
          name="menu"
          size={30}
          color={Colors.BB_bone}
          style={(alignSelf = "center")}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.location} onPress={handleLocationPress}>
        <MaterialCommunityIcons
          name="map-marker"
          size={30}
          color={Colors.BB_bone}
        />
      </TouchableOpacity>
      <Image
        style={styles.logo}
        source={require("../assets/blitzbuyr_name_logo.png")}
      />
    </View>
  );
});

export default TopBar;

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
  menu: {
    position: "absolute",
    paddingTop: Platform.OS == "ios" ? 20 : 29,
    paddingLeft: 20,
    paddingBottom: 20,
    paddingRight: 20,
    height: "auto",
    width: "auto",
    alignContent: "center",
    justifyContent: "center",
    borderRadius: 80,
    left: "1%",
    zIndex: 11,
    ...Platform.select({
      ios: {
        top: "28%",
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
      },
      android: {
        top: "12%",
      },
    }),
  },
  location: {
    position: "absolute",
    height: "auto",
    width: "auto",
    bottom: "8%",
    right: "5%",
    zIndex: 11,
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
    overflow: "hidden",
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
