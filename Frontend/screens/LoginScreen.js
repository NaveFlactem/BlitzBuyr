import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const LoginScreen = () => {
    const navigation = useNavigation(); // Get the navigation object
  
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
  
    const handleLogin = () => {
      // You can add your login logic here. For this example, we'll just set loggedIn to true.
      const loginData = {
        username: username, // Get the username from the input field
        password: password, // Get the password from the input field
      };
    
      axios
        .post('/login', loginData)
        .then((response) => {
          // Authentication successful, handle the response as needed
          // For example, you can navigate to the user's profile or a dashboard page
          // or store user information in the app's state
          console.log('Login successful', response.data);
          setLoggedIn(true);
        })
        .catch((error) => {
          // Handle authentication error, e.g., incorrect username or password
          if (error.response && error.response.status === 401) {
            Alert.alert('Authentication failed. Please check your username and password.');
            // You can display an error message to the user
          } else {
            // Handle other errors (e.g., server not reachable)
            Alert.alert('Login failed. Please try again later.');
            // You can display an error message to the user
          }
        });
    };
  
    const handleCreateAccount = () => {
      // Use the navigation object to navigate to the "CreateAccount" screen.
      navigation.navigate('CreateAccount');
    };
    
    return (
      <View style={styles.container}>
        {loggedIn ? (
          <Text style={styles.welcomeText}>Welcome, {username}!</Text>
        ) : (
          <View style={styles.loginContainer}>
            <Image
              source={require('../assets/icon_transparent.png')} // Provide the correct path to your logo image
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
            <Button title="Login" onPress={handleLogin} />
            <TouchableOpacity onPress={handleCreateAccount}>
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
      backgroundColor: '#D6447F',
      alignItems: 'center',
      justifyContent: 'center',
    },
    loginContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#F7A859',
      padding: 20,
      borderRadius: 10,
      shadowColor: 'rgba(0, 0, 0, 0.3)',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowRadius: 5,
      elevation: 5,
    },
    loginText: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    welcomeText: {
      fontSize: 24,
    },
    input: {
      width: 200,
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      paddingHorizontal: 10,
      borderRadius: 5,
    },
    createAccountText: {
      color: 'blue',
      marginTop: 10,
    },
    logo: {
      width: 100, // Adjust the width as needed
      height: 100, // Adjust the height as needed
      marginBottom: 20, // Adjust the spacing
      // Add other styles as needed
    },
  });
  
  export default LoginScreen;