import React from 'react';
import {FlatList, StyleSheet} from 'react-native';
import {Dialog, IconButton, Portal} from 'react-native-paper';
import {useTheme} from '../../context/theme';
import {useLoggedInUser} from '../../context/user';
import {FileType, Message} from '../../types/message';
import {FilePreviewCard} from './FilePreviewCard';
import {HorizontalView} from '../Helpers/HorizontalView';
import {OnlyShow} from '../Helpers/OnlyShow';
import {Show} from '../Helpers/Show';
import {VisualPreview} from './VisualPreview';

function ViewAllFilesDialog({
  msg,
  onDismiss,
  composing,
  visible,
}: {
  msg: Message;
  onDismiss: (files: FileType[]) => void;
  composing?: boolean;
  visible: boolean;
}) {
  const {user} = useLoggedInUser();
  const {theme} = useTheme();
  const fromUser = msg.from === user?.handle;
  const [files, setFiles] = React.useState(() => msg.files);

  React.useEffect(() => {
    setFiles(msg.files);
  }, [visible]);

  const styles = StyleSheet.create({
    dialogContainer: {
      backgroundColor: fromUser
        ? theme.color.userPrimary
        : theme.color.friendPrimary,
    },
    dialogBody: {maxHeight: 700},
    listElementContainer: {alignItems: 'center'},
    squareButton: {borderRadius: 0},
    dialogFooter: {display: 'flex', justifyContent: 'space-between'},
  });

  return (
    <Portal>
      <Dialog
        style={styles.dialogContainer}
        visible={visible}
        onDismiss={() => onDismiss}>
        <Dialog.Title>all attachments</Dialog.Title>
        <Dialog.Content style={styles.dialogBody}>
          <FlatList
            data={files.map((f, i) => {
              return {
                id: f.uri,
                title: f.uri,
              };
            })}
            renderItem={({item}) => {
              const f = files.find(fs => fs.uri === item.id);
              if (!f) {
                return <></>;
              }
              const visual =
                f.type.split('/')[0] === 'image' ||
                f.type.split('/')[0] === 'video';
              return (
                <HorizontalView style={styles.listElementContainer}>
                  <Show
                    component={<VisualPreview key={f.uri} mFile={f} />}
                    If={visual}
                    ElseShow={
                      <FilePreviewCard
                        user={fromUser}
                        file={{...f, size: f.size ?? 0, name: f.name ?? ''}}
                      />
                    }
                  />
                  <OnlyShow If={composing}>
                    <IconButton
                      icon="delete"
                      onPress={() =>
                        setFiles(files =>
                          files.filter(fs => fs.uri !== item.title),
                        )
                      }
                      style={styles.squareButton}
                    />
                  </OnlyShow>
                </HorizontalView>
              );
            }}
            keyExtractor={(item: {id: string; title: string}) => item.title}
          />
        </Dialog.Content>
        <Dialog.Actions style={styles.dialogFooter}>
          <IconButton icon="chevron-down" onPress={() => onDismiss(files)} />
          <OnlyShow If={composing}>
            <IconButton
              icon="delete-restore"
              onPress={() => setFiles(msg.files)}
            />
          </OnlyShow>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

export {ViewAllFilesDialog};
