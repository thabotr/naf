import React from 'react';
import {View} from 'react-native';
import {ToggleButton, List} from 'react-native-paper';
import {useColorScheme} from 'react-native';

import { ThemeContext, ThemeContextType } from '../context/theme';

function ThemeController(){
  const [setting, setSetting] = React.useState("system_default");
  const {setDarkTheme, setLightTheme} = React.useContext(ThemeContext) as ThemeContextType;
  return <ToggleButton.Row
      value={setting}
      onValueChange={ value => {
        setSetting(value);
        switch(value){
          case "light":
            setLightTheme();
            return;
          case "dark" :
            setDarkTheme();
            return;
          default:
            if( useColorScheme() === "dark"){
              setDarkTheme();
            }else
              setLightTheme();
        }
      }}
    >
    <ToggleButton icon='lightbulb-off' value="dark"/>
    <ToggleButton icon='lightbulb-on' value="light"/>
    <ToggleButton icon='home-lightbulb' value="system_default"/>
  </ToggleButton.Row>
}

export function Settings(){
  const {theme} = React.useContext(ThemeContext) as ThemeContextType;
  return <View style={{width: '100%', height: '100%', backgroundColor: theme.color.secondary}}>
    <List.Section>
      <List.Subheader>Theme</List.Subheader>
      <ThemeController/>
    </List.Section>
  </View>
}