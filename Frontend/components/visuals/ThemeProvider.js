
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
 * @param {Object} props
 * @param {Object} props.children
 * @returns {Object} ThemeContext.Provider
 * @description Provides the theme context to the application
 */
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light'); // Default theme

  useEffect(() => {
    Settings.getColorMode().then((mode) => {
      console.log('mode: ' + mode);
      setTheme(mode);
    });
  }, []);

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
