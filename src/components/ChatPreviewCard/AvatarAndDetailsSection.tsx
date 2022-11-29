import {TouchableOpacity, View} from 'react-native';
import {Avatar, Paragraph} from 'react-native-paper';
import {useChats} from '../../context/chat';
import {useTheme} from '../../context/theme';
import {Chat} from '../../types/chat';
import {Image} from '../Image';
import {Lay} from '../Helpers/Lay';

function AvatarAndDetailsSection({
  chat,
  contextualTheme,
  setAvatarURI,
  navigation,
}: {
  chat: Chat;
  contextualTheme: {primary: string; secondary: string};
  setAvatarURI: (uri: string) => void;
  navigation: any;
}) {
  const {saveActiveChat} = useChats();
  const {theme} = useTheme();
  return (
    <TouchableOpacity
      style={{height: '100%', width: '25%'}}
      onPress={() => {
        saveActiveChat(chat);
        navigation.navigate('ChatProfile');
      }}
      activeOpacity={0.8}>
      <View style={{height: '50%', width: '100%'}}>
        <Lay
          component={
            <Image
              style={{width: '100%', height: '100%'}}
              source={chat.user.avatarURI}
              onURI={uri => setAvatarURI(uri)}
              alt={
                <Avatar.Text
                  style={{
                    borderRadius: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: contextualTheme.primary,
                  }}
                  label={chat.user.initials}
                />
              }
            />
          }
          over={
            <View
              style={{
                height: '100%',
                width: '100%',
                backgroundColor: contextualTheme.primary,
                opacity: 1,
              }}
            />
          }
        />
      </View>
      <View style={{height: '50%', width: '100%', alignItems: 'center'}}>
        <Lay
          component={
            <>
              <Paragraph
                style={{
                  fontWeight: 'bold',
                  color: theme.color.textPrimary,
                  textShadowColor: theme.color.textSecondary,
                }}>
                {chat.user.handle}
              </Paragraph>
              <Paragraph
                style={{
                  color: theme.color.textPrimary,
                  textShadowColor: theme.color.textSecondary,
                }}>
                {chat.user.name} {chat.user.surname}
              </Paragraph>
            </>
          }
          over={
            <View
              style={{
                height: '100%',
                width: '100%',
                backgroundColor: contextualTheme.secondary,
                opacity: 1,
              }}
            />
          }
        />
      </View>
    </TouchableOpacity>
  );
}

export {AvatarAndDetailsSection};
