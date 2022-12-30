import React from 'react';
import {StyleSheet} from 'react-native';
import {List} from 'react-native-paper';
import PageBackground from '../../shared/components/PageBackground';
import {ThemeType, useThemedStyles} from '../../shared/providers/theme';
import ThemePreferences from './ThemePreferences';
import BackToHomeNavigationBar from '../../shared/components/BackToHomeNavigationBar';

type Props = {
  onBackToHome: () => void;
};

export function Preferences({onBackToHome}: Props): JSX.Element {
  const styles = useThemedStyles(styleSheet);
  return (
    <PageBackground accessibilityLabel="preferences page">
      <BackToHomeNavigationBar
        accessibilityLabel="preferences navigation bar"
        onBackToHome={onBackToHome}
      />
      <List.Section accessibilityLabel="theme preferences">
        <List.Subheader style={styles.subHeader}>Theme</List.Subheader>
        <ThemePreferences />
      </List.Section>
    </PageBackground>
  );
}

const styleSheet = (theme: ThemeType) =>
  StyleSheet.create({
    subHeader: {
      color: theme.color.textPrimary,
      textShadowColor: theme.color.textSecondary,
    },
  });
