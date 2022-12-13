/* eslint-disable prettier/prettier */
import React from 'react';
import {TouchableOpacity, View, StyleSheet} from 'react-native';
import {List, Paragraph} from 'react-native-paper';
import {useChats} from '../../context/chat';
import {useTheme} from '../../shared/providers/theme';
import {Chat} from '../../types/chat';
import {Lay} from '../Helpers/Lay';
import {Show} from '../Helpers/Show';

function MessagePreviewSection({
  chat,
  navigation,
}: {
  navigation: any;
  chat: Chat;
}) {
  const {theme} = useTheme();
  const {saveActiveChat} = useChats();
  const latestMessage = chat.messages.slice(-1).find(_ => true);

  const styles = StyleSheet.create({
    touchOp: {
      width: '100%',
      height: '100%',
    },
    fullWidth: {width: '100%'},
    background: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.color.secondary,
      opacity: 0.5,
    },
  });
  return (
    <TouchableOpacity
      style={styles.touchOp}
      onPress={() => {
        saveActiveChat(chat);
        navigation.push('Chat');
      }}
      activeOpacity={0.8}>
      <Lay
        component={
          <Show
            component={
              <Paragraph
                style={{
                  color: theme.color.textPrimary,
                  textShadowColor: theme.color.textSecondary,
                }}
                numberOfLines={1}>
                {`converse with ${chat.user.handle}`}
              </Paragraph>
            }
            If={!latestMessage}
            ElseShow={
              <List.Item
                style={styles.fullWidth}
                titleStyle={{
                  color: theme.color.textPrimary,
                  shadowColor: theme.color.textSecondary,
                }}
                title={
                  !latestMessage?.text ? '<sent a file>' : latestMessage.text
                }
                left={_ => (
                  <List.Icon
                    icon={
                      latestMessage?.draft
                        ? 'content-save-edit'
                        : latestMessage?.text ? 'message-text' : 'attachment'
                    }
                    color={theme.color.textPrimary}
                  />
                )}
              />
            }
          />
        }
        over={
          <View style={styles.background} />
        }
      />
    </TouchableOpacity>
  );
}

export {MessagePreviewSection};
