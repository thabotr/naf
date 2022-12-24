import React, {ReactNode} from 'react';
import {StyleSheet} from 'react-native';
import {Surface} from 'react-native-paper';
import {useThemedStyles} from '../providers/theme';

type Props = {
  children?: ReactNode;
  pageLabel?: string;
  style?: any;
};

export default function PageBackground({children, pageLabel, style}: Props) {
  const styles = useThemedStyles(styleSheet);
  return (
    <Surface accessibilityLabel={pageLabel} style={[styles.background, style]}>
      {children}
    </Surface>
  );
}

const styleSheet = (theme: any) =>
  StyleSheet.create({
    background: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.color.secondary,
    },
  });
