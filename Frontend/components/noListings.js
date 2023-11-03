import React from "react";
import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const NoListings = () => {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name="file-document-outline"
        size={100}
        color="gray"
      />
      <Text style={styles.text}>No listings available.</Text>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: "gray",
  },
};

export default NoListings;
