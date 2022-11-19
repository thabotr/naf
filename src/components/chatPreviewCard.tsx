import {useContext, useState, useEffect} from 'react';
import {View} from 'react-native';
import {Card} from 'react-native-paper';
import {
  ListenWithMeContext,
  ListenWithMeContextType,
} from '../context/listenWithMe';
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

export function ChatPreviewCard({
  chat,
  navigation,
}: {
  chat: Chat;
  navigation: any;
}) {
  const {theme} = useTheme();
  const {saveColors} = useContext(
    ListenWithMeContext,
  ) as ListenWithMeContextType;

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
  }, [landscapeUri, theme]);

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

  return (
    <Card
      style={{
        borderRadius: 5,
        margin: 2,
        padding: 4,
        backgroundColor: avatarSecondary,
      }}>
      <Image
        source={chat.user.landscapeURI}
        style={{backgroundColor: avatarPrimary}}
        onURI={uri => setLandscapeUri(uri)}
      />
      <OverlayedView
        style={{
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          borderColor: avatarPrimary,
          borderWidth: 2,
        }}>
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
          <View style={{height: '100%', width: '75%'}}>
            <View
              style={{
                width: '100%',
                height: '25%',
              }}>
              <ListenWithMeSection chat={chat} />
            </View>
            <View style={{width: '100%', height: '50%'}} />
            <View style={{width: '100%', height: '25%'}}>
              <MessagePreviewSection chat={chat} navigation={navigation} />
            </View>
          </View>
        </HorizontalView>
      </OverlayedView>
      <UnreadMessageCountBadge count={unreadMessageCount} />
    </Card>
  );
}
