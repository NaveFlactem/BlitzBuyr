import React, { useEffect } from "react";
import { useColorScheme } from 'react-native';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import StackNavigator from "./nav/StackNavigator";
import { CustomDarkTheme, CustomLightTheme } from "./constants/Colors";
import { ThemeProvider, useThemeContext } from "./components/visuals/ThemeProvider";

export default function App() {
  const { theme } = useThemeContext();

  return (
    <ThemeProvider>
    <NavigationContainer theme={scheme === 'dark' ? CustomDarkTheme : CustomLightTheme}>
      <StackNavigator />
    </NavigationContainer>
    </ThemeProvider>
  );
}
