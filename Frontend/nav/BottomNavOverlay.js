import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect, useRef, memo } from "react";
import { StyleSheet, Text, TouchableOpacity, Vie, Dimensions } from "react-native";
import Icon, { Icons } from "../components/Icons";
import Colors from "../constants/Colors";
import * as Animatable from "react-native-animatable";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import CreateListing from "../screens/CreateListing";
import { Asset } from "expo-asset";

const assetsToPreload = [
  require("../assets/blitzbuyr_name_logo.png"),
  require("../assets/blitzbuyr_name_logo.png"),
  require("../assets/blitzbuyr_name_transparent_horizontal.png"),
  require("../assets/blitzbuyr_name_transparent.png"),
  require("../assets/blitzbuyr_name.png"),
  require("../assets/icon_background_transparent_upright.png"),
  require("../assets/icon_background_transparent.png"),
  require("../assets/icon_transparent_background_filled_upright.png"),
  require("../assets/icon_transparent_background_filled.png"),
  require("../assets/icon_transparent.png"),
  require("../assets/icon.png"),
  require("../assets/no_wifi_icon_transparent.png"),
];

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

const TabButton = (props) => {
  const { item, onPress, accessibilityState } = props;
  const focused = accessibilityState.selected;
  const viewRef = useRef(null);

  useEffect(() => {
    if (focused) {
      viewRef.current.animate({
        0: { scale: 0.5, rotate: "0deg" },
        1: { scale: 1.5, rotate: "360deg" },
      });
    } else {
      viewRef.current.animate({
        0: { scale: 1.5, rotate: "360deg" },
        1: { scale: 1, rotate: "0deg" },
      });
    }
  }, [focused]);

  useEffect(() => {
    // Load and cache the assets when the component mounts
    async function loadAssetsAsync() {
      const assetPromises = assetsToPreload.map((asset) =>
        Asset.fromModule(asset).downloadAsync()
      );
      await Promise.all(assetPromises);
    }

    loadAssetsAsync();
  }, []);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={styles.tabButtonContainer}
    >
      <Animatable.View ref={viewRef} duration={500} style={styles.tabButton}>
        <Icon
          type={item.type}
          name={focused ? item.activeIcon : item.inActiveIcon}
          color={focused ? Colors.primary : Colors.gray}
          size={25}
        />
      </Animatable.View>
    </TouchableOpacity>
  );
};

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
          elevation: 0
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
    height: Platform.OS === 'ios' ? "200%" : null,
  },
  tabButton: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
});

export default memo(BottomNavOverlay);