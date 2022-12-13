import React, {createContext, useState, ReactNode, useContext} from 'react';
import {useColorScheme} from 'react-native';
import {validateContext} from '../utils/validateContext';
import {ThemeSetting} from '../../types/settings';

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
  };
};

export type ThemeContextType = {
  theme: ThemeType;
  saveThemeFromSetting: (ts: ThemeSetting) => void;
  themeSetting: ThemeSetting;
};

export const ThemeSettingFromString: {[key: string]: ThemeSetting} = {
  light: 'light',
  dark: 'dark',
  system_default: 'system_default',
};

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
  },
};
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
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function ThemeProvider({children}: {children: ReactNode}) {
  const systemTheme = useColorScheme();
  const isSystemDark = systemTheme === 'dark';
  const themeForSetting = (ts: ThemeSetting) => {
    switch (ts) {
      case 'light':
        return lightTheme;
      case 'dark':
        return darkTheme;
      default:
        return isSystemDark ? darkTheme : lightTheme;
    }
  };
  const [themeSetting, setThemeSetting] =
    useState<ThemeSetting>('system_default');
  const saveThemeFromSetting = (ts: ThemeSetting) => {
    setThemeSetting(ts);
  };

  const providerValue = {
    theme: themeForSetting(themeSetting),
    saveThemeFromSetting: saveThemeFromSetting,
    themeSetting: themeSetting,
  };

  return (
    <ThemeContext.Provider value={providerValue}>
      {children}
    </ThemeContext.Provider>
  );
}

const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  return validateContext(context, 'useTheme', 'ThemeProvider');
};

const useThemedStyles = (styles: (theme: ThemeType) => any) => {
  const {theme} = useTheme();
  return styles(theme);
};

export {useTheme, ThemeProvider, useThemedStyles};
