import {useState, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  ProgressBar,
  IconButton,
  Paragraph as RNPParagraph,
  Card,
} from 'react-native-paper';

import {useTheme} from '../../context/theme';
import {verboseDuration, verboseSize} from '../../helper';
import {
  RecordPlayState,
  useAudioRecorderPlayer,
} from '../../providers/AudioRecorderPlayer';
import {FileManager} from '../../services/FileManager';
import {VoiceNoteType} from '../../types/message';
import {OnlyShow} from '../Helpers/OnlyShow';
import {HorizontalView} from '../Helpers/HorizontalView';
import {useLoggedInUser} from '../../context/user';
import { MutexContextProvider } from '../../providers/MutexProvider';
import { AsyncIconButton } from '../UserProfile/AsyncIconButton';

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
  const {theme} = useTheme();
  const {
    playerSeekTo,
    playId: RPPlayId,
    startPlayer,
    stopPlayer,
    recorderPlayerState,
    playerPosition,
    playerDuration,
  } = useAudioRecorderPlayer();
  const [playerValues, setPlayerValues] = useState({
    positionSec: 0,
    durationSec: file.duration,
  });
  const [playState, setPlayState] = useState<PlayState>(() => {
    if (RPPlayId === playId) {
      if (recorderPlayerState === RecordPlayState.PLAYING)
        return PlayState.PLAYING;
      else {
        return PlayState.PAUSED;
      }
    }
    return PlayState.STOPPED;
  });
  const [uri, setURI] = useState('');
  const {userProfile} = useLoggedInUser();

  useEffect(() => {
    FileManager.getFileURI(file.uri, file.type, {
      handle: userProfile.handle,
      token: userProfile.token,
    }).then(uri => uri && setURI(uri));
    setURI(file.uri);
    // return onPausePlay;
  }, []);

  useEffect(() => {
    if (playId === RPPlayId) {
      setPlayerValues(pvs => {
        return {
          ...pvs,
          positionSec: playerPosition,
        };
      });
      if (playerDuration && playerDuration <= playerPosition) {
        setPlayState(PlayState.STOPPED);
      }
    } else if (playState === PlayState.PLAYING) {
      setPlayState(PlayState.PAUSED);
    }
  }, [playerPosition]);

  const onResumePlay = async () => {
    startPlayer(uri, playId);
    playerSeekTo(playerValues.positionSec);
    setPlayState(PlayState.PLAYING);
  };

  const onStartPlay = async () => {
    startPlayer(uri, playId);
    setPlayState(PlayState.PLAYING);
  };

  const onPausePlay = async () => {
    if (playId === RPPlayId) {
      stopPlayer();
      setPlayState(PlayState.PAUSED);
    }
  };

  const stopPlay = async () => {
    if (playId === RPPlayId) {
      stopPlayer();
    }
    setPlayState(PlayState.STOPPED);
    setPlayerValues(playerValues => {
      return {
        ...playerValues,
        positionSec: 0,
      };
    });
  };

  const progress =
    playerValues.durationSec === 0
      ? 0
      : playerValues.positionSec / playerValues.durationSec;

  const styles = StyleSheet.create({
    container: {
      ...style,
      margin: 3,
      paddingHorizontal: 5,
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
    squareButton: {borderRadius: 0},
  });

  const Paragraph = ({children}: {children: React.ReactNode}) => {
    return <RNPParagraph style={styles.paragraph}>{children}</RNPParagraph>;
  };

  const recordingInProgress =
      recorderPlayerState === RecordPlayState.RECORDING ||
      recorderPlayerState === RecordPlayState.RECORDING_PAUSED;

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
        <MutexContextProvider>
          <OnlyShow If={!!uri}>
            <AsyncIconButton
              disabled={recordingInProgress}
              icon={playState === PlayState.PLAYING ? 'pause' : 'play'}
              onPress={async() => {
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
            />
          </OnlyShow>
          <OnlyShow If={playState !== PlayState.STOPPED}>
            <AsyncIconButton
              icon="stop"
              onPress={stopPlay}
              disabled={recordingInProgress}
            />
          </OnlyShow>
        </MutexContextProvider>
      </HorizontalView>
    </Card>
  );
}
