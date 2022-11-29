import {useEffect, useState} from 'react';
import {View} from 'react-native';
import {List, TouchableRipple} from 'react-native-paper';
import { useChats } from '../context/chat';
import {useTheme} from '../context/theme';
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
  }, [incomingMessages]);

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
  }, [nofication, theme]);

  if (!nofication) {
    return <></>;
  }

  const openChatFromNotification = () => {
    const chat = chats.find(c=>c.user.handle === nofication.intelocutor.handle)
    chat && saveActiveChat(chat);
  };

  function NotificationContent() {
    if (!nofication) {
      return <></>;
    }

    return (
      <List.Item
        title={`^message/sent media/<reaction>`}
        description={`${nofication.intelocutor.handle}`}
        style={{width: '100%'}}
        right={_ => (
          <Image
          style={{width: 40, height: 40, marginRight: 10}}
          source={nofication.intelocutor.avatarURI}
          />
          )}
        titleStyle={{
          color: theme.color.textPrimary,
          shadowColor: theme.color.textSecondary,
          fontWeight: 'bold',
        }}
        descriptionStyle={{
          color: theme.color.textPrimary,
          shadowColor: theme.color.textSecondary,
        }}
      />
    );
  }

  return (
    <OverlayedView>
      <SlideInView reverseAfter={4000} style={{width: '100%'}}>
        <TouchableRipple onPress={openChatFromNotification}>
          <Lay
            component={<NotificationContent />}
            over={
              <View
                style={{
                  width: '100%',
                  height: '100%',
                  opacity: 0.95,
                  backgroundColor: color,
                }}
              />
            }
          />
        </TouchableRipple>
      </SlideInView>
    </OverlayedView>
  );
}

export {NotificationAppbar};
