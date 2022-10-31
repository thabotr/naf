import React from 'react';
import {useColorScheme} from 'react-native';

export type ThemeType = {
  dark: boolean;
  color: {
    primary: string;
    secondary: string;
    userPrimary: string;
    friendPrimary: string;
    userSecondary: string;
    friendSecondary: string;
  }
};

export type ThemeContextType = {
  fabOpacity: number;
  saveFabOpacity: (v: number)=> void;
  theme: ThemeType;
  toggleDarkTheme: ()=>void;
};

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
  const [fabOpacity, setFabOpacity] = React.useState(1);

  const saveFabOpacity = (v: number) => setFabOpacity(v);

  const toggleDarkTheme = () => {
    if( theme.dark)
      setTheme(lightTheme);
    else
      setTheme(darkTheme);
  }

  return <ThemeContext.Provider
    value={{
      theme:theme,
      toggleDarkTheme:toggleDarkTheme,
      saveFabOpacity: saveFabOpacity,
      fabOpacity: fabOpacity,
      }}>
    {children}
  </ThemeContext.Provider>
}