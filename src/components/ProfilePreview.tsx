import {View, ToastAndroid, StyleSheet} from 'react-native';
import {Button, Paragraph} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useChats} from '../context/chat';
import {useTheme} from '../context/theme';
import {User} from '../types/user';
import {HorizontalView} from './Helpers/HorizontalView';
import {Image} from './Image';
import {useState} from 'react';
import {Remote} from '../services/Remote';
import {useLoggedInUser} from '../context/user';

const ProfilePreview = ({user}: {user: User}) => {
  const {theme} = useTheme();
  const {updateChats} = useChats();
  const navigation = useNavigation<any>();
  const [state, setState] = useState<'error' | 'loading' | 'idle'>('idle');
  const {userProfile} = useLoggedInUser();

  const disconnectFromUser = () => {
    setState('loading');
    Remote.deleteConnection(userProfile.token, userProfile.handle, user.handle)
      .then(disconnected => {
        if (disconnected) {
          navigation.navigate('Home', {});
          updateChats(chats =>
            chats.filter(c => c.user.handle !== user.handle),
          );
        }
      })
      .finally(() => setState('error'));
  };

  const styles = StyleSheet.create({
    disconnectButton: {
      shadowColor: theme.color.textSecondary,
      borderWidth: state === 'error' ? 1 : 0,
      borderColor: 'red',
    },
  });

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
        color={state === 'idle'? 'red' : theme.color.textPrimary}
        uppercase={false}
        loading={state === 'loading'}
        disabled={state === 'loading'}
        style={styles.disconnectButton}>
        Disconnect from {user.handle}
      </Button>
    </>
  );
};

export {ProfilePreview};
