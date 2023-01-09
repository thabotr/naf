import React from 'react';
import {StyleSheet} from 'react-native';
import {IconButton} from 'react-native-paper';
import {ThemeType, useTheme, useThemedStyles} from '../providers/theme';
import globalStyles from '../styles';

type IconButtonProps = React.ComponentProps<typeof IconButton>;

export default function (props: IconButtonProps): JSX.Element {
  const {theme} = useTheme();
  const styles = useThemedStyles(styleSheet);
  return (
    <IconButton
      {...props}
      color={theme.color.textPrimary}
      style={[globalStyles.square, styles.bg, props.style]}
    />
  );
}
const styleSheet = (theme: ThemeType) =>
  StyleSheet.create({
    bg: {
      backgroundColor: theme.color.primary,
    },
  });
