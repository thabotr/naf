import {useState, createContext, useContext, ReactNode} from 'react';
import {PermissionsAndroid} from 'react-native';
import RNAudioRecorderPlayer, {
  PlayBackType,
  RecordBackType,
} from 'react-native-audio-recorder-player';
import {FileManager} from '../services/FileManager';
import {FileManagerHelper} from '../services/FileManagerHelper';
import {PermissionsManager} from '../services/PermissionsManager';

enum RecordPlayState {
  RECORDING,
  PLAYING,
  IDLE,
  RECORDING_PAUSED,
  PLAYING_PAUSED,
}

const recordingPerms = [
  PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
];

type AudioRecorderPlayerContextType = {
  recorderPlayerState: RecordPlayState;
  recorderPlayerData: {
    playerDuration: number;
    playerPosition: number;
    playingPath: string;
    recordingPath: string;
    muted: boolean;
    volume: number;
    recordingPosition: number;
    playId: string;
  };
  startRecorder: () => void;
  stopRecorder: () => void;
  pauseRecorder: () => void;
  resumeRecorder: () => void;
  startPlayer: (audioPath: string, playId: string) => void;
  stopPlayer: () => void;
  setVolume: (volume: number) => void;
  playerSeekTo: (seconds: number) => void;
  initAudioRecorderPlayer: () => void;
};

type Props = {
  children?: ReactNode;
};

const AudioRecorderPlayerContext =
  createContext<AudioRecorderPlayerContextType | null>(null);

function AudioRecorderPlayerProvider({children}: Props) {
  const [audioRecorderPlayer, setAudioRecorderPlayer] =
    useState<RNAudioRecorderPlayer | null>(null);
  const [recorderPlayerState, setRecorderPlayerState] = useState(
    RecordPlayState.IDLE,
  );
  const [state, setState] = useState({
    playerDuration: 0,
    playerPosition: 0,
    playingPath: '',
    recordingPath: '',
    muted: false,
    volume: 1.0,
    recordingPosition: 0,
    playId: '',
  });

  const rootDir = FileManager.RootDir.concat('/').concat(
    FileManagerHelper.audioDir,
  );

  const onPlayerStart = (pbm: PlayBackType) => {
    setState(state => {
      return {
        ...state,
        playerDuration: pbm.duration / 1000,
        playerPosition: pbm.currentPosition / 1000,
        muted: pbm.isMuted ?? false,
      };
    });
    if (pbm.duration - pbm.currentPosition < 10) {
      // set player to IDLE within the last 10 milliseconds of the playback
      setRecorderPlayerState(RecordPlayState.IDLE);
    }
  };
  const onStartRecorder = (rbm: RecordBackType) => {
    setState(state => {
      return {
        ...state,
        recordingPosition: rbm.currentPosition / 1000,
      };
    });
  };
  const initAudioRecorderPlayer = () => {
    const arp = new RNAudioRecorderPlayer();
    setAudioRecorderPlayer(arp);
  };
  const startRecorder = async () => {
    const permsGranted = await PermissionsManager.assertPermissionsGranted(
      recordingPerms,
    );
    if (!permsGranted) {
      PermissionsManager.requestPermissions(recordingPerms);
      return;
    }

    const path = rootDir
      .concat('/')
      .concat(`${new Date().getTime()}`)
      .concat('.mp3');
    audioRecorderPlayer
      ?.startRecorder(path)
      .then(uri => {
        uri &&
          setState(state => {
            return {
              ...state,
              recordingPath: uri,
            };
          });
        audioRecorderPlayer.addRecordBackListener(onStartRecorder);
        setRecorderPlayerState(RecordPlayState.RECORDING);
      })
      .catch(e => {
        console.error('recording error:', e);
      });
  };
  const stopRecorder = () => {
    audioRecorderPlayer
      ?.stopRecorder()
      .then(_ => {
        audioRecorderPlayer.removeRecordBackListener();
        setRecorderPlayerState(RecordPlayState.IDLE);
      })
      .catch(e => {
        console.error('error stoping recorder:', e);
      });
  };
  const pauseRecorder = () => {
    audioRecorderPlayer
      ?.pauseRecorder()
      .then(_ => setRecorderPlayerState(RecordPlayState.RECORDING_PAUSED))
      .catch(e => console.error('recorder pause error:', e));
  };
  const resumeRecorder = () => {
    audioRecorderPlayer
      ?.resumeRecorder()
      .then(_ => setRecorderPlayerState(RecordPlayState.RECORDING))
      .catch(e => console.error('error resuming recorder:', e));
  };
  const startPlayer = (uri: string, playId: string) => {
    audioRecorderPlayer
      ?.startPlayer(uri)
      .then(_ => {
        audioRecorderPlayer.addPlayBackListener(onPlayerStart);
        setRecorderPlayerState(RecordPlayState.PLAYING);
        setState(state => {
          return {
            ...state,
            playingPath: uri,
            playId: playId,
          };
        });
      })
      .catch(e => console.error('player error:', e));
  };
  const stopPlayer = () => {
    audioRecorderPlayer
      ?.stopPlayer()
      .then(_ => {
        audioRecorderPlayer.removePlayBackListener();
        setRecorderPlayerState(RecordPlayState.IDLE);
      })
      .catch(e => console.error('error stopping player:', e));
  };
  const setVolume = (volume: number) => {
    if (volume < 0 || volume > 1) {
      console.error(
        `invalid volume value [${volume}] received. expected value in range [0.0,1.0]`,
      );
      return;
    }
    audioRecorderPlayer
      ?.setVolume(volume)
      .then(_ =>
        setState(state => {
          return {
            ...state,
            volume: volume,
          };
        }),
      )
      .catch(e => console.error('error changing volume:', e));
  };
  const playerSeekTo = (seconds: number) => {
    if (seconds < 0 || seconds > state.playerDuration) {
      console.error(
        `cannot seek to [${seconds}s]. expected value in range 0-${state.playerDuration}s`,
      );
      return;
    }
    audioRecorderPlayer
      ?.seekToPlayer(seconds * 1000)
      .catch(e => console.error('error when player seeking:', e));
  };

  const providerValue = {
    recorderPlayerState: recorderPlayerState,
    startPlayer: startPlayer,
    stopPlayer: stopPlayer,
    setVolume: setVolume,
    playerSeekTo: playerSeekTo,
    resumeRecorder: resumeRecorder,
    pauseRecorder: pauseRecorder,
    startRecorder: startRecorder,
    stopRecorder: stopRecorder,
    initAudioRecorderPlayer: initAudioRecorderPlayer,
    recorderPlayerData: state,
  };

  return (
    <AudioRecorderPlayerContext.Provider value={providerValue}>
      {children}
    </AudioRecorderPlayerContext.Provider>
  );
}

const useAudioRecorderPlayer = (): AudioRecorderPlayerContextType => {
  const context = useContext(AudioRecorderPlayerContext);
  if (!context) {
    throw new Error(
      'Encapsulate useAudioRecorderPlayer with AudioRecorderPlayerProvider',
    );
  }

  return context;
};

export {useAudioRecorderPlayer, AudioRecorderPlayerProvider, RecordPlayState};
