import { createStackNavigator } from '@react-navigation/stack';

import Authenticate from '../screens/auth/Authenticate';
import CreateAccountScreen from '../screens/auth/CreateAccountScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import CreateListing from '../screens/CreateListing';
import ContactInfoScreen from '../screens/ContactInfoScreen';
import EditProfile from '../screens/EditProfileScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RatingScreen from '../screens/RatingScreen';
import BottomNavOverlay from './BottomNavOverlay';
import SettingsScreen from "../screens/SettingsScreen";
import ChangePasswordScreen from '../screens/ChangePasswordScreen';

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Authenticate"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Authenticate" component={Authenticate} />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="CreateAccount"
        component={CreateAccountScreen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="BottomNavOverlay"
        component={BottomNavOverlay}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="CreateListing"
        component={CreateListing}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ gestureEnabled: false }}
      />

      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="ContactInfoScreen" component={ContactInfoScreen} />
      <Stack.Screen name="RatingScreen" component={RatingScreen} />
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
