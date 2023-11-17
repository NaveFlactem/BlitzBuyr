import React from "react";
import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";
import { memo } from "react";
import Colors from "../constants/Colors";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  logo: {
    height: 0.1 * screenWidth,
    width: 0.55 * screenWidth,
    top: 0.02 * screenHeight,
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
    height: "auto",
    width: "auto",
    bottom: "8%",
    left: "5%",
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
    height: 0.08 * screenHeight,
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
      <TouchableOpacity style={styles.menu}>
        <MaterialCommunityIcons name="menu" size={30} color={Colors.BB_bone} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.location}>
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
