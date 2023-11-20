import { serverIp } from "../../config.js";
import React, { useState, useEffect } from "react";
import { scheduleNotification } from '../../components/Notifications.js';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  Dimensions,
} from "react-native";
import Colors from "../../constants/Colors";
import * as SecureStore from "expo-secure-store";
import {
  getStoredUsername,
  getStoredPassword,
  setStoredCredentials,
} from "./Authenticate.js";

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  clearFields = () => {
    setUsername("");
    setPassword("");
  };

  const handleLogin = async () => {
    // Handle manual login process when the "Login" button is pressed
    const loginData = {
      username: username,
      password: password,
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
      await setStoredCredentials(username, password);
      clearFields();
      navigation.navigate("BottomNavOverlay");
      scheduleNotification();
    } else {
      Alert.alert(responseData.error);
    }
  };

  const handleCreateAccount = () => {
    navigation.navigate("CreateAccount");
  };

  return (
    <View style={styles.container}>
      {loggedIn ? (
        <Text style={styles.welcomeText}>Welcome, {username}!</Text>
      ) : (
        <View style={styles.loginContainer}>
          <Image
            source={require("../../assets/icon_transparent.png")} // Provide the correct path to your logo image
            style={styles.logo} // Define a style for your logo
          />
          <TextInput
            style={styles.input}
            placeholder="Username"
            onChangeText={(text) => setUsername(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            onChangeText={(text) => setPassword(text)}
            secureTextEntry
          />
          <TouchableOpacity
            onPress={handleLogin}
            style={styles.loginTextContainer}
          >
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleCreateAccount}
            style={styles.createAccountTextContainer}
          >
            <Text style={styles.createAccountText}>Create an account</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: Colors.BB_darkRedPurple,
    alignItems: "center",
    padding: 16,
  },
  loginContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.BB_pink,
    padding: 20,
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: Colors.black,
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 2,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  input: {
    width: windowWidth * 0.45,
    height: windowHeight * 0.04,
    borderColor: "gray",
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 7,
    backgroundColor: "white",
    ...Platform.select({
      ios: {
        shadowColor: Colors.black,
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 2,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  loginTextContainer: {
    width: windowWidth * 0.2,
    backgroundColor: Colors.BB_rangeYellow,
    padding: 5,
    width: "100%",
    borderColor: Colors.black,
    borderRadius: 10,
    fontWeight: "bold",
    shadowColor: "black",
    ...Platform.select({
      ios: {
        shadowColor: Colors.black,
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 2,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  loginText: {
    fontSize: 15,
  },
  createAccountTextContainer: {
    marginTop: 10,
    padding: 5,
    borderColor: Colors.black,
    borderRadius: 10,
    color: "black",
    fontWeight: "bold",
  },
  createAccountText: {
    fontSize: 8,
    color: "white",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    shadowRadius: 3,
    ...Platform.select({
      ios: {
        shadowColor: Colors.black,
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 2,
      },
      android: {
        elevation: 10,
      },
    }),
  },
});

export default LoginScreen;
