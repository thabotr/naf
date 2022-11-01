import React from 'react';
import { View} from 'react-native';
import { IconButton, Paragraph } from 'react-native-paper';
import  RNFetchBlob from 'rn-fetch-blob';

import { MessageEditorContext } from '../context/messageEditor';
import { ThemeContext, ThemeContextType } from '../context/theme';
import { verboseDuration } from '../src/helper';
import { MessageEditorContextType } from '../types/MessageEditor';
import { HorizontalView, OnlyShow} from './helper';

export function VoiceRecorder() {
  const {audioRecorderPlayer, vrState, onStopRecord, recordSecs, message, saveComposeMessage, setComposeOn} = React.useContext(MessageEditorContext) as MessageEditorContextType;
  const [recordingPaused, pauseRecording] = React.useState(false);
  const {theme} = React.useContext(ThemeContext) as ThemeContextType;

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
      console.error("Oops! Something went wrong. Upon stopping recorder, uri of recording not found in VRSTate.");
      return;
    }
    const recordingFileStat = await RNFetchBlob.fs.stat(recordingUri);
    saveComposeMessage({
      ...message,
      files: message.files.filter( f => f.type.split('/')[0] !== 'recording').concat([{
        type: `recording/${recordingFileStat.type}`,
        uri: recordingUri,
        duration: recordSecs,
        size: recordingFileStat.size,
      }]),
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
          <Paragraph style={{fontSize: 20, textAlign: 'center'}}>{verboseDuration(recordSecs)}</Paragraph>
        </View>
      </View>
    </View>
  </OnlyShow>
}