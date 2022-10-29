import React from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import DocumentPicker, {
  DocumentPickerResponse,
  isInProgress
} from 'react-native-document-picker';
import  RNFetchBlob from 'rn-fetch-blob';

import { permissionsGranted, requestPermissions } from '../src/permissions';
import { MessageEditorContextType } from '../types/MessageEditor';

export const MessageEditorContext = React.createContext<MessageEditorContextType|null>(null);

export type Message = {
  userId: string,
  id: string,
  text?: string,
  files: MessageFile[],
}

export type MessageFile = {
    name?: string,
    type: string,
    uri: string,
    size?: number,
    duration?: number,
}

export type VRState = {
  recordingPermitted: boolean,
  currentPositionSec?: number,
  currentDurationSec?: number,
  playTime?: string,
  duration?: string,
  recording?: boolean,
  recordingUri?: string,
}

const recordingPerms = [
  PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
];

export function MessageEditorProvider({children}:{children:React.ReactNode}){
  const [message, setMessage] = React.useState<Message>({userId: '', id: '', files:[]});
  const [composing, setComposing] = React.useState(false);
  const [vrState, setVRState] = React.useState<VRState>({recordingPermitted: false});
  const [showTextInput, setShowTextInput] = React.useState(false);
  const [recordSecs, setRecordSecs] = React.useState(0);
  const [audioRecorderPlayer] = React.useState<AudioRecorderPlayer>(new AudioRecorderPlayer());
  
  const handleError = (err: unknown) => {
    if (DocumentPicker.isCancel(err)) {
      // User cancelled the picker, exit any dialogs or menus and move on
    } else if (isInProgress(err)) {
      console.warn('multiple pickers were opened, only the last will be considered')
    } else {
      throw err
    }
  }

  const onAddAttachments = () => {
    DocumentPicker.pick({allowMultiSelection: true}).then(
      ( dprs: Array<DocumentPickerResponse> | null | undefined) => {
        if( dprs){
          const selectedFiles = dprs.map(
            ( dpr: DocumentPickerResponse): MessageFile => {
              return {
                name: dpr.name ?? undefined,
                size: dpr.size ?? undefined,
                type: dpr.type ?? '',
                uri: dpr.uri,
              }
            }
          )
          const mFilesNotInSelection = message.files.filter(mf => !selectedFiles.find( sf => sf.uri === mf.uri))
          console.warn('TODO generate video thumbnail');
          const updatedMessage: Message = {
            ...message,
            files: mFilesNotInSelection.concat(selectedFiles)
          }
          saveMessage(updatedMessage);
          setComposeOn(true);
        }
    }).catch(handleError);
  }

  const showTextInputOn = (b: boolean)=> {
    setShowTextInput(b);
  }

  const discardMessage = () => {
    setComposeOn(false);
    saveMessage({files: [], id: '', userId: ''});
  }

  const saveVRState = (s: VRState)=>{
    setVRState(s);
  }

  const saveMessage = (m: Message)=> {
    setMessage(m);
  }

  const setComposeOn = (b: boolean)=> {
    setComposing(b);
  }

  const onStartRecord = async () => {
    const permsGranted = await permissionsGranted(recordingPerms);
    if( !permsGranted) {
      requestPermissions(recordingPerms);
      return;
    }
    
    const dirs = RNFetchBlob.fs.dirs;
    const path = Platform.select({
      android: `${dirs.CacheDir}/recording.mp3`
    })

    const uri = await audioRecorderPlayer.startRecorder(path);
    audioRecorderPlayer.addRecordBackListener((e) => {
      setRecordSecs(e.currentPosition/1_000);
    });

    setVRState({
      ...vrState,
      recordingPermitted: true,
      recording: true,
      recordingUri: uri,
    });
  };
  
  const onStopRecord = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    const oldVrState = {...vrState};
    setVRState({
      ...oldVrState,
      recording: false,
    });
    console.log(result);
  };

  return <MessageEditorContext.Provider
    value={{
      recordSecs: recordSecs,
      onStopRecord: onStopRecord,
      onStartRecord: onStartRecord,
      onAddAttachments: onAddAttachments,
      audioRecorderPlayer: audioRecorderPlayer,
      vrState: vrState,
      message: message,
      setComposeOn: setComposeOn,
      composing: composing,
      saveMessage: saveMessage,
      saveVRState: saveVRState,
      discardMessage: discardMessage,
      showTextInput: showTextInput,
      showTextInputOn: showTextInputOn,
    }}
    >
    {children}
  </MessageEditorContext.Provider>
}