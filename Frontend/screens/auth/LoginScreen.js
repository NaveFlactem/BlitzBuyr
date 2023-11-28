import React, { useState } from 'react';
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
import Colors from '../../constants/Colors';
import { setStoredCredentials } from './Authenticate.js';
import { useThemeContext } from '../../components/visuals/ThemeProvider.js';
import { getThemedStyles } from '../../constants/Styles.js';

const LoginScreen = ({ navigation }) => {
  const styles = getThemedStyles(useThemeContext().theme).LoginScreen;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  clearFields = () => {
    setUsername('');
    setPassword('');
  };

  const handleLogin = async () => {
    // Handle manual login process when the "Login" button is pressed
    const loginData = {
      username: username,
      password: password,
    };

    const response = await fetch(`${serverIp}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    let responseData = await response.json();

    if (response.status <= 201) {
      console.log('Response data:', responseData);
      await setStoredCredentials(username, password);
      clearFields();
      navigation.navigate('BottomNavOverlay');
    } else {
      Alert.alert(responseData.error);
    }
  };

  const handleCreateAccount = () => {
    navigation.navigate('CreateAccount');
  };

  return (
    <View style={styles.container}>
      {loggedIn ? (
        <Text style={styles.welcomeText}>Welcome, {username}!</Text>
      ) : (
        <View style={styles.loginContainer}>
          <Image
            source={require('../../assets/icon_transparent.png')} // Provide the correct path to your logo image
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

export default LoginScreen;
