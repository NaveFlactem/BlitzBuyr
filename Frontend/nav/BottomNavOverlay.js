import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { memo, useEffect } from 'react';
import {
  Dimensions,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Icon, { Icons } from '../components/visuals/Icons';
import Colors from '../constants/Colors';
import { screenHeight } from '../constants/ScreenDimensions.js';
import useBackButtonHandler from '../hooks/DisableBackButton';
import CreateListing from '../screens/CreateListing';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { useThemeContext } from '../components/visuals/ThemeProvider';
import { getThemedStyles } from '../constants/Styles';

const TabArr = [
  {
    route: 'Home',
    label: 'Home',
    type: Icons.Ionicons,
    activeIcon: 'grid',
    inActiveIcon: 'grid-outline',
    component: HomeScreen,
  },
  {
    route: 'CreateListing',
    label: 'Create Listing',
    type: Icons.MaterialCommunityIcons,
    activeIcon: 'plus-box-multiple',
    inActiveIcon: 'plus-box-multiple-outline',
    component: CreateListing,
  },
  {
    route: 'Account',
    label: 'Account',
    type: Icons.FontAwesome,
    activeIcon: 'user-circle',
    inActiveIcon: 'user-circle-o',
    component: ProfileScreen,
  },
];

const Tab = createBottomTabNavigator();

const TabButton = memo((props) => {
  const { item, onPress, accessibilityState, styles } = props;
  const focused = accessibilityState.selected;
  const { theme } = useThemeContext();

  // Local shared values for scale and rotate
  const scale = useSharedValue(1);
  const rotate = useSharedValue('0deg');

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }, { rotate: rotate.value }],
    };
  });

  useEffect(() => {
    // Animations are triggered based on the focused state of this specific TabButton
    scale.value = withSpring(focused ? 1.5 : 1);
    rotate.value = withTiming(focused ? '360deg' : '0deg', { duration: 500 });
  }, [focused]);

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
          color={
            focused
              ? theme === 'dark'
                ? Colors.BB_violet
                : Colors.BB_darkOrange
              : Colors.BB_bone
          }
          size={20}
        />
      </Animated.View>

      {theme === 'light' && <View style={styles.outerRhombus} />}
      {theme === 'light' && <View style={styles.innerRhombus} />}
    </TouchableOpacity>
  );
});

function BottomNavOverlay() {
  const styles = getThemedStyles(useThemeContext().theme).BottomNavOverlay;

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
              tabBarButton: (props) => (
                <TabButton {...props} item={item} styles={styles} />
              ),
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
}

export default memo(BottomNavOverlay);
