import React from 'react';
import {StyleSheet} from 'react-native';
import {FAB} from 'react-native-paper';
import {useTheme} from '../../shared/providers/theme';

function ComposeFAB({
  onLongPress,
  onPress,
}: {
  onLongPress: () => void;
  onPress: () => void;
}) {
  const {theme} = useTheme();
  const styles = StyleSheet.create({
    fab: {
      margin: 3,
      borderRadius: 0,
      backgroundColor: theme.color.userSecondary,
    },
  });
  return (
    <FAB
      style={styles.fab}
      icon="pencil"
      onLongPress={onLongPress}
      onPress={onPress}
    />
  );
}

export {ComposeFAB};
