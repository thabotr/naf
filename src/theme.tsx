import AsyncStorage from '@react-native-async-storage/async-storage';

export function getSavedThemeSetting(): Promise<string|null>{
  return AsyncStorage.getItem('@naf_theme_setting');
}

export function saveThemeSetting(themeSetting: 'light' | 'dark' | 'system_default'): Promise<void> {
  return AsyncStorage.setItem('@naf_theme_setting', themeSetting);
}