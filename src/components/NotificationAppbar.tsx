import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {List, TouchableRipple} from 'react-native-paper';
import {useChats} from '../context/chat';
import {useTheme} from '../shared/providers/theme';
import {IncomingMessageType, useNotifier} from '../providers/Notifier';
import {useColorsForUsers} from '../providers/UserTheme';
import {Lay} from './Helpers/Lay';
import {OverlayedView} from './Helpers/OverlayedView';
import {Image} from './Image';
import {SlideInView} from './Styling/SlideInView';

function NotificationAppbar() {
  const {theme} = useTheme();
  const {incomingMessages, acknowledgeIncomingMsg} = useNotifier();
  const {getUserColors} = useColorsForUsers();
  const {chats, saveActiveChat} = useChats();

  const [nofication, setNotification] = useState<
    IncomingMessageType | undefined
  >(undefined);
  const [color, setColor] = useState(theme.color.secondary);

  useEffect(() => {
    if (incomingMessages.length) {
      const incMsg = incomingMessages.slice(-1).find(_ => true);
      setNotification(incMsg);
      incMsg &&
        setTimeout(() => {
          acknowledgeIncomingMsg(incMsg);
          setNotification(undefined);
        }, 4500);
    }
  }, [incomingMessages, acknowledgeIncomingMsg]);

  useEffect(() => {
    if (nofication) {
      const userColors = getUserColors(nofication.intelocutor.handle);
      userColors &&
        setColor(
          (theme.dark
            ? userColors.avatar.darkSecondary
            : userColors.avatar.lightSecondary) ?? theme.color.secondary,
        );
    }
  }, [nofication, theme, getUserColors]);

  if (!nofication) {
    return <></>;
  }

  const openChatFromNotification = () => {
    const chat = chats.find(
      c => c.user.handle === nofication.intelocutor.handle,
    );
    chat && saveActiveChat(chat);
  };

  const styles = StyleSheet.create({
    fullWidth: {width: '100%'},
    avatar: {width: 40, height: 40, marginRight: 10},
    title: {
      color: theme.color.textPrimary,
      shadowColor: theme.color.textSecondary,
      fontWeight: 'bold',
    },
    description: {
      color: theme.color.textPrimary,
      shadowColor: theme.color.textSecondary,
    },
    notificationBackground: {
      width: '100%',
      height: '100%',
      opacity: 0.95,
      backgroundColor: color,
    },
  });

  function NotificationContent() {
    if (!nofication) {
      return <></>;
    }

    return (
      <List.Item
        title={'^message/sent media/<reaction>'}
        description={`${nofication.intelocutor.handle}`}
        style={styles.fullWidth}
        right={_ => (
          <Image
            source={nofication.intelocutor.avatarURI}
            style={styles.avatar}
          />
        )}
        titleStyle={styles.title}
        descriptionStyle={styles.description}
      />
    );
  }

  return (
    <OverlayedView>
      <SlideInView reverseAfter={4000} style={styles.fullWidth}>
        <TouchableRipple onPress={openChatFromNotification}>
          <Lay
            component={<NotificationContent />}
            over={<View style={styles.notificationBackground} />}
          />
        </TouchableRipple>
      </SlideInView>
    </OverlayedView>
  );
}

export {NotificationAppbar};
