import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './nav/StackNavigator';
import { CustomDarkTheme, CustomLightTheme } from './constants/Colors';
import { LogBox } from 'react-native';
import {
  ThemeProvider,
  useThemeContext,
} from './components/visuals/ThemeProvider';
import { assetPreLoader } from './components/AssetPreLoader';


const AppContainer = () => {
  console.disableYellowBox=true;
  LogBox.ignoreLogs(['Warning: ...']); //Hide warnings
  LogBox.ignoreLogs([' WARN ...']); //Hide warnings
  LogBox.ignoreAllLogs();//Hide all warning notifications on front-end
  const { theme } = useThemeContext();
  assetPreLoader();

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
