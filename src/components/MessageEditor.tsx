import React from 'react';
import {Card, IconButton, TextInput} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';

import {useMessageComposer} from '../context/messageEditor';
import {useTheme} from '../context/theme';
import {useLoggedInUser} from '../context/user';
import {useChats} from '../context/chat';
import {HorizontalView} from './Helpers/HorizontalView';
import {useAudioRecorderPlayer} from '../providers/AudioRecorderPlayer';
import {OnlyShow} from './Helpers/OnlyShow';
import {FileManager} from '../services/FileManager';
import {AttachmentsPreview} from './MessageCard/AttachmentsPreview';

export const MessageEditorCard = () => {
  const {user} = useLoggedInUser();
  const {theme} = useTheme();
  const {addChatMessages, activeChat} = useChats();

  const {
    composing,
    discardMessage,
    showTextInput,
    showTextInputOn,
    onAddAttachments,
    message,
    saveComposeMessage,
    setComposeOn,
  } = useMessageComposer();
  const {startRecorder} = useAudioRecorderPlayer();

  const openCamInMode = (mode: 'video' | 'photo') => {
    FileManager.getCameraMedia(mode)
      .then(vidOrPic => {
        vidOrPic &&
          saveComposeMessage({
            ...message,
            files: [...message.files, vidOrPic],
          });
        setComposeOn(true);
      })
      .catch(e => console.warn('camera error', e));
  };

  const EditorActions = () => {
    return (
      <HorizontalView style={{justifyContent: 'space-between'}}>
        <HorizontalView>
          <IconButton
            icon="content-save-edit"
            disabled={!message.text && !message.files.length}
            onPress={() => {
              const timestamp = new Date().getTime();
              addChatMessages([
                {
                  ...message,
                  id: timestamp.toString(),
                  from: user?.handle ?? '',
                  to: activeChat()?.user.handle ?? '',
                  draft: true,
                  timestamp: timestamp / 1_000,
                },
              ]);
              discardMessage();
            }}
          />
          <IconButton
            icon="delete"
            onPress={() => {
              discardMessage();
            }}
          />
        </HorizontalView>

        <HorizontalView>
          <IconButton icon="emoticon-excited-outline" onPress={() => {}} />
          <IconButton icon="microphone" onPress={startRecorder} />
          <IconButton icon="attachment" onPress={onAddAttachments} />
          <IconButton icon="camera" onPress={() => openCamInMode('photo')} />
          <IconButton icon="video" onPress={() => openCamInMode('video')} />
          <IconButton
            icon={showTextInput ? 'pencil-minus' : 'pencil-plus'}
            onPress={() => {
              if (showTextInput) {
                saveComposeMessage({
                  ...message,
                  text: undefined,
                });
              }
              showTextInputOn(!showTextInput);
            }}
          />
        </HorizontalView>

        <IconButton icon="send" onPress={() => {}} />
      </HorizontalView>
    );
  };

  const EditorTextInput = () => {
    return (
      <OnlyShow If={composing && showTextInput}>
        <TextInput
          defaultValue={message.text}
          onEndEditing={e => {
            saveComposeMessage({
              ...message,
              text: e.nativeEvent.text,
            });
          }}
          multiline
          numberOfLines={6}
          style={{width: '100%'}}
          label="message body"
        />
      </OnlyShow>
    );
  };

  const styles = StyleSheet.create({
    editorContainer: {
      backgroundColor: theme.color.userPrimary,
      margin: 2,
      paddingBottom: 5,
    },
    editorBody: {padding: 10},
  });

  return (
    <OnlyShow If={composing}>
      <Card style={styles.editorContainer}>
        <View style={styles.editorBody}>
          <EditorActions />
          <EditorTextInput />
          <AttachmentsPreview msg={message} composing />
        </View>
      </Card>
    </OnlyShow>
  );
};
