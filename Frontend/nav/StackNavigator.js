import { createStackNavigator } from '@react-navigation/stack';

import Authenticate from '../screens/auth/Authenticate';
import CreateAccountScreen from '../screens/auth/CreateAccountScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import CreateListing from '../screens/CreateListing';
import EditContactInfo from '../screens/EditContactInfo';
import EditProfile from '../screens/EditProfileScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RatingScreen from '../screens/RatingScreen';
import BottomNavOverlay from './BottomNavOverlay';
import SettingsPage from "../screens/SettingsPage";


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
      <Stack.Screen name="EditContactInfo" component={EditContactInfo} />
      <Stack.Screen name="SettingsPage" component={SettingsPage} />
      <Stack.Screen name="RatingScreen" component={RatingScreen} />
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
