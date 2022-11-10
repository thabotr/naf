import React from 'react';
import { View, ToastAndroid} from 'react-native';
import { IconButton, Paragraph } from 'react-native-paper';
import  RNFetchBlob from 'rn-fetch-blob';

import {useMessageComposer} from '../context/messageEditor';
import {useTheme} from '../context/theme';
import { verboseDuration } from '../src/helper';
import { HorizontalView, OnlyShow} from './helper';

export function VoiceRecorder() {
  const {
    audioRecorderPlayer,
    vrState,
    onStopRecord,
    recordSecs,
    message,
    saveComposeMessage,
    setComposeOn
  } = useMessageComposer();
  const [recordingPaused, pauseRecording] = React.useState(false);
  const {theme} = useTheme();

  const onResumeRecording = async () => {
    const msg = await audioRecorderPlayer.resumeRecorder();
    console.log(msg);
  }

  const onPauseRecording = async () => {
    const msg = await audioRecorderPlayer.pauseRecorder();
    console.log(msg);
  }

  const onDeleteRecording = () => {
    onStopRecord();
    const recordingUri = vrState.recordingUri ?? '';
    if( recordingUri !== '')
      RNFetchBlob.fs.unlink(recordingUri);
  }

  const onPauseResumeReconding = () => {
    recordingPaused ? onResumeRecording() : onPauseRecording();
    pauseRecording(!recordingPaused);
  }

  const onDoneRecording = async () => {
    onStopRecord();
    const recordingUri = vrState.recordingUri ?? '';
    if( recordingUri === '') {
      ToastAndroid.show('Ooops! Something went wrong.', 3000);
      console.error("recording error: uri of recording not found in VRState.");
      return;
    }
    const recordingFileStat = await RNFetchBlob.fs.stat(recordingUri);
    saveComposeMessage({
      ...message,
      voiceRecordings: message.voiceRecordings.concat({
        uri: recordingFileStat.path, 
        size: recordingFileStat.size, 
        duration: recordSecs, 
        type: recordingFileStat.type,
      }),
    });
    setComposeOn(true);
  }

  return <OnlyShow If={vrState.recording}>
    <View
      style={
      [
          {
          display: 'flex',
          flexDirection: 'row',
          padding: 0,
          elevation: 2,
          borderRadius: 3,
          position: 'absolute',
          right: 10,
          bottom: 65,
          backgroundColor: theme.color.primary, // TODO get from theme,
          }
      ]}
    >
      <View style={{ justifyContent: 'center'}}>
        <IconButton
          color={recordingPaused ? 'white' : 'red'}
          style={{ borderRadius: 0}}
          size={40}
          icon={'microphone'}
        />
      </View>
      <View>
        <HorizontalView>
        <IconButton
            style={{margin: 5, borderRadius: 0, backgroundColor: theme.color.secondary}}
            size={25}
            icon={"delete"}
            onPress={onDeleteRecording}
        />
        <IconButton
            style={{margin: 5, borderRadius: 0, backgroundColor: theme.color.secondary}}
            size={25}
            icon={recordingPaused ? "play" : "pause"}
            onPress={onPauseResumeReconding}
        />
        <IconButton
          style={{margin: 5, borderRadius: 0, backgroundColor: theme.color.secondary}}
          size={25}
          icon={'stop'}
          onPress={onDoneRecording}
        />
        </HorizontalView>
        <View style={{justifyContent: 'center', margin: 5}}>
          <Paragraph
            style={{
              fontSize: 20, 
              textAlign: 'center', 
              color: theme.color.textPrimary, 
              textShadowColor: theme.color.textSecondary
            }}
            >{verboseDuration(recordSecs)}</Paragraph>
        </View>
      </View>
    </View>
  </OnlyShow>
}