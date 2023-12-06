/**
 * @namespace Colors
 * @description - Colors is a file that contains the colors used in the app
 */

import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { Platform } from 'react-native';

/**
 * @constant {Object} Colors
 * @memberof Colors
 * @description - Object containing the colors used in the app for general use
 */
export default {
  primary: '#637aff',
  primaryDark: '#2759ff',
  primaryLite: '#637aff99',
  black: '#000',
  white: 'white',
  accent: '#112233',
  green: '#60c5a8',
  green2: '#039a83',
  light: '#EEEEEE',
  dark: '#333',
  gray: '#CCCCCC',
  red: '#ff2f68',
  lightRed: '#ff4f7e',
  darkRed: '#d9365e',
  purple: '#8f06e4',
  skyBlue: 'skyblue',
  yellow: '#f8c907',
  pink: '#ff4c98',
  gold: 'gold',
  line: '#282C35',
  gray: '#CCCCCC',
  darkGray: '#999999',

  BB_pink: '#f26a7c',
  BB_darkPink: '#f04890',
  BB_darkOrange: '#f5896b',
  BB_orange: '#f6a05d',
  BB_rangeYellow: '#f8b254',
  BB_yellow: '#f9c34a',
  BB_violet: '#a56fbf',
  BB_darkRedPurple: Platform.OS == 'ios' ? '#58293F' : '#402030',
  BB_darkerRedPurple: Platform.OS == 'ios' ? '#402030' : '#301520',
  BB_bone: '#F5F5F5',
  BB_red: '#CC3514',
};

/**
 * @constant {Object} CustomLightTheme
 * @memberof Colors
 * @description - Object containing the colors used in the app for the light theme
 */
export const CustomLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#637aff',
    background: 'white',
    card: '#EEEEEE',
    text: 'black',
    primaryDark: '#2759ff',
    primaryLite: '#637aff99',
    black: '#000',
    white: 'white',
    accent: '#112233',
    green: '#60c5a8',
    green2: '#039a83',
    dark: '#333',
    red: '#ff2f68',
    lightRed: '#ff4f7e',
    darkRed: '#d9365e',
    purple: '#8f06e4',
    skyBlue: 'skyblue',
    yellow: '#f8c907',
    pink: '#ff4c98',
    gold: 'gold',
    line: '#282C35',
    gray: '#CCCCCC',
    darkGray: '#999999',
    errorText: '#ff2f68',

    BB_pink: '#f26a7c',
    BB_darkPink: '#f04890',
    BB_darkOrange: '#f5896b',
    BB_orange: '#f6a05d',
    BB_rangeYellow: '#f8b254',
    BB_yellow: '#f9c34a',
    BB_darkRedPurple: Platform.OS == 'ios' ? '#58293F' : '#402030',
    BB_darkerRedPurple: Platform.OS == 'ios' ? '#402030' : '#301520',
    BB_bone: '#F5F5F5',
    BB_red: '#CC3514',
  },
};

/**
 * @constant {Object} CustomDarkTheme
 * @memberof Colors
 * @description - Object containing the colors used in the app for the dark theme
 */
export const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#637aff',
    background: '#181818',
    card: '#1E1E1E',
    text: '#323232',
    white: 'white',
    black: 'white',
    BB_bone: '#121212',
    BB_darkRedPurple: '#2d2d30',
    BB_darkerRedPurple: '#2B1E35',
    BB_orange: '#F5F5F5',
    BB_darkOrange: '#F5F5F5',
    BB_pink: '#301520',
    BB_darkPink: '#a56fbf',
    BB_yellow: '#C1A546',
    BB_rangeYellow: '#B89B4C',
  },
};
