import { serverIp } from "../../config.js";
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Colors from "../../constants/Colors.js";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

const CreateAccountScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const isValidPassword = useRef(false);
  const hasCharacter = useRef(false);
  const hasLowercase = useRef(false);
  const hasUppercase = useRef(false);
  const hasNumber = useRef(false);
  const hasSpecialCharacter = useRef(false);

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

    if (
      name === "" ||
      password === "" ||
      confirmPassword === "" ||
      email === ""
    ) {
      Alert.alert("Invalid Input", "Please fill out all fields.");
      return;
    }

    if (name.length > 20) {
      Alert.alert("Invalid Input", "Name must be less than 20 characters.");
      return;
    }

    if (name.length < 6) {
      Alert.alert("Invalid Input", "Name must be at least 6 characters.");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Invalid Input", "Password must be at least 8 characters.");
      return;
    }

    if (isValidPassword.current === false) {
      Alert.alert(
        "Invalid Input",
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      );
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

  const handlePasswordChange = (text) => {
    setPassword(text);

    // Password validation criteria
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const hasCharacterValue = text.length >= 8;
    const hasLowercaseValue = /[a-z]/.test(text);
    const hasUppercaseValue = /[A-Z]/.test(text);
    const hasNumberValue = /\d/.test(text);
    const hasSpecialCharacterValue = /[@$!%*?&]/.test(text);

    hasCharacter.current = hasCharacterValue;
    hasLowercase.current = hasLowercaseValue;
    hasUppercase.current = hasUppercaseValue;
    hasNumber.current = hasNumberValue;
    hasSpecialCharacter.current = hasSpecialCharacterValue;

    // Check if the password meets all criteria
    isValidPassword.current =
      hasCharacterValue &&
      hasLowercaseValue &&
      hasUppercaseValue &&
      hasNumberValue &&
      hasSpecialCharacterValue;
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
          onChangeText={(text) => {
            setPassword(text);
            handlePasswordChange(text);
          }}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry={true}
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text)}
        />

        <View style={styles.passwordRequirements}>
          <Text style={styles.passwordRequirement}>
            {hasCharacter.current ? (
              <MaterialIcons name="check" size={16} color="green" />
            ) : (
              <Entypo name="cross" size={16} color="red" />
            )}{" "}
            Has at least 8 Characters
          </Text>
          <Text style={styles.passwordRequirement}>
            {hasLowercase.current ? (
              <MaterialIcons name="check" size={16} color="green" />
            ) : (
              <Entypo name="cross" size={16} color="red" />
            )}{" "}
            Has Lowercase Letter
          </Text>
          <Text style={styles.passwordRequirement}>
            {hasUppercase.current ? (
              <MaterialIcons name="check" size={16} color="green" />
            ) : (
              <Entypo name="cross" size={16} color="red" />
            )}{" "}
            Uppercase
          </Text>
          <Text style={styles.passwordRequirement}>
            {hasNumber.current ? (
              <MaterialIcons name="check" size={16} color="green" />
            ) : (
              <Entypo name="cross" size={16} color="red" />
            )}{" "}
            Number
          </Text>
          <Text style={styles.passwordRequirement}>
            {hasSpecialCharacter.current ? (
              <MaterialIcons name="check" size={16} color="green" />
            ) : (
              <Entypo name="cross" size={16} color="red" />
            )}{" "}
            Special Character
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleCreateAccount}
          style={styles.createAccountTextContainer}
        >
          <Text style={styles.createAccountText}>Create Account</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          style={styles.loginTextContainer}
        >
          <Text style={styles.loginText}>Already have an Account? Login</Text>
        </TouchableOpacity>
      </View>
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
    width: windowWidth * 0.8,
    height: windowHeight * 0.5,
    padding: 20,
    borderRadius: 10,
    shadowColor: "black",
    shadowOpacity: 1,
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowRadius: 7,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  createAccountTextContainer: {
    width: windowWidth * 0.4,
    backgroundColor: Colors.BB_rangeYellow,
    padding: 5,
    borderColor: Colors.black,
    borderRadius: 10,
    fontWeight: "bold",
    shadowColor: "black",
    shadowOpacity: 1,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowRadius: 2,
  },
  createAccountText: {
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "center",
  },
  loginTextContainer: {
    marginTop: 10,
    padding: 5,
    borderColor: Colors.black,
    borderRadius: 10,
    color: "black",
    fontWeight: "bold",
  },
  loginText: {
    fontSize: 10,
    color: "white",
  },
  input: {
    width: windowWidth * 0.75,
    height: windowHeight * 0.03,
    borderColor: "gray",
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 7,
    backgroundColor: "white",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  passwordRequirements: {
    flexDirection: "column",
    justifyContent: "space-between",
    width: windowWidth * 0.4,
    height: windowHeight * 0.1,
    marginBottom: 15,
  },
  passwordRequirement: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 12,
    color: "white",
  },
});

export default CreateAccountScreen;
