import React, { memo } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../constants/Colors";

const NoListings = memo(({ onRetry }) => {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name="file-document-outline"
        size={100}
        color={Colors.BB_darkRedPurple}
      />
      <Text style={styles.text}>No listings available</Text>
      <TouchableOpacity onPress={onRetry} style={styles.retryButton}>
        <Text style={styles.buttonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
});

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const styles = {
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.BB_darkRedPurple,
    textAlign: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.BB_bone,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 20,
    justifyContent: "center",
    backgroundColor: Colors.BB_darkRedPurple,
    padding: 10,
    borderRadius: 40,
    width: "20%",
    height: "7%",
    ...Platform.select({
      ios: {
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
      },
      android: {
        elevation: 5,
      },
    }),
  },
};

export default NoListings;
