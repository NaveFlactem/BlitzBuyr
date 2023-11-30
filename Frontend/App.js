import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './nav/StackNavigator';
import { CustomDarkTheme, CustomLightTheme } from './constants/Colors';
import {
  ThemeProvider,
  useThemeContext,
} from './components/visuals/ThemeProvider';
import { StatusBar } from 'react-native';

const AppContainer = () => {
  const { theme } = useThemeContext();
  StatusBar.setBarStyle(theme === 'dark' ? 'dark-content' : 'light-content');

  return (
    <NavigationContainer
      theme={theme === 'dark' ? CustomDarkTheme : CustomLightTheme}
    >
      <StackNavigator />
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AppContainer />
    </ThemeProvider>
  );
}
