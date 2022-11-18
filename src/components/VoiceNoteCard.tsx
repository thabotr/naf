import React from 'react';
import {View} from 'react-native';
import {ProgressBar, IconButton, Paragraph, Card} from 'react-native-paper';

import {useTheme} from '../context/theme';
import {verboseDuration, verboseSize} from '../helper';
import {useAudioRecorderPlayer} from '../providers/AudioRecorderPlayer';
import {FileManager} from '../services/FileManager';
import {VoiceNoteType} from '../types/message';
import {OnlyShow} from './Helpers/OnlyShow';
import {HorizontalView} from './Helpers/HorizontalView';

const enum PlayState {
  PAUSED,
  PLAYING,
  STOPPED,
}

export function VoiceNoteCard({
  playId,
  file,
  user,
  style,
}: {
  playId: string;
  file: VoiceNoteType;
  user?: boolean;
  style?: {[key: string]: any};
}) {
  const [playState, setPlayState] = React.useState<PlayState>(
    PlayState.STOPPED,
  );
  const {theme} = useTheme();
  const {recorderPlayerData, playerSeekTo, startPlayer, stopPlayer} =
    useAudioRecorderPlayer();
  const [playerValues, setPlayerValues] = React.useState({
    positionSec: 0,
    durationSec: file.duration,
  });
  const [uri, setURI] = React.useState('');

  React.useEffect(() => {
    FileManager.getFileURI(file.uri, file.type).then(uri => uri && setURI(uri));
    setURI(file.uri);
    return onPausePlay;
  }, []);

  React.useEffect(() => {
    if (playId === recorderPlayerData.playId) {
      setPlayerValues(pvs => {
        return {
          ...pvs,
          positionSec: recorderPlayerData.playerPosition,
        };
      });
    } else if (playState === PlayState.PLAYING) {
      setPlayState(PlayState.PAUSED);
    }
  }, [recorderPlayerData.playerPosition]);

  const onResumePlay = () => {
    startPlayer(uri, playId);
    playerSeekTo(playerValues.positionSec);
    setPlayState(PlayState.PLAYING);
  };

  const onStartPlay = () => {
    startPlayer(uri, playId);
    setPlayState(PlayState.PLAYING);
  };

  const onPausePlay = () => {
    if (playId === recorderPlayerData.playId) {
      stopPlayer();
      setPlayState(PlayState.PAUSED);
    }
  };

  const onStopPlay = () => {
    if (playId === recorderPlayerData.playId) {
      stopPlayer();
      setPlayState(PlayState.STOPPED);
      setPlayerValues(playerValues => {
        return {
          ...playerValues,
          positionSec: 0,
        };
      });
    }
  };

  const progress =
    playerValues.durationSec === 0
      ? 0
      : playerValues.positionSec / playerValues.durationSec;

  return (
    <Card
      style={{
        ...style,
        margin: 3,
        padding: 5,
        backgroundColor: user
          ? theme.color.userSecondary
          : theme.color.friendSecondary,
      }}>
      <HorizontalView>
        <View style={{flex: 1}}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Paragraph
              style={{
                color: theme.color.textPrimary,
                textShadowColor: theme.color.textSecondary,
              }}>
              {verboseDuration(playerValues.positionSec)}
            </Paragraph>
            <Paragraph
              style={{
                color: theme.color.textPrimary,
                textShadowColor: theme.color.textSecondary,
              }}>
              {verboseSize(file.size)}
            </Paragraph>
            <Paragraph
              style={{
                color: theme.color.textPrimary,
                textShadowColor: theme.color.textSecondary,
              }}>
              {verboseDuration(playerValues.durationSec)}
            </Paragraph>
          </View>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <ProgressBar color={theme.color.primary} progress={progress} />
          </View>
        </View>
        <OnlyShow If={!!uri}>
          <IconButton
            onPress={() => {
              switch (playState) {
                case PlayState.PLAYING:
                  onPausePlay();
                  break;
                case PlayState.PAUSED:
                  onResumePlay();
                  break;
                default:
                  onStartPlay();
              }
            }}
            icon={playState === PlayState.PLAYING ? 'pause' : 'play'}
          />
        </OnlyShow>
        <OnlyShow If={playState !== PlayState.STOPPED}>
          <IconButton onPress={onStopPlay} icon="stop" />
        </OnlyShow>
      </HorizontalView>
    </Card>
  );
}
