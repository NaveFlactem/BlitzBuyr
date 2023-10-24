
import { createStackNavigator } from '@react-navigation/stack';

import CreateAccountScreen from '../screens/auth/CreateAccountScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CreateListing from '../screens/CreateListing';
import BottomNavOverlay from './BottomNavOverlay';

const Stack = createStackNavigator();

const StackNavigator = () => {
    // const { user } = useAuth();
  return (
      <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="CreateListing" component={CreateListing} />
        <Stack.Screen name="BottomNavOverlay" component={BottomNavOverlay} />
      </Stack.Navigator>
  );
}

export default StackNavigator;
