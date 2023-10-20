import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
    const navigation = useNavigation(); // Get the navigation object
  
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
  
    const handleLogin = () => {
      // You can add your login logic here. For this example, we'll just set loggedIn to true.
      setLoggedIn(true);
    };
  
    const handleCreateAccount = () => {
      // Use the navigation object to navigate to the "CreateAccount" screen.
      navigation.navigate('CreateAccount');
    };
    
    return (
        <View style={styles.container}>
        {loggedIn ? (
          <Text>Welcome, {username}!</Text>
        ) : (
          <View style={styles.loginContainer}>
            <Text>Login</Text>
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
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    loginContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    input: {
      width: 200,
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
    },
    createAccountText: {
      color: 'blue',
    },
  });
  
  export default LoginScreen;