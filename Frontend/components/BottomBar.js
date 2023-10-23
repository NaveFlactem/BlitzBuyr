import React from 'react';
import { BottomTabNavigator } from '@react-navigation/bottom-tabs';
import StackNavigator from '../StackNavigator';
import HomeScreen from '../screens/HomeScreen';

const BottomBar = () => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const screens = [
    {
      name: 'Profile',
      icon: 'user',
      component: ProfileScreen,
    },
    {
      name: 'Home',
      icon: 'home',
      component: HomeScreen,
    },
    {
      name: 'Listing',
      icon: 'list',
      component: Profile,
    },
  ];

  const renderTabBarItem = ({ route }) => {
    const { name, icon } = route;
    const isActive = selectedIndex === route.key;

    return (
      <TabBarItem
        key={route.key}
        title={name}
        icon={icon}
        isActive={isActive}
        onPress={() => setSelectedIndex(route.key)}
      />
    );
  };

  return (
    <BottomTabNavigator
      tabBarOptions={{
        renderTabBarItem,
      }}
    >
      {screens.map((screen) => (
        <BottomTabNavigator.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
        />
      ))}
    </BottomTabNavigator>
  );
};

export default BottomBar;