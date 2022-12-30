import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {Surface, TextInput} from 'react-native-paper';
import HorizontalView from '../../shared/components/HorizontalView';
import IconButton from '../../shared/components/IconButton';
import {ThemeType, useThemedStyles} from '../../shared/providers/theme';
import globalStyles from '../../shared/styles';
import {Message} from './types/Message';

type Props = {
  onDiscardMessage: (message: Message) => void;
  onSendMessage: (message: Message) => void;
  initialMessage: Message;
};

export default function (props: Props): JSX.Element {
  const styles = useThemedStyles(styleSheet);
  const [inputText, setInputText] = useState('');
  useEffect(() => {
    setInputText(props.initialMessage.text);
  }, [props.initialMessage.text]);
  return (
    <Surface accessibilityLabel="message composer" style={globalStyles.card}>
      <TextInput
        label="message text"
        accessibilityLabel="message text input"
        defaultValue={props.initialMessage.text}
        onChangeText={setInputText}
        multiline
        style={styles.textInput}
      />
      <HorizontalView accessibilityLabel="actions" style={styles.actions}>
        <IconButton
          icon="delete"
          accessibilityLabel="discard message"
          onPress={() => props.onDiscardMessage({text: inputText})}
          style={styles.action}
        />
        <IconButton
          icon="send"
          accessibilityLabel="send message"
          disabled={!inputText}
          onPress={() => props.onSendMessage({text: inputText})}
          style={styles.action}
        />
      </HorizontalView>
    </Surface>
  );
}

const styleSheet = (theme: ThemeType) =>
  StyleSheet.create({
    actions: {
      backgroundColor: theme.color.userPrimary,
      justifyContent: 'space-between',
    },
    textInput: {
      backgroundColor: theme.color.userSecondary,
    },
    action: {
      backgroundColor: theme.color.userPrimary,
    },
  });
