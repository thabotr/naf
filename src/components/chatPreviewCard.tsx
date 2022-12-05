import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {Card} from 'react-native-paper';
import {useListenWithMe} from '../context/listenWithMe';
import {useTheme} from '../context/theme';
import {Chat} from '../types/chat';
import {Image} from './Image';
import {HorizontalView} from './Helpers/HorizontalView';
import {OverlayedView} from './Helpers/OverlayedView';
import {FileManager} from '../services/FileManager';
import {UnreadMessageCountBadge} from './ChatPreviewCard/UnreadMessageCountBadge';
import {AvatarAndDetailsSection} from './ChatPreviewCard/AvatarAndDetailsSection';
import {MessagePreviewSection} from './ChatPreviewCard/MessagePreviewSection';
import {ListenWithMeSection} from './ChatPreviewCard/ListenWithMeSection';
import {WatchWithMeSection} from './ChatPreviewCard/WatchWithMeSection';
import {ReadWithMeSection} from './ChatPreviewCard/ReadWithMeSection';

export function ChatPreviewCard({
  chat,
  navigation,
}: {
  chat: Chat;
  navigation: any;
}) {
  const {theme} = useTheme();
  const {saveColors} = useListenWithMe();

  const [landscapeUri, setLandscapeUri] = useState('');
  const [avatarURI, setAvatarURI] = useState('');

  const unreadMessageCount = chat.messages.filter(m => !!m.unread).length;

  const [avatarPrimary, setAP] = useState(() => theme.color.primary);
  const [avatarSecondary, setAS] = useState(() => theme.color.secondary);

  useEffect(() => {
    landscapeUri &&
      FileManager.getImageColors(landscapeUri).then(colors => {
        colors && saveColors(colors);
      });
  }, [landscapeUri, theme, saveColors]);

  useEffect(() => {
    avatarURI &&
      FileManager.getImageColors(avatarURI).then(colors => {
        if (colors) {
          setAP(
            c => (theme.dark ? colors.darkPrimary : colors.lightPrimary) ?? c,
          );
          setAS(
            c =>
              (theme.dark ? colors.darkSecondary : colors.lightSecondary) ?? c,
          );
        }
      });
  }, [avatarURI, theme]);
  const styles = StyleSheet.create({
    card: {
      borderRadius: 5,
      margin: 2,
      padding: 4,
      backgroundColor: avatarSecondary,
    },
    avatarNDetails: {
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      borderColor: avatarPrimary,
      borderWidth: 2,
    },
    gap: {width: '100%', height: '50%'},
    actionsSection: {height: '100%', width: '75%'},
    messaging: {width: '100%', height: '25%'},
    withMeSection: {width: '100%', height: '25%'},
  });
  return (
    <Card style={styles.card}>
      <Image
        source={chat.user.landscapeURI}
        style={{backgroundColor: avatarPrimary}}
        onURI={uri => setLandscapeUri(uri)}
      />
      <OverlayedView style={styles.avatarNDetails}>
        <HorizontalView>
          <AvatarAndDetailsSection
            chat={chat}
            setAvatarURI={setAvatarURI}
            contextualTheme={{
              primary: avatarPrimary,
              secondary: avatarSecondary,
            }}
            navigation={navigation}
          />
          <View style={styles.actionsSection}>
            <HorizontalView style={styles.withMeSection}>
              <ListenWithMeSection chat={chat} />
              <WatchWithMeSection chat={chat} />
              <ReadWithMeSection chat={chat} />
            </HorizontalView>
            <View style={styles.gap} />
            <View style={styles.messaging}>
              <MessagePreviewSection chat={chat} navigation={navigation} />
            </View>
          </View>
        </HorizontalView>
      </OverlayedView>
      <UnreadMessageCountBadge count={unreadMessageCount} />
    </Card>
  );
}
