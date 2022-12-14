import React, {ReactNode} from 'react';
import {StyleSheet} from 'react-native';
import {Surface} from 'react-native-paper';
import {useThemedStyles} from '../providers/theme';

type Props = {
  children: ReactNode;
};

export default function PageBackground({children}: Props) {
  const styles = useThemedStyles(styleSheet);
  return <Surface style={styles.background}>{children}</Surface>;
}

const styleSheet = (theme: any) =>
  StyleSheet.create({
    background: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      backgroundColor: theme.color.secondary,
    },
  });
