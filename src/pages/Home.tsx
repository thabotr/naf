import React from 'react';
import {Button, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {IconButton, Surface, Text} from 'react-native-paper';
import PageBackground from '../shared/components/PageBackground';
import {ThemeType, useThemedStyles} from '../shared/providers/theme';
import globalStyles from '../shared/styles';
import {Chat} from '../types/chat';

type Props = {
  chats: Chat[];
  onOpenPreferences: () => void;
  onOpenUserProfile: () => void;
};

const ChatPreviewCard = ({chat}: {chat: Chat}) => {
  return (
    <Button
      title={`Message ${chat.user.handle}`}
      accessibilityLabel={`chat ${chat.user.handle}`}
    />
  );
};

export default ({chats, onOpenPreferences, onOpenUserProfile}: Props) => {
  const styles = useThemedStyles(styleSheet);
  return (
    <PageBackground pageLabel="home page">
      <Surface accessibilityLabel="home navigation bar" style={styles.navbar}>
        <IconButton
          icon="menu"
          accessibilityLabel="open preferences"
          onPress={onOpenPreferences}
          style={globalStyles.square}
        />
        <TouchableOpacity
          onPress={onOpenUserProfile}
          accessibilityLabel="open user profile"
          style={globalStyles.avatarDimensions}
          activeOpacity={0.5}
          children={<Text>Open User Profile</Text>}
        />
      </Surface>
      <FlatList
        data={chats}
        renderItem={({item}) => <ChatPreviewCard chat={item} />}
      />
    </PageBackground>
  );
};

const styleSheet = (theme: ThemeType) =>
  StyleSheet.create({
    navbar: {
      ...globalStyles.horizontal,
      backgroundColor: theme.color.primary,
      justifyContent: 'space-between',
      paddingRight: 15,
    },
  });
