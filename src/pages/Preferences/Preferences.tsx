import React from 'react';
import {StyleSheet} from 'react-native';
import {IconButton, List, Surface} from 'react-native-paper';
import PageBackground from '../../shared/components/PageBackground';
import {useThemedStyles} from '../../shared/providers/theme';
import ThemePreferences from './ThemePreferences';
import globalStyles, {globalThemedStyles} from '../../shared/styles';

type Props = {
  onBackToHome: () => void;
};

export function Preferences({onBackToHome}: Props) {
  const styles = useThemedStyles(styleSheet);
  const themedStyle = useThemedStyles(globalThemedStyles);
  return (
    <PageBackground pageLabel="preferences page">
      <Surface
        accessibilityLabel="preferences navigation bar"
        style={themedStyle.navbar}>
        <IconButton
          icon="arrow-left"
          accessibilityLabel="back to home"
          onPress={onBackToHome}
          style={globalStyles.square}
        />
      </Surface>
      <List.Section accessibilityLabel="theme preferences">
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
