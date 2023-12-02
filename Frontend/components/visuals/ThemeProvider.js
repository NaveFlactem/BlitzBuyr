import React, { createContext, useState, useContext, useEffect } from 'react';
import * as Settings from '../../hooks/UserSettings';

const ThemeContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);

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
