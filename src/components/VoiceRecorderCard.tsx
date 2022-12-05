/* eslint-disable require-await */
import React from 'react';
import {View, ToastAndroid, StyleSheet, Platform} from 'react-native';
import {IconButton, Paragraph} from 'react-native-paper';
import RNFetchBlob from 'rn-fetch-blob';

import {useMessageComposer} from '../context/messageEditor';
import {useTheme} from '../context/theme';
import {verboseDuration} from '../helper';
import {
  RecordPlayState,
  useAudioRecorderPlayer,
} from '../providers/AudioRecorderPlayer';
import {FileManager} from '../services/FileManager';
import {OnlyShow} from './Helpers/OnlyShow';
import {HorizontalView} from './Helpers/HorizontalView';
import {useLoggedInUser} from '../context/user';
import {useChats} from '../context/chat';
import {AsyncIconButton} from './UserProfile/AsyncIconButton';
import {MutexContextProvider} from '../providers/MutexProvider';

function VoiceRecorderCard() {
  const {saveComposeMsg} = useMessageComposer();
  const {
    recorderPlayerState: recorderState,
    stopRecorder,
    resumeRecorder,
    pauseRecorder,
    recordingPath,
    recordingPosition,
  } = useAudioRecorderPlayer();
  const {theme} = useTheme();
  const {userProfile} = useLoggedInUser();
  const chatUser = useChats().activeChat()?.user;

  if (!chatUser) {
    return <></>;
  }

  const onDeleteRecording = async () => {
    stopRecorder();
    recordingPath && FileManager.removeFile(recordingPath);
  };

  const onPauseResumeReconding = async () => {
    paused ? resumeRecorder() : pauseRecorder();
  };

  const onDoneRecording = async () => {
    const recordingFileStat = await RNFetchBlob.fs.stat(recordingPath);
    const recPos = recordingPosition;
    stopRecorder();
    if (recordingPath === '') {
      ToastAndroid.show('Ooops! Something went wrong.', 3000);
      console.error('recording error: uri of recording not found in VRState.');
      return;
    }
    const file = {
      duration: recPos,
      name: recordingFileStat.filename,
      size: recordingFileStat.size,
      uri:
        Platform.select({android: 'file://'.concat(recordingFileStat.path)}) ??
        recordingFileStat.path,
      type: 'audio/mpeg', // FIXME currently filestat just returns type="file", find way to fix this
    };
    saveComposeMsg(msg => {
      if (msg) {
        return {
          ...msg,
          voiceRecordings: msg.voiceRecordings.concat(file),
        };
      } else {
        return {
          voiceRecordings: [file],
          files: [],
          from: userProfile.handle,
          to: chatUser.handle,
          id: new Date().getTime(),
        };
      }
    });
  };

  const paused = recorderState === RecordPlayState.RECORDING_PAUSED;
  const recording = recorderState === RecordPlayState.RECORDING;

  const styles = StyleSheet.create({
    controlButton: {
      margin: 5,
      borderRadius: 0,
      backgroundColor: theme.color.secondary,
    },
    floatingRecorderContainer: {
      display: 'flex',
      flexDirection: 'row',
      padding: 0,
      elevation: 2,
      borderRadius: 3,
      position: 'absolute',
      right: 10,
      bottom: 65,
      backgroundColor: theme.color.primary,
    },
    recordingIndicator: {borderRadius: 0},
    rIndicatorContainer: {justifyContent: 'center'},
    recordingDuration: {
      fontSize: 20,
      textAlign: 'center',
      color: theme.color.textPrimary,
      textShadowColor: theme.color.textSecondary,
    },
    rDurationContainer: {justifyContent: 'center', margin: 5},
  });

  return (
    <OnlyShow If={recording || paused}>
      <View style={styles.floatingRecorderContainer}>
        <View style={styles.rIndicatorContainer}>
          <IconButton
            color={paused ? 'white' : 'red'}
            style={styles.recordingIndicator}
            size={40}
            icon={'microphone'}
          />
        </View>
        <View>
          <HorizontalView>
            <MutexContextProvider>
              <AsyncIconButton icon={'delete'} onPress={onDeleteRecording} />
              <AsyncIconButton
                icon={paused ? 'play' : 'pause'}
                onPress={onPauseResumeReconding}
              />
              <AsyncIconButton icon={'stop'} onPress={onDoneRecording} />
            </MutexContextProvider>
          </HorizontalView>
          <View style={styles.rDurationContainer}>
            <Paragraph
              style={[
                styles.recordingDuration,
                {
                  color: theme.color.textPrimary,
                  shadowColor: theme.color.textSecondary,
                },
              ]}>
              {verboseDuration(recordingPosition)}
            </Paragraph>
          </View>
        </View>
      </View>
    </OnlyShow>
  );
}

export {VoiceRecorderCard};
