import React from 'react';
import {StyleSheet} from 'react-native';
import {Badge} from 'react-native-paper';
import {useTheme} from '../../context/theme';
import {OnlyShow} from '../Helpers/OnlyShow';

function UnreadMessageCountBadge({count}: {count: number}) {
  const {theme} = useTheme();
  const styles = StyleSheet.create({
    badge: {
      position: 'absolute',
      bottom: -1,
      right: -1,
      borderRadius: 0,
      backgroundColor: theme.color.friendSecondary,
      borderWidth: 1,
      borderColor: theme.color.friendPrimary,
      borderStyle: 'solid',
    },
  });
  return (
    <OnlyShow If={!!count}>
      <Badge style={styles.badge} size={33}>
        {count}
      </Badge>
    </OnlyShow>
  );
}

export {UnreadMessageCountBadge};
