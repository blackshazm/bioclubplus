import React, { createContext, useContext } from 'react';
import { THEME } from '../constants';

const ThemeContext = createContext(THEME);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeContext.Provider value={THEME}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
