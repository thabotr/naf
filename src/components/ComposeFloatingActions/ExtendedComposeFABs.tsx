import {useEffect} from 'react';
import {BackHandler} from 'react-native';
import {useMessageComposer} from '../../context/messageEditor';
import {useAudioRecorderPlayer} from '../../providers/AudioRecorderPlayer';
import { AsyncIconButton } from '../UserProfile/AsyncIconButton';

const ExtendedComposeFABs = ({onBack}: {onBack: () => void}) => {
  const {saveComposeMsg, addAttachments, recordVisual} = useMessageComposer();
  const {startRecorder} = useAudioRecorderPlayer();
  const actions = [
    {color: '#d4d4d4', icon: 'microphone'},
    {color: '#b4b4b4', icon: 'attachment'},
    {color: '#909090', icon: 'camera'},
    {color: '#636363', icon: 'pencil'},
  ];

  const pencilClicked = () => {
    saveComposeMsg(msg => {
      if (!msg) {
        return {
          from: '',
          to: '',
          id: 0,
          files: [],
          voiceRecordings: [],
        };
      } else {
        return msg;
      }
    });
  };

  const backAction = () => {
    onBack();
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);

  return (
    <>
      {actions.map(ab => (
        <AsyncIconButton
          key={ab.icon}
          style={{margin: 1, borderRadius: 0, backgroundColor: ab.color}}
          size={40}
          icon={ab.icon}
          onLongPress={async() => {
            switch (ab.icon) {
              case 'camera':
                recordVisual('video');
                onBack();
                break;
              default:
            }
          }}
          onPress={async() => {
            switch (ab.icon) {
              case 'microphone':
                startRecorder();
                break;
              case 'pencil':
                pencilClicked();
                break;
              case 'attachment':
                addAttachments();
                break;
              case 'camera':
                recordVisual('photo');
                break;
              default:
                console.warn('ExtendedComposeFABs: TODO implement action');
            }
            onBack();
          }}
        />
      ))}
    </>
  );
};

export {ExtendedComposeFABs};
