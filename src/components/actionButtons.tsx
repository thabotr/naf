import React from 'react';
import {View, BackHandler} from 'react-native';
import {FAB, IconButton} from 'react-native-paper';

import {useTheme} from '../context/theme';
import {useMessageComposer} from '../context/messageEditor';
import {OnlyShow, Show} from './helper';
import {openCamera} from '../camera';
import { RecordPlayState, useAudioRecorderPlayer } from '../providers/AudioRecorderPlayer';

export const ExtendedActionButtons = ({onBack}: {onBack: () => void}) => {
  const {
    setComposeOn,
    // onStartRecord,
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

export const FloatingActions = () => {
  const {theme} = useTheme();
  const [expanded, setExpanded] = React.useState(false);
  const {composing, setComposeOn, showTextInputOn} =
    useMessageComposer();
  const {recorderPlayerState} = useAudioRecorderPlayer();

  const pencilClicked = () => {
    setComposeOn(true);
    showTextInputOn(true);
  };

  const recordingOrPaused = recorderPlayerState === RecordPlayState.RECORDING ||
    recorderPlayerState === RecordPlayState.RECORDING_PAUSED;

  return (
    <OnlyShow If={!composing && !recordingOrPaused}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          padding: 0,
          elevation: 2,
          borderRadius: 3,
          position: 'absolute',
          right: 10,
          bottom: 50,
          backgroundColor: theme.color.userPrimary,
        }}>
        <Show
          component={
            <FAB
              style={{
                margin: 3,
                borderRadius: 0,
                backgroundColor: theme.color.userSecondary,
              }}
              icon="pencil"
              onLongPress={() => setExpanded(true)}
              onPress={pencilClicked}
            />
          }
          If={!expanded}
          ElseShow={<ExtendedActionButtons onBack={() => setExpanded(false)} />}
        />
      </View>
    </OnlyShow>
  );
};
