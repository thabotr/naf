import React from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import DocumentPicker, {
  DocumentPickerResponse,
  isInProgress
} from 'react-native-document-picker';
import  RNFetchBlob from 'rn-fetch-blob';

import { permissionsGranted, requestPermissions } from '../src/permissions';
import { FileType, Message } from '../types/message';
import { UserContext, UserContextType } from './user';

const MessageComposerContext = React.createContext<MessageComposerContextType|null>(null);

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

export type MessageComposerContextType = {
  recordSecs: number;
  vrState: VRState;
  audioRecorderPlayer: AudioRecorderPlayer;
  message: Message;
  composing: boolean;
  showTextInput: boolean;
  previewingFiles: boolean;
  enableFilesPreview: (b:boolean) => void;
  onAddAttachments: ()=>void;
  showTextInputOn: (b: boolean)=>void;
  onStartRecord: ()=>Promise<void>;
  onStopRecord: ()=>Promise<void>;
  setComposeOn: (b: boolean) => void;
  saveComposeMessage: (m: Message) => void;
  saveVRState: (s: VRState) => void;
  discardMessage: ()=>void;
}

type Props = {
  children: React.ReactNode,
}

const MessageComposerProvider = ({children}: Props) => {
  const {user} = React.useContext(UserContext) as UserContextType;
  const [message, setMessage] = React.useState<Message>({from: user?.handle ?? '', id: '', to: '', files:[], voiceRecordings: []});
  const [composing, setComposing] = React.useState(false);
  const [vrState, setVRState] = React.useState<VRState>({recordingPermitted: false});
  const [showTextInput, setShowTextInput] = React.useState(false);
  const [recordSecs, setRecordSecs] = React.useState(0);
  const [audioRecorderPlayer] = React.useState<AudioRecorderPlayer>(new AudioRecorderPlayer());
  const [previewingFiles, setPreviewingFiles] = React.useState(false);
  const [recordingName, setRecordingName] = React.useState<string>((new Date()).getTime().toString());
  
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
    DocumentPicker.pick({allowMultiSelection: true, copyTo: "cachesDirectory"}).then(
      ( dprs: Array<DocumentPickerResponse> | null | undefined) => {
        if( dprs){
          const selectedFiles = dprs.map(
            ( dpr: DocumentPickerResponse): FileType => {
              return {
                name: dpr.name ?? undefined,
                size: dpr.size ?? 0,
                type: dpr.type ?? '',
                uri: dpr.fileCopyUri ?? dpr.uri,
              }
            }
          )
          const mFilesNotInSelection = message?.files?.filter(mf => !selectedFiles.find( sf => sf.uri === mf.uri));
          const updatedMessage: Message = {
            ...message,
            files: mFilesNotInSelection?.concat(selectedFiles) ?? selectedFiles,
          }
          saveComposeMessage(updatedMessage);
          setComposeOn(true);
        }
    }).catch(handleError);
  }

  const showTextInputOn = (b: boolean)=> {
    setShowTextInput(b);
  }

  const discardMessage = () => {
    setComposeOn(false);
    saveComposeMessage({files: [], id: '', from: user?.handle ?? '', to: '', voiceRecordings: []});
  }

  const saveVRState = (s: VRState)=>{
    setVRState(s);
  }

  const saveComposeMessage = (m: Message)=> {
    setMessage(m);
  }

  const setComposeOn = (b: boolean)=> {
    setComposing(b);
  }

  const onStartRecord = async () => {
    const permsGranted = await permissionsGranted(recordingPerms);
    if( !permsGranted) {
      await requestPermissions(recordingPerms);
      return;
    }
    
    const path = Platform.select({
      android: `${RNFetchBlob.fs.dirs.CacheDir}/${recordingName}.mp3`
    })

    const uri = await audioRecorderPlayer.startRecorder(path);
    audioRecorderPlayer.addRecordBackListener((e) => {
      setRecordSecs(e.currentPosition/1000);
    });

    setVRState({
      ...vrState,
      recordingPermitted: true,
      recording: true,
      recordingUri: uri,
    });
  };
  
  const onStopRecord = async () => {
    setRecordingName((new Date()).getTime().toString());
    await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    const oldVrState = {...vrState};
    setVRState({
      ...oldVrState,
      recording: false,
    });
  };

  const enableFilesPreview = (b: boolean) => setPreviewingFiles(b);

  const providerValue = {
    previewingFiles: previewingFiles,
    enableFilesPreview: enableFilesPreview,
    recordSecs: recordSecs,
    onStopRecord: onStopRecord,
    onStartRecord: onStartRecord,
    onAddAttachments: onAddAttachments,
    audioRecorderPlayer: audioRecorderPlayer,
    vrState: vrState,
    message: message,
    setComposeOn: setComposeOn,
    composing: composing,
    saveComposeMessage: saveComposeMessage,
    saveVRState: saveVRState,
    discardMessage: discardMessage,
    showTextInput: showTextInput,
    showTextInputOn: showTextInputOn,
  }
  return <MessageComposerContext.Provider value={providerValue}>
    {children}
  </MessageComposerContext.Provider>
}

const useMessageComposer = (): MessageComposerContextType => {
  const context = React.useContext(MessageComposerContext);
  if( !context)
    throw new Error("Encapsulate useMessageComposer with MessageComposerProvider");
  return context;
}

export {MessageComposerProvider, useMessageComposer};