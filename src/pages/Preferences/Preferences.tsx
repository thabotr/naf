import React from 'react';
import {StyleSheet} from 'react-native';
import {List} from 'react-native-paper';
import PageBackground from '../../shared/components/PageBackground';
import {useThemedStyles} from '../../shared/providers/theme';
import ThemePreferences from './ThemePreferences';

export function Preferences() {
  const styles = useThemedStyles(styleSheet);
  return (
    <PageBackground pageLabel="preferences page">
      <List.Section>
        <List.Subheader style={styles.subHeader}>Theme</List.Subheader>
        <ThemePreferences />
      </List.Section>
    </PageBackground>
  );
}

const styleSheet = (theme: any) =>
  StyleSheet.create({
    subHeader: {
      color: theme.color.textPrimary,
      textShadowColor: theme.color.textSecondary,
    },
  });
