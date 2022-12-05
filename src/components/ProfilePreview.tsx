import React, {useState} from 'react';
import {View, ToastAndroid, StyleSheet} from 'react-native';
import {Button, Paragraph} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useChats} from '../context/chat';
import {useTheme} from '../context/theme';
import {User} from '../types/user';
import {HorizontalView} from './Helpers/HorizontalView';
import {Image} from './Image';
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
    landscape: {width: '100%'},
    avatarArea: {
      width: '100%',
      alignItems: 'center',
      padding: 10,
      backgroundColor: theme.color.secondary,
    },
    avatar: {width: 120, height: 120},
    profileNames: {
      backgroundColor: theme.color.secondary,
      width: 340,
      padding: 10,
    },
    handle: {
      fontWeight: 'bold',
      color: theme.color.textPrimary,
      shadowColor: theme.color.textSecondary,
    },
    names: {
      color: theme.color.textPrimary,
      shadowColor: theme.color.textSecondary,
    },
  });

  return (
    <>
      <Image viewable source={user?.landscapeURI} style={styles.landscape} />
      <HorizontalView style={styles.avatarArea}>
        <Image viewable source={user.avatarURI} style={styles.avatar} />
        <View style={styles.profileNames}>
          <Paragraph style={styles.handle}>{user.handle}</Paragraph>
          <Paragraph style={styles.names}>
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
        color={state === 'idle' ? 'red' : theme.color.textPrimary}
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
