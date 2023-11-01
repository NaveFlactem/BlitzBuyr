import { createStackNavigator } from "@react-navigation/stack";

import CreateAccountScreen from "../screens/auth/CreateAccountScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import CreateListing from "../screens/CreateListing";
import Authenticate from "../screens/auth/Authenticate";
import BottomNavOverlay from "./BottomNavOverlay";

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Authenticate"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Authenticate" component={Authenticate} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="CreateListing" component={CreateListing} />
      <Stack.Screen name="BottomNavOverlay" component={BottomNavOverlay} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
