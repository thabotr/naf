import {ScrollView} from 'react-native';
import {NativeStackHeaderProps} from '@react-navigation/native-stack';

import {useChats} from '../context/chat';
import {useTheme} from '../context/theme';
import {ProfileHeader} from '../components/ProfileHeader';
import { ProfilePreview } from '../components/ProfilePreview';

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
  const {theme} = useTheme();
  if (!user) {
    return <></>;
  }

  return (
    <ScrollView style={{backgroundColor: theme.color.secondary, height: '100%'}}>
      <ProfilePreview user={user} />
    </ScrollView>
  );
}

export {ChatProfile, ChatProfileHeader};
