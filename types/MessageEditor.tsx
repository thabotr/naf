import AudioRecorderPlayer from 'react-native-audio-recorder-player';

import { Message, VRState } from "../context/messageEditor";

export type MessageEditorContextType = {
  recordSecs: number;
  vrState: VRState;
  audioRecorderPlayer: AudioRecorderPlayer;
  message: Message;
  composing: boolean;
  showTextInput: boolean;
  onAddAttachments: ()=>void;
  showTextInputOn: (b: boolean)=>void;
  onStartRecord: ()=>Promise<void>;
  onStopRecord: ()=>Promise<void>;
  setComposeOn: (b: boolean) => void;
  saveMessage: (m: Message) => void;
  saveVRState: (s: VRState) => void;
  discardMessage: ()=>void;
}