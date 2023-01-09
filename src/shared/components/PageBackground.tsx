import React from 'react';
import {StyleSheet} from 'react-native';
import {Surface} from 'react-native-paper';
import {ThemeType, useThemedStyles} from '../providers/theme';

type Props = React.ComponentProps<typeof Surface>;

export default function PageBackground(props: Props): JSX.Element {
  const styles = useThemedStyles(styleSheet);
  return <Surface {...props} style={[styles.background, props.style]} />;
}

const styleSheet = (theme: ThemeType) =>
  StyleSheet.create({
    background: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.color.secondary,
    },
  });
