import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from "./nav/StackNavigator";
import { CustomDarkTheme, CustomLightTheme } from "./constants/Colors";
import { ThemeProvider, useThemeContext } from "./components/visuals/ThemeProvider";

const AppContainer = () => {
  const { theme } = useThemeContext();

  return (
    <NavigationContainer theme={theme === 'dark' ? CustomDarkTheme : CustomLightTheme}>
      <StackNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContainer />
    </ThemeProvider>
  );
}