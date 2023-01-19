import React from 'react';
import {Paragraph, Surface} from 'react-native-paper';
import {Message} from './types/Message';
import globalStyles, {globalThemedStyles} from '../../../src/shared/styles';
import {StyleSheet} from 'react-native';
import {ThemeType, useThemedStyles} from '../../shared/providers/theme';

type Props = {
  message: Message;
  fromMe: boolean;
};

export default function ({message, fromMe}: Props): JSX.Element {
  const styles = useThemedStyles(theme => styleSheet(theme, fromMe));
  return (
    <Surface
      style={styles.messageDisplay}
      accessibilityLabel={`message from ${message.fromHandle} to ${
        message.toHandle
      } @ ${message.timestamp.getTime()}`}>
      <Paragraph style={styles.text}>{message.text}</Paragraph>
    </Surface>
  );
}

const styleSheet = (theme: ThemeType, fromMe: boolean) =>
  StyleSheet.create({
    messageDisplay: {
      backgroundColor: fromMe
        ? theme.color.userPrimary
        : theme.color.friendSecondary,
      padding: 3,
      paddingHorizontal: 5,
      ...globalStyles.card,
    },
    ...globalThemedStyles(theme),
  });
