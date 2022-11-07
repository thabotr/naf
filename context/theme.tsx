import React from 'react';
import {useColorScheme} from 'react-native';
import { getSavedThemeSetting, saveThemeSetting as storageSaveThemeSetting } from '../src/theme';

export type ThemeType = {
  dark: boolean;
  color: {
    primary: string;
    secondary: string;
    userPrimary: string;
    friendPrimary: string;
    userSecondary: string;
    friendSecondary: string;
    textPrimary: string;
    textSecondary: string;
  }
};

export type ThemeContextType = {
  theme: ThemeType;
  themeSetting: 'light' | 'dark' | 'system_default';
  saveThemeSetting: (ts: 'light' | 'dark' | 'system_default')=>void;
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
      textPrimary: '#f8f8ff',
      textSecondary: '#dcdcdc',
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
      textPrimary: '#000000',
      textSecondary: '#a9a9a9',
    }
  }

  const systemThemeIsDark = useColorScheme() === 'dark';

  const [theme, setTheme] = React.useState<ThemeType>(darkTheme);

  const [themeSetting, setThemeSetting] = React.useState<'light' | 'dark' | 'system_default'>('system_default');

  React.useEffect(()=>{
    getSavedThemeSetting().then(s => {
      switch(s){
        case 'light':
          setTheme(lightTheme);
          setThemeSetting('light');
          return;
        case 'dark':
          setTheme(darkTheme);
          setThemeSetting('dark');
          return;
        default:
          if(systemThemeIsDark) setTheme(darkTheme);
          else setTheme(lightTheme);
          setThemeSetting('system_default');
      }
    })
  },[]);

  const saveThemeSetting = ( ts: 'light' | 'dark' | 'system_default')=> {
    switch(ts){
      case 'light':
        setTheme(lightTheme);
        break;
      case 'dark':
        setTheme(darkTheme);
        break;
      default:
        if(systemThemeIsDark) setTheme(darkTheme);
        setTheme(lightTheme);
    }
    setThemeSetting(ts);
    storageSaveThemeSetting(ts).catch(e=>console.error(e));
  }

  return <ThemeContext.Provider
    value={{
      theme:theme,
      saveThemeSetting: saveThemeSetting,
      themeSetting: themeSetting,
      }}>
    {children}
  </ThemeContext.Provider>
}