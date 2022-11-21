import {View, ToastAndroid} from 'react-native';
import {Button, Paragraph} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useChats} from '../context/chat';
import {useTheme} from '../context/theme';
import {User} from '../types/user';
import {HorizontalView} from './Helpers/HorizontalView';
import {Image} from './Image';

const ProfilePreview = ({user}: {user: User}) => {
  const {theme} = useTheme();
  const {updateChats} = useChats();
  const navigation = useNavigation<any>();
  const disconnectFromUser = () => {
    // TODO send remote disconnect request
    navigation.navigate('Home', {});
    updateChats(chats => chats.filter(c => c.user.handle !== user.handle));
  };
  return (
    <>
      <Image viewable source={user?.landscapeURI} style={{width: '100%'}} />
      <HorizontalView
        style={{
          width: '100%',
          alignItems: 'center',
          padding: 10,
          backgroundColor: theme.color.secondary,
        }}>
        <Image
          viewable
          source={user.avatarURI}
          style={{width: 120, height: 120}}
        />
        <View
          style={{
            backgroundColor: theme.color.secondary,
            width: 340,
            padding: 10,
          }}>
          <Paragraph
            style={{
              fontWeight: 'bold',
              color: theme.color.textPrimary,
              shadowColor: theme.color.textSecondary,
            }}>
            {user.handle}
          </Paragraph>
          <Paragraph
            style={{
              color: theme.color.textPrimary,
              shadowColor: theme.color.textSecondary,
            }}>
            {user.name} {user.surname} [{user.initials}]
          </Paragraph>
        </View>
      </HorizontalView>
      <Button
        icon="account-remove"
        onPress={() => {
          ToastAndroid.show(
            `Hold to disconnect \nfrom ${user.name} ${user.surname}`,
            3000,
          );
        }}
        onLongPress={disconnectFromUser}
        color={'red'}
        uppercase={false}
        style={{
          shadowColor: theme.color.textSecondary,
        }}>
        Disconnect from {user.handle}
      </Button>
    </>
  );
};

export {ProfilePreview};
