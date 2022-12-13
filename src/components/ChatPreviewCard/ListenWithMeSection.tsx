import React from 'react';
import {
  TouchableOpacity,
  View,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {IconButton, Paragraph} from 'react-native-paper';
import TrackPlayer, {State as PlayState} from 'react-native-track-player';
import {getAudioMetadata} from '../../audio';

import {useListenWithMe} from '../../context/listenWithMe';
import {useTheme} from '../../shared/providers/theme';
import {Chat} from '../../types/chat';
import {OverlayedView} from '../Helpers/OverlayedView';

function ListenWithMeSection({chat}: {chat: Chat}) {
  const {theme} = useTheme();
  const {listeningWith, currentTrack, playUserTrack, playState} =
    useListenWithMe();

  const styles = StyleSheet.create({
    touchOp: {
      flex: 1,
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
        if (
          listeningWith === chat.user.handle &&
          playState === PlayState.Playing
        ) {
          TrackPlayer.pause().catch(e => console.log(e));
        } else {
          getAudioMetadata(
            `http://10.0.2.2:3000/listenwithme/${chat.user.handle.replace(
              '->',
              '',
            )}/listen1`,
          )
            .then(track => track && playUserTrack(chat.user.handle, track))
            .catch(e => console.log(e));
        }
      }}>
      <IconButton icon="account-music" color={theme.color.textPrimary} />
      <Paragraph
        style={{
          color: theme.color.textPrimary,
          shadowColor: theme.color.textSecondary,
        }}>
        {listeningWith === chat.user.handle ? currentTrack?.title ?? '' : ''}
      </Paragraph>
      <View>
        <IconButton
          icon={
            listeningWith === chat.user.handle &&
            playState === PlayState.Playing
              ? 'pause'
              : 'play'
          }
          color={theme.color.textPrimary}
        />
        <OverlayedView>
          <ActivityIndicator
            size={35}
            animating={
              listeningWith === chat.user.handle &&
              playState === PlayState.Playing
            }
            color={theme.color.secondary}
          />
        </OverlayedView>
      </View>
    </TouchableOpacity>
  );
}

export {ListenWithMeSection};
