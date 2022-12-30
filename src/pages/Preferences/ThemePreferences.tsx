import React, {StyleSheet, ViewProps} from 'react-native';
import {IconButton} from 'react-native-paper';
import HorizontalView from '../../shared/components/HorizontalView';
import {useTheme} from '../../shared/providers/theme';
import {ThemeSetting} from '../../types/settings';

export default function ThemePreferences(props: ViewProps): JSX.Element {
  return (
    <HorizontalView {...props}>
      <ThemedToggleButton ts="light" />
      <ThemedToggleButton ts="dark" />
      <ThemedToggleButton ts="system_default" />
    </HorizontalView>
  );
}

function ThemedToggleButton({ts}: {ts: ThemeSetting}) {
  const {theme, saveThemeFromSetting, themeSetting} = useTheme();
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

  const bgColor = ts === themeSetting ? theme.color.primary : undefined;
  const styles = StyleSheet.create({
    button: {
      backgroundColor: bgColor,
      borderWidth: 1,
      borderRadius: 0,
      margin: 1,
      width: '33%',
    },
  });

  return (
    <IconButton
      color={theme.color.textPrimary}
      style={styles.button}
      accessibilityLabel={acLabels[ts]}
      icon={icons[ts]}
      onPress={() => saveThemeFromSetting(ts)}
    />
  );
}
