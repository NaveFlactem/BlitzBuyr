import { Entypo, MaterialIcons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { serverIp } from '../../config.js';
import { useThemeContext } from '../../components/visuals/ThemeProvider.js';
import { getThemedStyles } from '../../constants/Styles.js';

const CreateAccountScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const isValidPassword = useRef(false);
  const hasCharacter = useRef(false);
  const hasLowercase = useRef(false);
  const hasUppercase = useRef(false);
  const hasNumber = useRef(false);
  const hasSpecialCharacter = useRef(false);
  const styles = getThemedStyles(useThemeContext().theme).CreateAccountScreen;

  const handleCreateAccount = async () => {
    if (password !== confirmPassword) {
      Alert.alert(
        'Password Mismatch',
        'Password and Confirm Password do not match.',
      );
      return;
    }

    // Check if email is valid
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (!emailPattern.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    if (
      name === '' ||
      password === '' ||
      confirmPassword === '' ||
      email === ''
    ) {
      Alert.alert('Invalid Input', 'Please fill out all fields.');
      return;
    }

    if (name.length > 20) {
      Alert.alert('Invalid Input', 'Name must be less than 20 characters.');
      return;
    }

    if (name.length < 4) {
      Alert.alert('Invalid Input', 'Name must be at least 4 characters.');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Invalid Input', 'Password must be at least 8 characters.');
      return;
    }

    if (isValidPassword.current === false) {
      Alert.alert(
        'Invalid Input',
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
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
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registrationData),
    });

    let responseData = await response.json();

    if (response.status <= 201) {
      console.log('Response data:', responseData);
      navigation.navigate('Login');
    } else {
      Alert.alert(responseData.error);
    }
  };

  const handlePasswordChange = (text) => {
    setPassword(text);

    // Password validation criteria
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&.~`]{8,}$/;

    const hasCharacterValue = text.length >= 8;
    const hasLowercaseValue = /[a-z]/.test(text);
    const hasUppercaseValue = /[A-Z]/.test(text);
    const hasNumberValue = /\d/.test(text);
    const hasSpecialCharacterValue = /[@$!%*?&.~`,/-]/.test(text);

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
          source={require('../../assets/icon_transparent.png')} // Provide the correct path to your logo image
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
            )}{' '}
            Has at least 8 Characters
          </Text>
          <Text style={styles.passwordRequirement}>
            {hasLowercase.current ? (
              <MaterialIcons name="check" size={16} color="green" />
            ) : (
              <Entypo name="cross" size={16} color="red" />
            )}{' '}
            Has Lowercase Letter
          </Text>
          <Text style={styles.passwordRequirement}>
            {hasUppercase.current ? (
              <MaterialIcons name="check" size={16} color="green" />
            ) : (
              <Entypo name="cross" size={16} color="red" />
            )}{' '}
            Uppercase
          </Text>
          <Text style={styles.passwordRequirement}>
            {hasNumber.current ? (
              <MaterialIcons name="check" size={16} color="green" />
            ) : (
              <Entypo name="cross" size={16} color="red" />
            )}{' '}
            Number
          </Text>
          <Text style={styles.passwordRequirement}>
            {hasSpecialCharacter.current ? (
              <MaterialIcons name="check" size={16} color="green" />
            ) : (
              <Entypo name="cross" size={16} color="red" />
            )}{' '}
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
          onPress={() => navigation.navigate('Login')}
          style={styles.loginTextContainer}
        >
          <Text style={styles.loginText}>Already have an Account? Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CreateAccountScreen;
