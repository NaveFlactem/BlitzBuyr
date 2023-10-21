import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import CreateAccountScreen from './CreateAccountScreen';
import LoginScreen from './LoginScreen';
import CreateListing from './CreateListing';


const Stack = createStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="CreateListing">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
        <Stack.Screen name="CreateListing" component={CreateListing} options={{ headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}