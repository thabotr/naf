import React from 'react';
import {View} from 'react-native';
import {IconButton, List} from 'react-native-paper';
import {HorizontalView} from '../components/HorizontalView';

import {useTheme} from '../context/theme';
import {ThemeSetting} from '../types/settings';

function ThemeController() {
  const {theme, saveThemeFromSetting, themeSetting} = useTheme();

  function ThemedToggleButton({ts}: {ts: ThemeSetting}) {
    const bgColor = ts === themeSetting ? theme.color.primary : undefined;
    const acLabels: {[key: string]: string} = {
      light: 'set light theme',
      dark: 'set dark theme',
      system_default: 'use system theme',
    };
    const icons: {[key: string]: string} = {
      light: 'lightbulb-on',
      dark: 'lightbulb-off',
      system_default: 'home-lightbulb',
    };

    return (
      <IconButton
        color={theme.color.textPrimary}
        style={{
          backgroundColor: bgColor,
          borderWidth: 1,
          borderRadius: 0,
          margin: 1,
          width: '33%',
        }}
        accessibilityLabel={acLabels[ts]}
        icon={icons[ts]}
        onPress={() => saveThemeFromSetting(ts)}
      />
    );
  }

  return (
    <HorizontalView>
      <ThemedToggleButton ts="light" />
      <ThemedToggleButton ts="dark" />
      <ThemedToggleButton ts="system_default" />
    </HorizontalView>
  );
}

export function Settings() {
  const {theme} = useTheme();
  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: theme.color.secondary,
      }}>
      <List.Section>
        <List.Subheader
          style={{
            color: theme.color.textPrimary,
            textShadowColor: theme.color.textSecondary,
          }}>
          Theme
        </List.Subheader>
        <ThemeController />
      </List.Section>
    </View>
  );
}
