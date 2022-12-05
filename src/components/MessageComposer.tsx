/* eslint-disable require-await */
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Card, TextInput} from 'react-native-paper';

import {useMessageComposer} from '../context/messageEditor';
import {useTheme} from '../context/theme';
import {useLoggedInUser} from '../context/user';
import {useChats} from '../context/chat';
import {HorizontalView} from './Helpers/HorizontalView';
import {useAudioRecorderPlayer} from '../providers/AudioRecorderPlayer';
import {OnlyShow} from './Helpers/OnlyShow';
import {FileManager} from '../services/FileManager';
import {AttachmentsPreview} from './MessageCard/AttachmentsPreview';
import {Remote} from '../services/Remote';
import {AsyncIconButton} from './UserProfile/AsyncIconButton';
import {MutexContextProvider, useMutex} from '../providers/MutexProvider';

const EditorActions = () => {
  const {userProfile} = useLoggedInUser();
  const {addChatMessages, activeChat} = useChats();

  const {
    composeMsg,
    saveComposeMsg,
    saveComposeState,
    composeState,
    addAttachments,
  } = useMessageComposer();
  const {startRecorder} = useAudioRecorderPlayer();

  const interlocutor = activeChat()?.user;

  const openCamInMode = (mode: 'video' | 'photo') => {
    FileManager.getCameraMedia(mode)
      .then(vidOrPic => {
        vidOrPic &&
          saveComposeMsg(msg => {
            if (msg) {
              return {
                ...msg,
                files: [...msg.files, vidOrPic],
              };
            } else {
              return {
                from: userProfile.handle,
                to: interlocutor.handle,
                id: new Date().getTime(),
                files: [vidOrPic],
                voiceRecordings: [],
              };
            }
          });
      })
      .catch(e => console.warn('camera error', e));
  };

  const saveDraft = async () => {
    composeMsg &&
      addChatMessages([
        {
          ...composeMsg,
          id: new Date().getTime(),
          from: userProfile.handle ?? '',
          to: activeChat()?.user.handle ?? '',
          draft: true,
        },
      ]);
    saveComposeMsg(_ => undefined);
  };

  const sendMessage = async () => {
    if (composeMsg) {
      const msgRes = await Remote.sendMessage(
        userProfile.token,
        userProfile.handle,
        {
          ...composeMsg,
          from: userProfile.handle,
          to: interlocutor.handle,
        },
      );
      if (msgRes) {
        saveComposeMsg(_ => undefined);
        addChatMessages([msgRes]);
      } else {
        throw new Error('failed to send message draft');
      }
    }
  };

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <HorizontalView style={{justifyContent: 'space-between'}}>
      <HorizontalView>
        <AsyncIconButton
          icon="content-save-edit"
          disabled={!composeMsg?.text && !composeMsg?.files.length}
          onPress={saveDraft}
        />
        <AsyncIconButton
          icon="delete"
          onPress={async () => saveComposeMsg(_ => undefined)}
        />
      </HorizontalView>

      <HorizontalView>
        <AsyncIconButton
          icon="emoticon-excited-outline"
          onPress={async () => {}}
        />
        <AsyncIconButton
          icon="microphone"
          onPress={async () => startRecorder()}
        />
        <AsyncIconButton
          icon="attachment"
          onPress={async () => addAttachments()}
        />
        <AsyncIconButton
          icon="camera"
          onPress={async () => openCamInMode('photo')}
        />
        <AsyncIconButton
          icon="video"
          onPress={async () => openCamInMode('video')}
        />
        <AsyncIconButton
          icon={composeState.inputTextEnabled ? 'pencil-minus' : 'pencil-plus'}
          onPress={async () => {
            saveComposeMsg(msg => {
              if (msg) {
                return {
                  ...msg,
                  text: undefined,
                };
              }
            });
            saveComposeState(cs => {
              return {
                ...cs,
                inputTextEnabled: !cs.inputTextEnabled,
              };
            });
          }}
        />
      </HorizontalView>

      <AsyncIconButton
        icon="send"
        onPress={sendMessage}
        disabled={
          !(
            composeMsg?.text ||
            composeMsg?.files.length ||
            composeMsg?.voiceRecordings.length
          )
        }
      />
    </HorizontalView>
  );
};

export const MessageEditorCard = () => {
  const {theme} = useTheme();
  const {activeChat} = useChats();

  const {composeMsg, saveComposeMsg, composeState} = useMessageComposer();

  const interlocutor = activeChat()?.user;

  if (!interlocutor) {
    return <></>;
  }

  const styles = StyleSheet.create({
    editorContainer: {
      backgroundColor: theme.color.userPrimary,
      margin: 2,
      paddingBottom: 5,
    },
    editorBody: {padding: 10},
    fullWidth: {width: '100%'},
  });

  const saveMessageTxt = (text: string) => {
    saveComposeMsg(msg => {
      if (msg) {
        return {
          ...msg,
          text: text,
        };
      }
    });
  };

  const EditorTextInput = () => {
    const {slots} = useMutex();
    return (
      <OnlyShow If={!!composeMsg && composeState.inputTextEnabled}>
        <TextInput
          defaultValue={composeMsg?.text}
          onEndEditing={e => saveMessageTxt(e.nativeEvent.text)}
          disabled={!slots}
          multiline
          numberOfLines={6}
          style={styles.fullWidth}
          label="message body"
        />
      </OnlyShow>
    );
  };

  return (
    <OnlyShow If={!!composeMsg}>
      <MutexContextProvider>
        <Card style={styles.editorContainer}>
          <View style={styles.editorBody}>
            <EditorActions />
            <EditorTextInput />
            {composeMsg && <AttachmentsPreview msg={composeMsg} composing />}
          </View>
        </Card>
      </MutexContextProvider>
    </OnlyShow>
  );
};
