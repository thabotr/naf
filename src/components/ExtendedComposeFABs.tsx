import React from 'react';
import { BackHandler } from 'react-native';
import { IconButton } from 'react-native-paper';
import { openCamera } from "../camera";
import { useMessageComposer } from "../context/messageEditor";
import { useAudioRecorderPlayer } from "../providers/AudioRecorderPlayer";

const ExtendedComposeFABs = ({onBack}: {onBack: () => void}) => {
  const {
    setComposeOn,
    showTextInputOn,
    onAddAttachments,
    saveComposeMessage,
    message,
  } = useMessageComposer();
  const {startRecorder} = useAudioRecorderPlayer();
  const actions = [
    {color: '#d4d4d4', icon: 'microphone'},
    {color: '#b4b4b4', icon: 'attachment'},
    {color: '#909090', icon: 'camera'},
    {color: '#636363', icon: 'pencil'},
  ];

  const pencilClicked = () => {
    setComposeOn(true);
    showTextInputOn(true);
  };

  const backAction = () => {
    onBack();
    return true;
  };

  const takePic = (mode: 'video' | 'photo') => {
    openCamera(mode)
      .then(pic => {
        pic &&
          saveComposeMessage({
            ...message,
            files: [...message.files, pic],
          });
        setComposeOn(true);
      })
      .catch(e => console.warn('camera error', e));
  };

  React.useEffect(() => {
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
                onAddAttachments();
                break;
              case 'camera':
                takePic('photo');
                break;
              default:
                console.warn('TODO implement action');
            }
            onBack();
          }}
        />
      ))}
    </>
  );
};

export {ExtendedComposeFABs};