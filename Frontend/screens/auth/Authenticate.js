import { serverIp } from "../../config.js";
import { useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { StyleSheet } from "react-native";
import Colors from "../../constants/Colors";
import { View, Image } from "react-native";

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

const AuthenticateScreen = ({ navigation }) => {
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

export { getStoredUsername, getStoredPassword, setStoredCredentials };
export default AuthenticateScreen;
