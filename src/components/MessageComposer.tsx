import React from 'react';
import {Card, IconButton as Button, TextInput} from 'react-native-paper';
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
import {deduplicatedConcat} from '../utils/deduplicatedConcat';

const EditorActions = () => {
  const {user} = useLoggedInUser();
  const {addChatMessages, activeChat} = useChats();

  const {composeMsg, saveComposeMsg, saveComposeState, composeState} =
    useMessageComposer();
  const {startRecorder} = useAudioRecorderPlayer();

  const interlocutor = activeChat()?.user;

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
                from: user.handle,
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

  const styles = StyleSheet.create({
    squareButton: {borderRadius: 0},
  });

  const IconButton = ({
    icon,
    onPress,
    disabled,
  }: {
    icon: string;
    onPress: () => void;
    disabled?: boolean;
  }) => {
    return (
      <Button
        icon={icon}
        onPress={onPress}
        disabled={disabled}
        style={styles.squareButton}
      />
    );
  };

  return (
    <HorizontalView style={{justifyContent: 'space-between'}}>
      <HorizontalView>
        <IconButton
          icon="content-save-edit"
          disabled={!composeMsg?.text && !composeMsg?.files.length}
          onPress={() => {
            composeMsg &&
              addChatMessages([
                {
                  ...composeMsg,
                  id: new Date().getTime(),
                  from: user?.handle ?? '',
                  to: activeChat()?.user.handle ?? '',
                  draft: true,
                },
              ]);
            saveComposeMsg(_ => undefined);
          }}
        />
        <IconButton
          icon="delete"
          onPress={() => saveComposeMsg(_ => undefined)}
        />
      </HorizontalView>

      <HorizontalView>
        <IconButton icon="emoticon-excited-outline" onPress={() => {}} />
        <IconButton icon="microphone" onPress={startRecorder} />
        <IconButton icon="attachment" onPress={addAttachments} />
        <IconButton icon="camera" onPress={() => openCamInMode('photo')} />
        <IconButton icon="video" onPress={() => openCamInMode('video')} />
        <IconButton
          icon={composeState.inputTextEnabled ? 'pencil-minus' : 'pencil-plus'}
          onPress={() => {
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

      <IconButton icon="send" onPress={() => {}} />
    </HorizontalView>
  );
};

export const MessageEditorCard = () => {
  const {user} = useLoggedInUser();
  const {theme} = useTheme();
  const {activeChat} = useChats();

  const {composeMsg, saveComposeMsg, composeState} = useMessageComposer();

  const interlocutor = activeChat()?.user;

  if (!user || !interlocutor) {
    return <></>;
  }

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
    return (
      <OnlyShow If={!!composeMsg && composeState.inputTextEnabled}>
        <TextInput
          defaultValue={composeMsg?.text}
          onEndEditing={e => saveMessageTxt(e.nativeEvent.text)}
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
    <OnlyShow If={!!composeMsg}>
      <Card style={styles.editorContainer}>
        <View style={styles.editorBody}>
          <EditorActions />
          <EditorTextInput />
          {composeMsg && <AttachmentsPreview msg={composeMsg} composing />}
        </View>
      </Card>
    </OnlyShow>
  );
};
