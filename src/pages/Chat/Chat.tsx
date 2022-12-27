import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {IconButton, Surface} from 'react-native-paper';
import PageBackground from '../../shared/components/PageBackground';
import {useThemedStyles} from '../../shared/providers/theme';
import globalStyles, {globalThemedStyles} from '../../shared/styles';
import {Chat} from '../../types/chat';

type Props = {
  onBackToHome?: () => void;
  chat?: Chat;
  onOpenChatProfile?: () => void;
};

export default function ({onBackToHome, chat, onOpenChatProfile}: Props) {
  const styles = useThemedStyles(globalThemedStyles);
  return (
    <PageBackground pageLabel={`chat ${chat?.user.handle} page`}>
      <Surface accessibilityLabel="chat navigation bar" style={styles.navbar}>
        <IconButton
          icon="arrow-left"
          accessibilityLabel="back to home"
          onPress={onBackToHome}
          style={globalStyles.square}
        />
        <TouchableOpacity
          onPress={onOpenChatProfile}
          accessibilityLabel="open chat profile"
          style={globalStyles.avatarDimensions}
          activeOpacity={0.5}
          children={<Text>Open Chat Profile</Text>}
        />
      </Surface>
    </PageBackground>
  );
}
