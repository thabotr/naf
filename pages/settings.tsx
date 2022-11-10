import React from 'react';
import { View} from 'react-native';
import {ToggleButton, List} from 'react-native-paper';

import {useTheme} from '../context/theme';

function ThemeController(){
  const {theme, saveThemeSetting, themeSetting} = useTheme();

  const saveSetting = (s: string)=>{
    switch(s){
      case 'light':
        saveThemeSetting('light');
        return;
      case 'dark':
        saveThemeSetting('dark');
        return;
      default:
        saveThemeSetting('system_default');
    }
  }

  function ThemedToggleButton({ts}:{ts:'light' | 'dark' | 'system_default'}){
    const bgColor = ts === themeSetting ? theme.color.primary : undefined
    const acLabels:{[key: string]:string} = {'light': 'set light theme', 'dark' : 'set dark theme', 'system_default' : 'use system theme'};
    const icons:{[key: string]:string} = {'light': 'lightbulb-on', 'dark' : 'lightbulb-off', 'system_default': 'home-lightbulb'};

    return <ToggleButton
      color={theme.color.textPrimary}
      style={{backgroundColor: bgColor, borderWidth: 1, borderRadius: 0}}
      accessibilityLabel={acLabels[ts]}
      icon={icons[ts]}
      value={ts}
    />
  }

  return <ToggleButton.Row
      value={themeSetting}
      onValueChange={ value=>saveSetting(value)}
    >
      <ThemedToggleButton ts="light"/>
      <ThemedToggleButton ts="dark"/>
      <ThemedToggleButton ts="system_default"/>
  </ToggleButton.Row>
}

export function Settings(){
  const {theme} = useTheme();
  return <View style={{width: '100%', height: '100%', backgroundColor: theme.color.secondary}}>
    <List.Section>
      <List.Subheader style={{ color: theme.color.textPrimary, textShadowColor: theme.color.textSecondary}}>Theme</List.Subheader>
      <ThemeController/>
    </List.Section>
  </View>
}