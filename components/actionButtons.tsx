import React from 'react';
import {View, BackHandler} from 'react-native';
import {FAB, IconButton} from 'react-native-paper';

import { ThemeContext, ThemeContextType } from '../context/theme';
import { MessageEditorContext, MessageEditorContextType } from '../context/messageEditor';
import { OnlyShow, Show } from '../components/helper';
import { openCamera } from '../src/camera';

export const ExtendedActionButtons = ({onBack}:{onBack: ()=>void}) => {
  const {setComposeOn, onStartRecord, showTextInputOn, onAddAttachments, saveComposeMessage, message} = React.useContext(MessageEditorContext) as MessageEditorContextType;
  const actions = [
      { color: '#d4d4d4', icon: 'microphone'},
      { color: '#b4b4b4', icon: 'attachment'},
      { color: '#909090', icon: 'camera'},
      { color: '#636363', icon: 'pencil'},
  ]

  const pencilClicked = () => {
      setComposeOn(true);
      showTextInputOn(true);
  }

  const backAction = () => {
      onBack();
      return true;
  }

  const takePic = (mode: 'video' | 'photo') => {
      openCamera(mode)
      .then(img=> {
          saveComposeMessage({
              ...message,
              files: [...message.files, img],
          });
          setComposeOn(true);
      })
      .catch( e => console.warn("camera error " + e));
  }

  React.useEffect(()=>{
      BackHandler.addEventListener('hardwareBackPress', backAction);
      return ()=> BackHandler.removeEventListener('hardwareBackPress', backAction);
  },[])

  return <>
      {actions.map(ab => <IconButton
              key={ab.icon}
              style={{margin: 1, borderRadius: 0, backgroundColor: ab.color}}
              size={40}
              icon={ab.icon}
              onLongPress={()=>{
                  switch( ab.icon){
                      case 'camera':
                          takePic('video');
                          onBack();
                          break;
                      default:
                  }
              }}
              onPress={()=>{
                  switch( ab.icon){
                      case 'microphone':
                          onStartRecord();
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
                          console.warn("TODO implement action")
                  }
                  onBack();
              }}
          />
      )}
  </>
}

export const FloatingActions = () => {
  const {theme} = React.useContext(ThemeContext) as ThemeContextType;
  const [expanded, setExpanded] = React.useState(false);
  const {composing, setComposeOn, vrState, showTextInputOn} = React.useContext(MessageEditorContext) as MessageEditorContextType;
  
  const pencilClicked = () => {
      setComposeOn(true);
      showTextInputOn(true);
  }

  return (
  <OnlyShow If={!(composing || vrState.recording)}>
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
        }}
    >
        <Show
            component={
                <FAB
                    style={{margin: 3, borderRadius: 0, backgroundColor: theme.color.userSecondary}}
                    icon="pencil"
                    onLongPress={()=>setExpanded(true)}
                    onPress={pencilClicked}
                />
            }
            If={!expanded}
            ElseShow={<ExtendedActionButtons onBack={()=>setExpanded(false)}/>}
        />
    </View>
  </OnlyShow>
  );
}