import React, { createContext, useState, useContext, useEffect } from 'react';
import * as Settings from "../../hooks/UserSettings";

const ThemeContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light'); // Default theme

    useEffect(() => {
    Settings.getColorMode().then((mode) => {
      console.log("mode: " + mode);  
      setTheme(mode);
        });
    }

    , []);

  const toggleTheme = () => {
    console.log("toggleTheme");
    setTheme(theme === 'light' ? 'dark' : 'light');
    Settings.updateColorMode(theme === 'light' ? 'dark' : 'light');
    console.log(theme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};