/* eslint-disable require-await */
import React from 'react';
import {StyleSheet} from 'react-native';
import {useChats} from '../../context/chat';
import {useMessageComposer} from '../../context/messageEditor';
import {useTheme} from '../../context/theme';
import {useLoggedInUser} from '../../context/user';
import {MutexContextProvider} from '../../providers/MutexProvider';
import {Remote} from '../../services/Remote';
import {Message} from '../../types/message';
import {HorizontalView} from '../Helpers/HorizontalView';
import {OnlyShow} from '../Helpers/OnlyShow';
import {OverlayedView} from '../Helpers/OverlayedView';
import {AsyncIconButton} from '../UserProfile/AsyncIconButton';

function DraftMessageActionsOverlay({msg}: {msg: Message}) {
  const {theme} = useTheme();
  const {deleteChatMessages, addChatMessages} = useChats();
  const {userProfile} = useLoggedInUser();

  const {saveComposeMsg} = useMessageComposer();

  const deleteDraft = async () => {
    deleteChatMessages([{fromHandle: msg.from, id: msg.id, toHandle: msg.to}]);
  };

  const editDraft = async () => {
    saveComposeMsg(_ => msg);
    deleteDraft();
  };

  const sendDraft = async () => {
    const msgRes = await Remote.sendMessage(
      userProfile.token,
      userProfile.handle,
      msg,
    );
    if (msgRes) {
      addChatMessages([msgRes]);
      deleteDraft();
    } else {
      throw new Error('failed to send message draft');
    }
  };

  const styles = StyleSheet.create({
    overlay: {
      backgroundColor: theme.color.userSecondary,
      margin: 3,
      borderRadius: 3,
      opacity: 0.8,
    },
  });

  return (
    <OnlyShow If={msg.draft}>
      <OverlayedView style={styles.overlay}>
        <HorizontalView
          style={{
            backgroundColor: theme.color.primary,
          }}>
          <MutexContextProvider>
            <AsyncIconButton icon="delete" onPress={deleteDraft} />
            <AsyncIconButton icon="pencil" onPress={editDraft} />
            <AsyncIconButton icon="send" onPress={sendDraft} />
          </MutexContextProvider>
        </HorizontalView>
      </OverlayedView>
    </OnlyShow>
  );
}

export {DraftMessageActionsOverlay};
