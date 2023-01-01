import React from 'react';
import {FlatList, TouchableOpacity} from 'react-native';
import {IconButton, Surface, Text} from 'react-native-paper';
import PageBackground from '../../shared/components/PageBackground';
import {useThemedStyles} from '../../shared/providers/theme';
import globalStyles, {globalThemedStyles} from '../../shared/styles';
import {Chat} from '../../types/chat';

type Props = {
  chats: Chat[];
  onOpenPreferences: () => void;
  onOpenMyProfile: () => void;
  onOpenChat: (chat: Chat) => void;
};

const ChatPreviewCard = ({
  chat,
  onOpenChat,
}: {
  chat: Chat;
  onOpenChat: (chat: Chat) => void;
}) => {
  return (
    <TouchableOpacity
      children={<Text>Message {chat.user.handle}</Text>}
      accessibilityLabel={`open chat ${chat.user.handle}`}
      onPress={() => onOpenChat(chat)}
      style={globalStyles.card}
    />
  );
};

export default ({
  chats,
  onOpenPreferences,
  onOpenMyProfile,
  onOpenChat,
}: Props): JSX.Element => {
  const styles = useThemedStyles(globalThemedStyles);
  return (
    <PageBackground accessibilityLabel="home page">
      <Surface accessibilityLabel="home navigation bar" style={styles.navbar}>
        <IconButton
          icon="menu"
          accessibilityLabel="open preferences"
          onPress={onOpenPreferences}
          style={globalStyles.square}
        />
        <TouchableOpacity
          onPress={onOpenMyProfile}
          accessibilityLabel="open my profile"
          style={globalStyles.avatarDimensions}
          activeOpacity={0.5}
          children={<Text>Open User Profile</Text>}
        />
      </Surface>
      <FlatList
        data={chats}
        renderItem={({item}) => (
          <ChatPreviewCard chat={item} onOpenChat={onOpenChat} />
        )}
      />
    </PageBackground>
  );
};
