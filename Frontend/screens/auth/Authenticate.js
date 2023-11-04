import { serverIp } from "../../config.js";
import { useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { View, StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

const AuthenticateScreen = ({ navigation }) => {
  useEffect(() => {
    const checkStoredCredentials = async () => {
      try {
        // Get stored username and password from SecureStore
        const [storedUsername, storedPassword] = await Promise.all([
          SecureStore.getItemAsync("username"),
          SecureStore.getItemAsync("password"),
        ]);

        if (storedUsername && storedPassword) {
          // If both username and password are stored, attempt login
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

          if (response.status <= 201) {
            // If login successful, navigate to the main screen
            const responseData = await response.json();
            console.log("Response data:", responseData);
            navigation.navigate("BottomNavOverlay");
          } else {
            // If login failed, navigate back to the login screen
            navigation.navigate("Login");
          }
        } else {
          // If no stored credentials, navigate back to the login screen
          navigation.navigate("Login");
        }
      } catch (error) {
        console.error("Error:", error);
        // If an error occurs, navigate back to the login screen
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
