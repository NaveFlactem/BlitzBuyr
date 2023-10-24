import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={require('./screens/LoginScreen').default} />
      <Stack.Screen name="CreateAccount" component={require('./screens/CreateAccountScreen').default} />
      <Stack.Screen name="CreateListing" component={require('./screens/CreateListing').default} />
      <Stack.Screen name="Home" component={require('./screens/HomeScreen').default} />
      <Stack.Screen name="Profile" component={require('./screens/ProfileScreen').default} />
    </Stack.Navigator>
  );
}

export default StackNavigator;
