import React, {ReactNode} from 'react';
import {StyleSheet} from 'react-native';
import {Surface} from 'react-native-paper';
import {useThemedStyles} from '../providers/theme';

type Props = {
  children: ReactNode;
  pageLabel?: string;
};

export default function PageBackground({children, pageLabel}: Props) {
  const styles = useThemedStyles(styleSheet);
  return (
    <Surface accessibilityLabel={pageLabel} style={styles.background}>
      {children}
    </Surface>
  );
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
