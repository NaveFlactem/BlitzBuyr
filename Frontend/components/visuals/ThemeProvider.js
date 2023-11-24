import React, { createContext, useState, useContext } from 'react';
import * as Settings from "../../hooks/UserSettings";

const ThemeContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light'); // Default theme

    useEffect(() => {
    Settings.getColorMode().then((mode) => {
        setTheme(mode);
        });
    }
    , []);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    Settings.updateColorMode(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};