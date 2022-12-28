import React from 'react';
import {StyleSheet} from 'react-native';
import {IconButton} from 'react-native-paper';
import {useTheme, useThemedStyles} from '../providers/theme';
import globalStyles from '../styles';

export default function (props: React.ComponentProps<typeof IconButton>) {
  const {theme} = useTheme();
  const styles = useThemedStyles(styleSheet);
  return (
    <IconButton
      color={theme.color.textPrimary}
      {...props}
      style={[globalStyles.square, styles.bg, props.style]}
    />
  );
}
const styleSheet = (theme: any) =>
  StyleSheet.create({
    bg: {
      backgroundColor: theme.color.primary,
    },
  });
