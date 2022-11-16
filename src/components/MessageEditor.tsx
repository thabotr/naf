import React from 'react';
import {
  Card,
  Chip,
  IconButton,
  List,
  Dialog,
  Paragraph,
  TextInput,
  Portal,
  Checkbox,
} from 'react-native-paper';
import {View, FlatList} from 'react-native';

import {useMessageComposer} from '../context/messageEditor';
import {useTheme} from '../context/theme';
import {FilePreviewCard, VisualPreview} from './message';
import {OnlyShow} from './helper';
import {VoiceNoteCard} from './voiceNote';
import {openCamera} from '../camera';
import {useLoggedInUser} from '../context/user';
import {useChats} from '../context/chat';
import { HorizontalView } from './HorizontalView';

export const MessageEditorCard = () => {
  const {user} = useLoggedInUser();
  const {theme} = useTheme();
  const {addChatMessages, activeChat} = useChats();
  
  const {
    composing,
    onStartRecord,
    discardMessage,
    showTextInput,
    showTextInputOn,
    onAddAttachments,
    message,
    saveComposeMessage,
    setComposeOn,
  } = useMessageComposer();

  const [previewingFiles, setPreviewingFiles] = React.useState(false);

  const openCamInMode = (mode: 'video' | 'photo') => {
    openCamera(mode)
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

  function FilesPreviewDialog() {
    const [selectedFiles, setSelectedFiles] = React.useState<boolean[]>(
      message.files.map(_ => false),
    );
    const withCheckbox = (fIndex: number, card: React.ReactNode) => {
      return (
        <HorizontalView style={{alignItems: 'center'}}>
          {card}
          <Checkbox
            status={selectedFiles[fIndex] ? 'checked' : 'unchecked'}
            onPress={() =>
              setSelectedFiles(
                selectedFiles
                  .slice(0, fIndex)
                  .concat([!selectedFiles[fIndex]])
                  .concat(selectedFiles.slice(fIndex + 1)),
              )
            }
          />
        </HorizontalView>
      );
    };

    return (
      <OnlyShow If={previewingFiles}>
        <Portal>
          <Dialog
            onDismiss={() => setPreviewingFiles(false)}
            visible={previewingFiles}>
            <Dialog.Title>all attachments</Dialog.Title>
            <Dialog.Content style={{maxHeight: 700}}>
              <FlatList
                data={message.files.map((f, i) => {
                  return {
                    id: `${i}`,
                    title: f.uri,
                  };
                })}
                renderItem={({item}) => {
                  const f = message.files[Number(item.id)] ?? {
                    type: '',
                    uri: '',
                  };
                  switch (f.type.split('/')[0]) {
                    case 'image':
                    case 'video':
                      return withCheckbox(
                        Number(item.id),
                        <VisualPreview mFile={f} />,
                      );
                    default:
                      return withCheckbox(
                        Number(item.id),
                        <FilePreviewCard
                          user
                          file={{...f, size: f.size ?? 0, name: f.name ?? ''}}
                        />,
                      );
                  }
                }}
                keyExtractor={(item: {id: string; title: string}) => item.title}
              />
            </Dialog.Content>
            <Dialog.Actions
              style={{display: 'flex', justifyContent: 'space-between'}}>
              <IconButton
                icon="close"
                onPress={() => setPreviewingFiles(false)}
              />
              <IconButton
                icon="delete"
                disabled={!selectedFiles.find(e => e)}
                onPress={() =>
                  saveComposeMessage({
                    ...message,
                    files: message.files.filter((f, i) => !selectedFiles[i]),
                  })
                }
              />
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </OnlyShow>
    );
  }

  const editorActions = () => {
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
                  timestamp: timestamp/1_000,
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
          <IconButton icon="microphone" onPress={onStartRecord} />
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

  const editorTextInput = () => {
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
          autoFocus
          multiline
          numberOfLines={6}
          style={{width: '100%'}}
          label="message body"
        />
      </OnlyShow>
    );
  };

  const visuals = message.files.filter(
    f => f.type.split('/')[0] === 'image' || f.type.split('/')[0] === 'video',
  );
  const others = message.files.filter(
    f =>
      !(f.type.split('/')[0] === 'image' || f.type.split('/')[0] === 'video'),
  );

  const nonvisualAttachments = () => {
    return (
      <OnlyShow If={others.length > 0}>
        <View style={{display: 'flex', flexDirection: 'row'}}>
          <List.Section style={{width: '100%', padding: 0, margin: 0}}>
            <List.Subheader>Other attachments</List.Subheader>
            <HorizontalView
              style={{flexWrap: 'wrap', justifyContent: 'space-between'}}>
              {others.slice(0, 2).map(f => (
                <FilePreviewCard key={f.uri} file={f} />
              ))}
            </HorizontalView>
            <OnlyShow If={!!message.files.length}>
              <Chip
                onPress={() => setPreviewingFiles(true)}
                style={{
                  borderRadius: 0,
                  margin: 2,
                  backgroundColor: theme.color.userSecondary,
                }}
                icon="file-multiple">
                <Paragraph>
                  Preview/edit all {message.files.length} attachaments
                </Paragraph>
              </Chip>
            </OnlyShow>
          </List.Section>
        </View>
      </OnlyShow>
    );
  };

  return (
    <OnlyShow If={composing}>
      <FilesPreviewDialog />
      <Card
        style={{
          backgroundColor: theme.color.userPrimary,
          margin: 2,
          paddingBottom: 5,
        }}>
        <View style={{padding: 10}}>
          {editorActions()}
          {editorTextInput()}
          {message.voiceRecordings.map(r => (
            <HorizontalView style={{alignItems: 'center'}} key={r.uri}>
              <VoiceNoteCard style={{flex: 1}} file={r} user={true} />
              <IconButton
                style={{
                  backgroundColor: theme.color.secondary,
                  borderRadius: 0,
                }}
                icon="delete"
                onPress={() =>
                  saveComposeMessage({
                    ...message,
                    voiceRecordings: message.voiceRecordings.filter(
                      v => v.uri !== r.uri,
                    ),
                  })
                }
              />
            </HorizontalView>
          ))}

          <HorizontalView>
            {visuals.slice(0, 4).map(f => (
              <VisualPreview key={f.uri} mFile={f} />
            ))}
          </HorizontalView>

          {nonvisualAttachments()}
        </View>
      </Card>
    </OnlyShow>
  );
};
