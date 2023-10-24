import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './StackNavigator'; 
import { createStackNavigator } from '@react-navigation/stack';

import CreateAccountScreen from './screens/CreateAccountScreen';
import LoginScreen from './screens/LoginScreen';
import CreateListing from './CreateListing';

const Stack = createStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="CreateListing">
        <Stack.Screen name="Login" component={LoginScreen}options={{ headerShown: false}} />
        <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
        <Stack.Screen name="CreateListing" component={CreateListing} options={{ headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

//export default App;
