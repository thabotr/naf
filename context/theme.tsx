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
  setDarkTheme: ()=>void;
  setLightTheme: ()=>void;
};

export const ThemeContext = React.createContext<ThemeContextType|null>(null);

export function ThemeContextProvider({children}:{children: React.ReactNode}){
  const darkTheme: ThemeType = {
    dark: true,
    color: {
      primary: '#1d2126',
      secondary: '#363636',
      userPrimary: '#404040',
      userSecondary: '#5c5c5c',
      friendPrimary: '#2a4365',
      friendSecondary: '#18474e',
    }
  }

  const lightTheme: ThemeType = {
    dark: false,
    color: {
      primary: '#87cefa',
      secondary: '#dbdbdb',
      userPrimary: '#c0c0c0',
      userSecondary: '#f5f5f5',
      friendPrimary: '#b0c4de',
      friendSecondary: '#b0e0e6',
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

  const setDarkTheme = ()=> setTheme(darkTheme);
  const setLightTheme = ()=> setTheme(lightTheme);

  return <ThemeContext.Provider
    value={{
      theme:theme,
      setDarkTheme: setDarkTheme,
      setLightTheme: setLightTheme,
      toggleDarkTheme:toggleDarkTheme,
      saveFabOpacity: saveFabOpacity,
      fabOpacity: fabOpacity,
      }}>
    {children}
  </ThemeContext.Provider>
}