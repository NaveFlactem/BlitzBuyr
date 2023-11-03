import React from "react";
import { View, Text, TouchableOpacity, Image, Dimensions } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const NoWifi = () => {
  const onRetry = () => {
    console.log("Retry button pressed.");
  };

  return (
    <View style={styles.noWifiContainer}>
      <Image
        style={styles.noWifiImage}
        source={require("../assets/no_wifi_icon_transparent.png")}
      />
      <Text style={styles.noWifiText}>No network connection available.</Text>
      <TouchableOpacity onPress={onRetry} style={styles.retryButton}>
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
};

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const styles = {
  noWifiContainer: {
    flex: 1,
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 0.1 * screenHeight,
  },
  noWifiText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "gray",
  },
  noWifiImage: {
    position: "absolute",
    width: 0.3 * screenWidth,
    height: 0.15 * screenHeight,
    alignSelf: "center",
    top: 0.2 * screenHeight,
  },
  retryButton: {
    alignSelf: "center",
    marginTop: 20,
    backgroundColor: "pink",
    padding: 10,
    borderRadius: 5,
    width: 0.3 * screenWidth,
  },
  retryButtonText: {
    alignSelf: "center",
    color: "white",
    fontWeight: "bold",
  },
};

export default NoWifi;
