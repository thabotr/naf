import React from 'react';
import { TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { IconButton, Paragraph } from 'react-native-paper';
import TrackPlayer, {State as PlayState} from 'react-native-track-player';
import { getAudioMetadata } from '../../audio';

import { ListenWithMeContext, ListenWithMeContextType } from "../../context/listenWithMe";
import { useTheme } from "../../context/theme";
import { Chat } from "../../types/chat";
import { OverlayedView } from '../Helpers/OverlayedView';

function ListenWithMeSection({chat}:{chat: Chat}) {
  const {theme} = useTheme();
  const {listeningWith, currentTrack, playUserTrack, playState} =
  React.useContext(ListenWithMeContext) as ListenWithMeContextType;
  return (
    <TouchableOpacity
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: theme.color.secondary,
        opacity: 0.5,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onPress={() => {
        if (
          listeningWith === chat.user.handle &&
          playState == PlayState.Playing
        )
          TrackPlayer.pause().catch(e => console.log(e));
        else
          getAudioMetadata(
            `http://10.0.2.2:3000/listenwithme/${chat.user.handle.replace(
              '->',
              '',
            )}/listen1`,
          )
            .then(track => track && playUserTrack(chat.user.handle, track))
            .catch(e => console.log(e));
      }}>
      <IconButton icon="account-music" />
      <Paragraph>
        {listeningWith === chat.user.handle ? currentTrack?.title ?? '' : ''}
      </Paragraph>
      <View>
        <IconButton
          icon={
            listeningWith === chat.user.handle &&
            playState == PlayState.Playing
              ? 'pause'
              : 'play'
          }
        />
        <OverlayedView>
          <ActivityIndicator
            size={35}
            animating={
              listeningWith === chat.user.handle &&
              playState == PlayState.Playing
            }
            color={theme.color.secondary}
          />
        </OverlayedView>
      </View>
    </TouchableOpacity>
  );
}

export {ListenWithMeSection};