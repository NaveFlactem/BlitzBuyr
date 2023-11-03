import * as React from "react";
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import { memo } from "react";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const EditProfileScreen = ({ navigation }) => {
  const goBack = () => {
    navigation.navigate("BottomNavOverlay");
  };
  return (
    <View style={styles.container}>
      <Text>Edit Profile Screen</Text>
      <TouchableOpacity onPress={goBack}>
        <Text>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default memo(EditProfileScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
