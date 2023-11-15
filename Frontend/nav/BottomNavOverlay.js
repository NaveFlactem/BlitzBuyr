import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect, useRef, memo } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Vie,
  Dimensions,
  Platform,
} from "react-native";
import Icon, { Icons } from "../components/Icons";
import Colors from "../constants/Colors";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import CreateListing from "../screens/CreateListing";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import useBackButtonHandler from "../hooks/DisableBackButton";

const TabArr = [
  {
    route: "Home",
    label: "Home",
    type: Icons.Ionicons,
    activeIcon: "grid",
    inActiveIcon: "grid-outline",
    component: HomeScreen,
  },
  {
    route: "CreateListing",
    label: "Create Listing",
    type: Icons.MaterialCommunityIcons,
    activeIcon: "plus-box-multiple",
    inActiveIcon: "plus-box-multiple-outline",
    component: CreateListing,
  },
  {
    route: "Account",
    label: "Account",
    type: Icons.FontAwesome,
    activeIcon: "user-circle",
    inActiveIcon: "user-circle-o",
    component: ProfileScreen,
  },
];

const Tab = createBottomTabNavigator();

const TabButton = memo((props) => {
  const { item, onPress, accessibilityState } = props;
  const focused = accessibilityState.selected;
  const scale = useSharedValue(focused ? 1.5 : 1);
  const rotate = useSharedValue(focused ? "360deg" : "0deg");

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }, { rotate: rotate.value }],
    };
  });

  useEffect(() => {
    scale.value = withSpring(focused ? 1.5 : 1);
    rotate.value = withTiming(focused ? "360deg" : "0deg", { duration: 500 });
  }, [focused, scale, rotate]);

  const onBackPress = () => {
    return true;
  };

  useBackButtonHandler(onBackPress);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={styles.tabButtonContainer}
    >
      <Animated.View style={[styles.tabButton, animatedStyle]}>
        <Icon
          type={item.type}
          name={focused ? item.activeIcon : item.inActiveIcon}
          color={focused ? Colors.BB_darkOrange : Colors.gray}
          size={20}
        />
      </Animated.View>
    </TouchableOpacity>
  );
});

function BottomNavOverlay() {
  const screenHeight = Dimensions.get("window").height;

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: screenHeight * 0.08,
          backgroundColor: Colors.BB_pink,
          borderTopWidth: 0,
          elevation: 0,
        },
      }}
    >
      {TabArr.map((item, index) => {
        return (
          <Tab.Screen
            key={index}
            name={item.route}
            component={item.component}
            options={{
              tabBarShowLabel: false,
              tabBarButton: (props) => <TabButton {...props} item={item} />,
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabButtonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.BB_darkRedPurple,
    borderTopWidth: 3,
    borderColor:
      Platform.OS == "ios" ? "rgba(0, 0, 0, 0.2)" : "rgba(0, 0, 0, 0.3)",
    height: Platform.OS === "ios" ? "200%" : null,
  },
  tabButton: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
    bottom: Platform.OS === "ios" ? "25%" : null,
  },
});

export default memo(BottomNavOverlay);
