import {FlatList} from 'react-native';
import {Dialog, IconButton, Portal} from 'react-native-paper';
import {useTheme} from '../context/theme';
import {useLoggedInUser} from '../context/user';
import {Message} from '../types/message';
import {FilePreviewCard} from './FilePreviewCard';
import { VisualPreview } from './VisualPreview';

function MessageFilesPreview({
  msg,
  onDismiss,
}: {
  msg: Message;
  onDismiss: () => void;
}) {
  const {user} = useLoggedInUser();
  const {theme} = useTheme();
  const fromUser = msg.from === user?.handle;
  return (
    <Portal>
      <Dialog
        style={{
          backgroundColor: fromUser
            ? theme.color.userPrimary
            : theme.color.friendPrimary,
        }}
        visible={true}
        onDismiss={onDismiss}>
        <Dialog.Title>all attachments</Dialog.Title>
        <Dialog.Content style={{maxHeight: 700}}>
          <FlatList
            data={msg.files.map((f, i) => {
              return {
                id: `${i}`,
                title: f.uri,
              };
            })}
            renderItem={({item}) => {
              const f = msg.files[Number(item.id)] ?? {type: '', uri: ''};
              switch (f.type.split('/')[0]) {
                case 'image':
                case 'video':
                  return <VisualPreview key={f.uri} mFile={f}/>
                default:
                  return (
                    <FilePreviewCard
                      user={fromUser}
                      file={{...f, size: f.size ?? 0, name: f.name ?? ''}}
                    />
                  );
              }
            }}
            keyExtractor={(item: {id: string; title: string}) => item.title}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <IconButton icon="close" onPress={onDismiss} />
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

export {MessageFilesPreview};
