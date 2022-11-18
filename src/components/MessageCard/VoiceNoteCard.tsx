import React from 'react';
import {StyleSheet, View} from 'react-native';
import {
  ProgressBar,
  IconButton,
  Paragraph as RNPParagraph,
  Card,
} from 'react-native-paper';

import {useTheme} from '../../context/theme';
import {verboseDuration, verboseSize} from '../../helper';
import {useAudioRecorderPlayer} from '../../providers/AudioRecorderPlayer';
import {FileManager} from '../../services/FileManager';
import {VoiceNoteType} from '../../types/message';
import {OnlyShow} from '../Helpers/OnlyShow';
import {HorizontalView} from '../Helpers/HorizontalView';

const enum PlayState {
  PAUSED,
  PLAYING,
  STOPPED,
}

export function VoiceNoteCard({
  playId,
  file,
  fromYou,
  style,
}: {
  playId: string;
  file: VoiceNoteType;
  fromYou?: boolean;
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

  const styles = StyleSheet.create({
    container: {
      ...style,
      margin: 3,
      padding: 5,
      backgroundColor: fromYou
        ? theme.color.userSecondary
        : theme.color.friendSecondary,
    },
    paragraph: {
      color: theme.color.textPrimary,
      textShadowColor: theme.color.textSecondary,
    },
    matadataHeader: {
      justifyContent: 'space-between',
    },
    progressBarContainer: {flex: 1, justifyContent: 'center'},
  });

  const Paragraph = ({children}: {children: React.ReactNode}) => {
    return <RNPParagraph style={styles.paragraph}>{children}</RNPParagraph>;
  };

  return (
    <Card style={styles.container}>
      <HorizontalView>
        <View style={{flex: 1}}>
          <HorizontalView style={styles.matadataHeader}>
            <Paragraph>{verboseDuration(playerValues.positionSec)}</Paragraph>
            <Paragraph>{verboseSize(file.size)}</Paragraph>
            <Paragraph>{verboseDuration(playerValues.durationSec)}</Paragraph>
          </HorizontalView>
          <View style={styles.progressBarContainer}>
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
