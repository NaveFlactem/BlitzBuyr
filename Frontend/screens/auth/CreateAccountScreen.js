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
  TouchableOpacity,
} from "react-native";
import Colors from "../../constants/Colors.js";

const CreateAccountScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleCreateAccount = async () => {
    if (password !== confirmPassword) {
      Alert.alert(
        "Password Mismatch",
        "Password and Confirm Password do not match."
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
        <TouchableOpacity
          onPress={handleCreateAccount}
          style={styles.createAccountTextContainer}
        >
          <Text style={styles.createAccountText}>Create Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginTextContainer}>
          <Text style={styles.loginText}>Already have an Account? Login</Text>
        </TouchableOpacity>
      </View>
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
    width: "100%",
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  createAccountTextContainer: {
    marginTop: 10,
    backgroundColor: Colors.BB_rangeYellow,
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
    fontSize: 16,
  },
  loginTextContainer: {
    marginTop: 10,
    backgroundColor: Colors.BB_darkRedPurple,
    padding: 5,
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
    fontSize: 6,
    color: "white",
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
    shadowRadius: 3,
    shadowColor: "black",
    shadowOpacity: 1,
    shadowOffset: {
      width: 2,
      height: 3,
    },
  },
});

export default CreateAccountScreen;
