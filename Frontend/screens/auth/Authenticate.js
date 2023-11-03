import { serverIp } from "../../config.js";
import { useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { StyleSheet } from "react-native";
import Colors from "../../constants/Colors";
import { View, Image } from "react-native";

const AuthenticateScreen = ({ navigation }) => {
  useEffect(() => {
    const checkStoredCredentials = async () => {
      const storedUsername = await SecureStore.getItemAsync("username");
      const storedPassword = await SecureStore.getItemAsync("password");

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

export default AuthenticateScreen;
