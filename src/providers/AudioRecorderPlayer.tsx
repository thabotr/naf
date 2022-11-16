import React from 'react';
import RNAudioRecorderPlayer, {PlayBackType, RecordBackType} from 'react-native-audio-recorder-player';
import { FileManagerHelper } from '../services/FileManagerHelper';

enum RecordPlayState {
  RECORDING,
  PLAYING,
  IDLE,
  RECORDING_PAUSED,
  PLAYING_PAUSED,
}

type AudioRecorderPlayerContextType = {
  recorderPlayerState: RecordPlayState,
  startRecorder: ()=>void;
  stopRecorder: ()=>void;
  pauseRecorder: ()=>void;
  resumeRecorder: ()=>void;
  startPlayer: (audioPath: string)=>void;
  stopPlayer: ()=>void;
  pausePlayer: ()=>void;
  resumePlayer: ()=>void;
  setVolume: (volume: number)=>void;
  playerSeekTo: (seconds: number)=>void;
  initAudioRecorderPlayer: ()=>void;
}

type Props = {
  children?: React.ReactNode;
}

const AudioRecorderPlayerContext = React.createContext<AudioRecorderPlayerContextType|null>(null);

function AudioRecorderPlayerProvider({children}:Props){
  const [audioRecorderPlayer, setAudioRecorderPlayer] = React.useState<RNAudioRecorderPlayer|null>(null);
  const [recorderPlayerState, setRecorderPlayerState] = React.useState(RecordPlayState.IDLE);
  const [state, setState] = React.useState({
    playerDuration: 0,
    playerPosition: 0,
    playingPath: '',
    recordingPath: '',
    muted: false,
    volume: 1.0,
    recordingPosition: 0,
  });

  const rootDir = FileManagerHelper.audioDir;

  const onPlayerStart=(pbm: PlayBackType)=> {
    setState(state=>{
      return {
        ...state,
        playerDuration: pbm.duration/1000,
        playerPosition: pbm.currentPosition/1000,
        muted: pbm.isMuted ?? false,
      };
    })
  }
  const onStartRecorder=(rbm: RecordBackType)=>{
    setState(state=>{
      return {
        ...state,
        recordingPosition: rbm.currentPosition/1000,
      };
    })
  }
  const initAudioRecorderPlayer=()=>{
    const arp = new RNAudioRecorderPlayer();
    setAudioRecorderPlayer(arp);
  };
  const startRecorder=()=>{
    const path = rootDir
    .concat('/')
    .concat(`${new Date().getTime()}`)
    .concat('.mp3')
    audioRecorderPlayer?.startRecorder(path)
    .then(uri=>{
      uri && setState(state=>{
        return {
          ...state,
          recordingPath: uri,
        }
      });
      audioRecorderPlayer.addRecordBackListener(onStartRecorder);
      setRecorderPlayerState(RecordPlayState.RECORDING);
    })
    .catch(e=>{
      console.error('recording error:', e);
    })
  };
  const stopRecorder=()=>{
    audioRecorderPlayer?.stopRecorder()
    .then(_=>{
      audioRecorderPlayer.removeRecordBackListener();
      setRecorderPlayerState(RecordPlayState.IDLE);
    })
    .catch(e=>{
      console.error('error stoping recorder:', e);
    })
  };
  const pauseRecorder=()=>{
    audioRecorderPlayer?.pauseRecorder()
    .then(_=>setRecorderPlayerState(RecordPlayState.RECORDING_PAUSED))
    .catch(e=>console.error('recorder pause error:', e));
  };
  const resumeRecorder=()=>{
    audioRecorderPlayer?.resumeRecorder()
    .then(_=>setRecorderPlayerState(RecordPlayState.RECORDING))
    .catch(e=>console.error('error resuming recorder:', e));
  };
  const startPlayer=(uri: string)=>{
    audioRecorderPlayer?.startPlayer(uri)
    .then(_=> {
      audioRecorderPlayer.addPlayBackListener(onPlayerStart);
      setRecorderPlayerState(RecordPlayState.PLAYING);
      setState(state=>{
        return {
          ...state,
          playingPath: uri,
        };
      });
    })
    .catch(e=> console.error('player error:', e));
  };
  const stopPlayer=()=>{
    audioRecorderPlayer?.stopPlayer()
    .then(_=>{
      audioRecorderPlayer.removePlayBackListener();
      setRecorderPlayerState(RecordPlayState.IDLE);
    })
    .catch(e=>console.error('error stopping player:', e));
  };
  const pausePlayer=()=>{
    audioRecorderPlayer?.pausePlayer()
    .then(_=>setRecorderPlayerState(RecordPlayState.PLAYING_PAUSED))
    .catch(e=>console.error('error pausing player:', e));
  };
  const resumePlayer=()=>{
    audioRecorderPlayer?.resumePlayer()
    .then(_=>setRecorderPlayerState(RecordPlayState.PLAYING))
    .catch(e=>console.error('error resuming player:', e));
  };
  const setVolume=(volume: number)=>{
    if( volume < 0 || volume > 1 ){
      console.error(`invalid volume value [${volume}] received. expected value in range [0.0,1.0]`);
      return;
    }
    audioRecorderPlayer?.setVolume(volume)
    .then(_=>setState(state=>{
      return {
        ...state,
        volume: volume,
      }
    }))
    .catch(e=>console.error('error changing volume:', e));
  };
  const playerSeekTo=(seconds: number)=>{
    if(seconds < 0 || seconds > state.playerDuration){
      console.error(`cannot seek to [${seconds}s]. expected value in range 0-${state.playerDuration}s`);
      return;
    }
    audioRecorderPlayer?.seekToPlayer(seconds*1000)
    .catch(e=>console.error('error when player seeking:', e));
  };

  const providerValue = {
    recorderPlayerState: recorderPlayerState,
    startPlayer: startPlayer,
    stopPlayer: stopPlayer,
    pausePlayer: pausePlayer,
    resumePlayer: resumePlayer,
    setVolume: setVolume,
    playerSeekTo: playerSeekTo,
    resumeRecorder: resumeRecorder,
    pauseRecorder: pauseRecorder,
    startRecorder: startRecorder,
    stopRecorder: stopRecorder,
    initAudioRecorderPlayer: initAudioRecorderPlayer,
  }

  return <AudioRecorderPlayerContext.Provider value={providerValue}>
    {children}
  </AudioRecorderPlayerContext.Provider>
}

const useAudioRecorderPlayer = (): AudioRecorderPlayerContextType => {
  const context = React.useContext(AudioRecorderPlayerContext);
  if(!context){
    throw new Error("Encapsulate useAudioRecorderPlayer with AudioRecorderPlayerProvider");
  }

  return context;
}

export {useAudioRecorderPlayer, AudioRecorderPlayerProvider};