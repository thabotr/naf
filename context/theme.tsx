import React from 'react';
import {useColorScheme} from 'react-native';

import { ThemeContextType, ThemeType } from "../types/theme";

export const ThemeContext = React.createContext<ThemeContextType|null>(null);

export function ThemeContextProvider({children}:{children: React.ReactNode}){
  const darkTheme: ThemeType = {
    dark: true,
    color: {
      primary:          '#2e2e2e',
      secondary:        '#4f4f4f',
      userPrimary:      '#a473ce',
      userSecondary:    '#a582bc',
      friendPrimary:    '#73aac9',
      friendSecondary:  '#8dbdd9',
    }
  }

  const lightTheme: ThemeType = {
    dark: false,
    color: {
      primary: '#dfdfdf',
      secondary: '#ffffef',
      userPrimary: '#8530d1',
      userSecondary: '#a473ce',
      friendPrimary: '#0fa2f7',
      friendSecondary: '#41b6fa',
    }
  }

  const [theme, setTheme] = React.useState<ThemeType>(useColorScheme() === 'dark' ? darkTheme : lightTheme);

  const toggleDarkTheme = () => {
    if( theme.dark)
      setTheme(lightTheme);
    else
      setTheme(darkTheme);
  }

  return <ThemeContext.Provider value={{theme, toggleDarkTheme}}>
    {children}
  </ThemeContext.Provider>
}