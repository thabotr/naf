import React, {useState} from 'react';
import {FlatList, Text, TouchableOpacity} from 'react-native';
import {Surface} from 'react-native-paper';
import FloatBottomRight from '../../shared/components/FloatBottomRight';
import IconButton from '../../shared/components/IconButton';
import PageBackground from '../../shared/components/PageBackground';
import Show from '../../shared/components/Show';
import {useThemedStyles} from '../../shared/providers/theme';
import globalStyles, {globalThemedStyles} from '../../shared/styles';
import {Chat} from '../../types/chat';
import MessageComposer from './MessageComposer';
import MessageDisplay from './MessageDisplay';
import {Message} from './types/Message';

type Props = {
  onBackToHome: () => void;
  chat: Chat;
  onOpenChatProfile: () => void;
  onSendMessage: (message: Partial<Message>) => void;
  messages: Message[];
};

export default function ({
  onBackToHome,
  chat,
  onOpenChatProfile,
  onSendMessage,
  messages,
}: Props): JSX.Element {
  const styles = useThemedStyles(globalThemedStyles);
  const [composing, setComposing] = useState(false);
  const composerProps = {
    initialMessage: {text: ''},
    onSendMessage: (message: Partial<Message>) => {
      setComposing(false);
      return onSendMessage(message);
    },
    onDiscardMessage: (_: Partial<Message>) => {
      setComposing(false);
    },
  };
  return (
    <PageBackground accessibilityLabel={`chat ${chat.user.handle} page`}>
      <Surface accessibilityLabel="chat navigation bar" style={styles.navbar}>
        <IconButton
          icon="arrow-left"
          accessibilityLabel="back to home"
          onPress={onBackToHome}
        />
        <TouchableOpacity
          onPress={onOpenChatProfile}
          accessibilityLabel="open chat profile"
          style={globalStyles.avatarDimensions}
          activeOpacity={0.5}
          children={<Text style={styles.text}>Open Chat Profile</Text>}
        />
      </Surface>
      <FlatList
        data={messages}
        renderItem={({item}) => (
          <MessageDisplay key={item.timestamp} message={item} fromMe />
        )}
      />
      <Show
        component={<MessageComposer {...composerProps} />}
        If={composing}
        ElseShow={
          <FloatBottomRight>
            <IconButton
              accessibilityLabel="compose message"
              icon="pencil"
              onPress={() => setComposing(true)}
            />
          </FloatBottomRight>
        }
      />
    </PageBackground>
  );
}
