import { serverIp } from "../../config.js";
import { useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { StyleSheet } from "react-native";
import Colors from "../../constants/Colors";
import { View, Image } from "react-native";
import { startBackgroundFetch } from '../../components/Notifications.js';
import { Asset } from "expo-asset";

const assetsToPreload = [
  require("../../assets/blitzbuyr_name_logo.png"),
  require("../../assets/blitzbuyr_name_logo.png"),
  require("../../assets/blitzbuyr_name_transparent_horizontal.png"),
  require("../../assets/blitzbuyr_name_transparent.png"),
  require("../../assets/blitzbuyr_name.png"),
  require("../../assets/icon_background_transparent_upright.png"),
  require("../../assets/icon_background_transparent.png"),
  require("../../assets/icon_transparent_background_filled_upright.png"),
  require("../../assets/icon_transparent_background_filled.png"),
  require("../../assets/icon_transparent.png"),
  require("../../assets/icon.png"),
  require("../../assets/no_wifi_icon_transparent.png"),
];

let storedUsername;
let storedPassword;

const getStoredUsername = () => storedUsername;
const getStoredPassword = () => storedPassword;

const setStoredCredentials = async (username, password) => {
  storedUsername = username;
  storedPassword = password;
  await SecureStore.setItemAsync("username", username);
  await SecureStore.setItemAsync("password", password);
};

const clearStoredCredentials = async () => {
  try {
    await SecureStore.deleteItemAsync("username");
    await SecureStore.deleteItemAsync("password");
    console.log("Stored credentials cleared.");
  } catch (error) {
    console.error("Error clearing stored credentials:", error);
  }
};

const AuthenticateScreen = ({ navigation }) => {
  useEffect(() => {
    // Load and cache the assets when the component mounts
    async function loadAssetsAsync() {
      const assetPromises = assetsToPreload.map((asset) =>
        Asset.fromModule(asset).downloadAsync(),
      );
      await Promise.all(assetPromises);
    }

    loadAssetsAsync();
  }, []);

  useEffect(() => {
    const checkStoredCredentials = async () => {
      storedUsername = await SecureStore.getItemAsync("username");
      storedPassword = await SecureStore.getItemAsync("password");

      if (storedUsername && storedPassword) {
        // Stored credentials exist, use them for login
        const loginData = {
          username: storedUsername,
          password: storedPassword,
        };

        const response = await fetch(`${serverIp}/api/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        });

        let responseData = await response.json();

        if (response.status <= 201) {
          console.log("Response data:", responseData);
          navigation.navigate("BottomNavOverlay");
          startBackgroundFetch();

        } else {
          navigation.navigate("Login");
        }
      } else {
        navigation.navigate("Login");
      }
    };

    checkStoredCredentials();
  }, []);

  return <View style={styles.container}></View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BB_darkRedPurple,
    alignItems: "center",
    justifyContent: "center",
  },
});

export {
  getStoredUsername,
  getStoredPassword,
  setStoredCredentials,
  clearStoredCredentials,
};
export default AuthenticateScreen;
