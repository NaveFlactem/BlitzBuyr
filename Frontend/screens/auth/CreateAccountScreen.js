import { serverIp } from "../../config.js";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Image,
} from "react-native";

const CreateAccountScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleCreateAccount = async () => {
    if (password !== confirmPassword) {
      Alert.alert(
        "Password Mismatch",
        "Password and Confirm Password do not match.",
      );
      return;
    }

    // Check if email is valid
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (!emailPattern.test(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    const registrationData = {
      username: name,
      password: password,
      confirmPassword: confirmPassword,
      email: email,
    };

    const response = await fetch(`${serverIp}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registrationData),
    });

    let responseData = await response.json();

    if (response.status <= 201) {
      console.log("Response data:", responseData);
      navigation.navigate("Login");
    } else {
      Alert.alert(responseData.error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginContainer}>
        <Image
          source={require("../../assets/icon_transparent.png")} // Provide the correct path to your logo image
          style={styles.logo} // Define a style for your logo
        />
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry={true}
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text)}
        />
        <Button title="Create Account" onPress={handleCreateAccount} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#D6447F",
    alignItems: "center",
    padding: 16,
  },
  loginContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    backgroundColor: "#F7A859",
    padding: 20,
    borderRadius: 10,
    shadowColor: "rgba(0, 0, 0, 0.3)",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    marginBottom: 12,
    padding: 8,
  },
  logo: {
    width: 100, // Adjust the width as needed
    height: 100, // Adjust the height as needed
    marginBottom: 20, // Adjust the spacing
    // Add other styles as needed
  },
});

export default CreateAccountScreen;
