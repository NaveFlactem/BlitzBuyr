import { createStackNavigator } from "@react-navigation/stack";

import CreateAccountScreen from "../screens/auth/CreateAccountScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import CreateListing from "../screens/CreateListing";
import Authenticate from "../screens/auth/Authenticate";
import BottomNavOverlay from "./BottomNavOverlay";
import EditProfile from "../screens/EditProfileScreen";
import RatingScreen from "../screens/RatingScreen";

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
      <Stack.Screen name="RatingScreen" component={RatingScreen} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
