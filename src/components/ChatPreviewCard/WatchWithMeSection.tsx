import React from 'react';
import {StyleSheet, TouchableOpacity, ToastAndroid} from 'react-native';
import {IconButton} from 'react-native-paper';

import {useTheme} from '../../shared/providers/theme';
import {Chat} from '../../types/chat';

function WatchWithMeSection({chat}: {chat: Chat}) {
  const {theme} = useTheme();
  const styles = StyleSheet.create({
    touchOp: {
      width: '15%',
      height: '100%',
      backgroundColor: theme.color.secondary,
      opacity: 0.5,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
  return (
    <TouchableOpacity
      style={styles.touchOp}
      onPress={() => {
        ToastAndroid.show(
          `Coming soon\nsee what movies and TV shows\n${chat.user.handle} is watching`,
          3000,
        );
      }}>
      <IconButton icon="movie" color={theme.color.textPrimary} />
    </TouchableOpacity>
  );
}

export {WatchWithMeSection};
