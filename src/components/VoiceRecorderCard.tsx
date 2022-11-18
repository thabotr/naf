import React from 'react';
import {View, ToastAndroid, StyleSheet} from 'react-native';
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

function VoiceRecorderCard() {
  const {message, saveComposeMessage, setComposeOn} = useMessageComposer();
  const {
    recorderPlayerState: recorderState,
    recorderPlayerData,
    stopRecorder,
    resumeRecorder,
    pauseRecorder,
  } = useAudioRecorderPlayer();
  const {theme} = useTheme();

  const onDeleteRecording = () => {
    stopRecorder();
    const recordingUri = recorderPlayerData.recordingPath;
    !!recordingUri && FileManager.removeFile(recordingUri);
  };

  const onPauseResumeReconding = () => {
    paused ? resumeRecorder() : pauseRecorder();
  };

  const onDoneRecording = async () => {
    stopRecorder();
    const recordingUri = recorderPlayerData.recordingPath;
    if (recordingUri === '') {
      ToastAndroid.show('Ooops! Something went wrong.', 3000);
      console.error('recording error: uri of recording not found in VRState.');
      return;
    }
    const recordingFileStat = await RNFetchBlob.fs.stat(recordingUri);
    saveComposeMessage({
      ...message,
      voiceRecordings: message.voiceRecordings.concat({
        uri: recordingFileStat.path,
        size: recordingFileStat.size,
        duration: recorderPlayerData.recordingPosition,
        type: recordingFileStat.type,
      }),
    });
    setComposeOn(true);
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

  const Button = ({icon, onPress}: {icon: string; onPress: () => void})=> {
    return (
      <IconButton
        style={styles.controlButton}
        size={25}
        icon={icon}
        onPress={onPress}
      />
    );
  }

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
            <Button icon={'delete'} onPress={onDeleteRecording} />
            <Button
              icon={paused ? 'play' : 'pause'}
              onPress={onPauseResumeReconding}
            />
            <Button icon={'stop'} onPress={onDoneRecording} />
          </HorizontalView>
          <View style={styles.rDurationContainer}>
            <Paragraph style={styles.recordingDuration}>
              {verboseDuration(recorderPlayerData.recordingPosition)}
            </Paragraph>
          </View>
        </View>
      </View>
    </OnlyShow>
  );
}

export {VoiceRecorderCard};