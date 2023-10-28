import { serverIp } from "../../config.js";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import Colors from "../../constants/Colors";
import * as SecureStore from 'expo-secure-store';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkStoredCredentials = async () => {
      const storedUsername = await SecureStore.getItemAsync('username');
      const storedPassword = await SecureStore.getItemAsync('password');

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
          Alert.alert(responseData.error);
        }
      }
    };

    checkStoredCredentials();
  }, []);

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
      await SecureStore.setItemAsync('username', username);
      await SecureStore.setItemAsync('password', password);
      navigation.navigate("BottomNavOverlay");
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
    backgroundColor: Colors.BB_darkOrange,
    padding: 20,
    borderRadius: 10,
    shadowColor: "black",
    shadowOpacity: 1,
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowRadius: 7,
    elevation: 5,
  },
  input: {
    width: 200,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  loginTextContainer: {
    backgroundColor: Colors.BB_rangeYellow,
    padding: 5,
    width: "100%",
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: 10,
    fontWeight: "bold",
    shadowColor: "black",
    shadowOpacity: 1,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 2,
    elevation: 2,
  },
  loginText: {
    fontSize: 20,
  },
  createAccountTextContainer: {
    marginTop: 10,
    backgroundColor: Colors.BB_darkRedPurple,
    padding: 5,
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: 10,
    color: "black",
    fontWeight: "bold",
    shadowColor: "black",
    shadowOpacity: 1,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 2,
    elevation: 2,
  },
  createAccountText: {
    fontSize: 8,
    color: "white",
  },
  logo: {
    width: 100, // Adjust the width as needed
    height: 100, // Adjust the height as needed
    marginBottom: 20, // Adjust the spacing
    shadowRadius: 3,
    shadowColor: "black",
    shadowOpacity: 1,
    shadowOffset: {
      width: 2,
      height: 3,
    },
  },
});

export default LoginScreen;
