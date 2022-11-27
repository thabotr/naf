import {View} from 'react-native';
import {IconButton} from 'react-native-paper';
import {useChats} from '../../context/chat';
import {useMessageComposer} from '../../context/messageEditor';
import {useTheme} from '../../context/theme';
import {Message} from '../../types/message';
import {OnlyShow} from '../Helpers/OnlyShow';
import {OverlayedView} from '../Helpers/OverlayedView';

function DraftMessageActionsOverlay({msg}: {msg: Message}) {
  const {theme} = useTheme();
  const {deleteChatMessages, addChatMessages} = useChats();
  const {saveComposeMsg} =
    useMessageComposer();

  const deleteDraft = () => {
    deleteChatMessages([{fromHandle: msg.from, id: msg.id, toHandle: msg.to}]);
  };

  const editDraft = () => {
    saveComposeMsg(_=>msg);
    deleteDraft();
  };

  const sendDraft = () => {
    // TODO sync with remote
    addChatMessages([
      {
        ...msg,
        id: new Date().getTime(),
        draft: undefined,
      },
    ]);
    deleteDraft();
  };

  const Button = (props: {icon: string; onPress: () => void}) => {
    return (
      <IconButton
        size={30}
        style={{
          backgroundColor: theme.color.userPrimary,
          borderRadius: 0,
          margin: 0,
        }}
        icon={props.icon}
        onPress={props.onPress}
      />
    );
  };

  return (
    <OnlyShow If={msg.draft}>
      <OverlayedView
        style={{
          backgroundColor: theme.color.userSecondary,
          margin: 3,
          borderRadius: 3,
          opacity: 0.8,
        }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            backgroundColor: theme.color.primary,
          }}>
          <Button icon="delete" onPress={deleteDraft} />
          <Button icon="pencil" onPress={editDraft} />
          <Button icon="send" onPress={sendDraft} />
        </View>
      </OverlayedView>
    </OnlyShow>
  );
}

export {DraftMessageActionsOverlay};
