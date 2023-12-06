/**
 * @namespace ThemeProvider
 * @memberof Visuals
 * @memberof Components.Visuals
 * @description -  File serves as a context provider to manage the theme state throughout the application. It ensures that components have access to the current theme and provides a method to toggle between light and dark themes.
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import * as Settings from '../../hooks/UserSettings';

const ThemeContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);

/**
 * @component
 * @name ThemeProvider
 * @memberof Visuals.ThemeProvider
 * @memberof Components.Visuals.ThemeProvider
 * @param {Object} children - React component(s) that are wrapped by the ThemeProvider.
 * @returns {Object} ThemeContext.Provider
 * @description Provides the theme context to the application in the App.js file.
 */
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light'); // Default theme

  /**
   * @function useEffect
   * @memberof Components.Visuals.ThemeProvider
   * @description React hook that runs once when the component mounts that gets the current theme from the user settings.
   * @returns {Promise} Promise that resolves when the theme is set.
   */
  useEffect(() => {
    Settings.getColorMode().then((mode) => {
      console.log('mode: ' + mode);
      setTheme(mode);
    });
  }, []);

  /**
   * @function toggleTheme
   * @memberof Components.Visuals.ThemeProvider
   * @description Function that toggles the theme between light and dark.
   * @returns {Promise} Promise that resolves when the theme is set.
   */
  const toggleTheme = () => {
    return new Promise((resolve) => {
      setTheme((prevTheme) => {
        const newTheme = prevTheme === 'light' ? 'dark' : 'light';
        Settings.updateColorMode(newTheme);
        return newTheme;
      });
      resolve();
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
