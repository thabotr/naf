import React from 'react';
import {View} from 'react-native';
import {Button, Paragraph} from 'react-native-paper';
import {NativeStackHeaderProps} from '@react-navigation/native-stack';

import {Image} from '../components/Image';
import {HorizontalView} from '../components/Helpers/HorizontalView';
import {useChats} from '../context/chat';
import {useTheme} from '../context/theme';
import {User} from '../types/user';
import {ProfileHeader} from '../components/ProfileHeader';

const ProfilePreview = ({user}: {user: User}) => {
  const {theme} = useTheme();
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
          source={user?.avatarURI}
          style={{width: 120, height: 120}}
        />
        <View
          style={{
            backgroundColor: theme.color.secondary,
            width: 340,
            padding: 10,
          }}>
          <Paragraph style={{fontWeight: 'bold'}}>{user?.handle}</Paragraph>
          <Paragraph>
            {user?.name} {user?.surname} [{user?.initials}]
          </Paragraph>
        </View>
      </HorizontalView>
      <Button icon="account-remove" onPress={() => {}} uppercase={false}>
        Disconnect from {user.handle}
      </Button>
    </>
  );
};

function ChatProfileHeader(props: NativeStackHeaderProps) {
  const {activeChat} = useChats();

  const user = activeChat()?.user;
  if (!user) {
    return <></>;
  }
  return <ProfileHeader user={user} props={props} />;
}

function ChatProfile() {
  const {activeChat} = useChats();
  const user = activeChat()?.user;
  if (!user) {
    return <></>;
  }

  return (
    <>
      <ProfilePreview user={user} />
    </>
  );
}

export {ChatProfile, ChatProfileHeader};
