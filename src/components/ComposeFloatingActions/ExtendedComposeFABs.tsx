import {useEffect} from 'react';
import {BackHandler} from 'react-native';
import {IconButton} from 'react-native-paper';
import { useChats } from '../../context/chat';
import {useMessageComposer} from '../../context/messageEditor';
import { useLoggedInUser } from '../../context/user';
import {useAudioRecorderPlayer} from '../../providers/AudioRecorderPlayer';
import {FileManager} from '../../services/FileManager';
import { deduplicatedConcat } from '../../utils/deduplicatedConcat';

const ExtendedComposeFABs = ({onBack}: {onBack: () => void}) => {
  const {
    saveComposeMsg,
  } = useMessageComposer();
  const {startRecorder} = useAudioRecorderPlayer();
  const {user} = useLoggedInUser();
  const interlocutor = useChats()?.activeChat()?.user;
  const actions = [
    {color: '#d4d4d4', icon: 'microphone'},
    {color: '#b4b4b4', icon: 'attachment'},
    {color: '#909090', icon: 'camera'},
    {color: '#636363', icon: 'pencil'},
  ];

  const pencilClicked = () => {
    saveComposeMsg(msg=>{
      if(!msg){
        return {
          from: user.handle,
          to: interlocutor.handle,
          id: new Date().getTime(),
          files: [],
          voiceRecordings: [],
        }
      }else{
        return msg;
      }
    })
  };

  const backAction = () => {
    onBack();
    return true;
  };

  const addAttachments = () => {
    FileManager.pickFiles().then(files => {
      if (!files) return;
      saveComposeMsg(msg => {
        if (msg) {
          return {
            ...msg,
            files: deduplicatedConcat(
              msg.files,
              files,
              (f1, f2) =>
                f1.name === f2.name &&
                f1.size === f2.size &&
                f1.type === f2.type,
            ),
          };
        }
      });
    });
  };

  const takePic = (mode: 'video' | 'photo') => {
    FileManager.getCameraMedia(mode)
      .then(pic => {
        pic &&
          saveComposeMsg(msg=>{
            if(msg){
              return {
                ...msg,
                files: msg.files.concat(pic),
              }
            }else{
              return {
                from: user.handle,
                to: interlocutor.handle,
                id: new Date().getTime(),
                files: [pic],
                voiceRecordings: [],
              }
            }
          })
      })
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);

  return (
    <>
      {actions.map(ab => (
        <IconButton
          key={ab.icon}
          style={{margin: 1, borderRadius: 0, backgroundColor: ab.color}}
          size={40}
          icon={ab.icon}
          onLongPress={() => {
            switch (ab.icon) {
              case 'camera':
                takePic('video');
                onBack();
                break;
              default:
            }
          }}
          onPress={() => {
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
                takePic('photo');
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
