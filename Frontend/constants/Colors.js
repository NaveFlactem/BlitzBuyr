import { Platform } from "react-native";
import * as Settings from "../hooks/UserSettings";

export default {
  primary: "#637aff",
  primaryDark: "#2759ff",
  primaryLite: "#637aff99",
  black: "#000",
  white: "white",
  accent: "#112233",
  green: "#60c5a8",
  green2: "#039a83",
  light: "#EEEEEE",
  dark: "#333",
  gray: "#CCCCCC",
  red: "#ff2f68",
  lightRed: "#ff4f7e",
  darkRed: "#d9365e",
  purple: "#8f06e4",
  skyBlue: "skyblue",
  yellow: "#f8c907",
  pink: "#ff4c98",
  gold: "gold",
  line: "#282C35",
  gray: "#CCCCCC",
  darkGray: "#999999",

  BB_pink: "#f26a7c",
  BB_darkPink: "#f04890",
  BB_darkOrange: "#f5896b",
  BB_orange: "#f6a05d",
  BB_rangeYellow: "#f8b254",
  BB_yellow: "#f9c34a",
  BB_darkRedPurple: Platform.OS == "ios" ? "#58293F" : "#402030",
  BB_darkerRedPurple: Platform.OS == "ios" ? "#402030" : "#301520",
  BB_bone: "#F5F5F5",
  BB_red: "#CC3514",
};

export const themes = {
  light: {},

  dark: {},
};

export const getCurrentThemeColors = async () => {
  const currentTheme = await Settings.getColorMode();
  return themes[currentTheme] || themes.light; // Default to light theme if undefined
};
