/**
 * @namespace BottomNavOverlay
 */
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

/**
 * @constant TabArr - Array of objects representing the tabs in the bottom navigation bar
 * @memberof BottomNavOverlay
 */
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

/**
 * @constant Tab - Bottom tab navigator
 * @memberof BottomNavOverlay
 */
const Tab = createBottomTabNavigator();

/**
 * @function TabButton
 * @memberof BottomNavOverlay
 * @param {Object} props - React props object
 * @param {Object} props.item - Object representing the tab
 * @param {Function} props.onPress - Function to handle the press event
 * @param {Object} props.accessibilityState - Object representing the accessibility state
 * @param {Object} props.styles - Object representing the styles for the tab button received from the parent component
 * @description - TabButton is a memoized component that represents a single tab in the bottom navigation bar
 * @returns {JSX.Element} TabButton component
 */
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

  /**
   * will run the animation when the icons are pressed on the bottom nav bar
   */
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

/**
 * @function BottomNavOverlay
 * @memberof BottomNavOverlay
 * @description - BottomNavOverlay is a memoized component that represents the bottom navigation bar that overlays the main screen
 * @returns {JSX.Element} BottomNavOverlay component
 */
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
