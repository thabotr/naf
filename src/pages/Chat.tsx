import {useEffect, useState} from 'react';
import {SafeAreaView, View, ScrollView} from 'react-native';

import {useTheme} from '../context/theme';
import {MessageComposerProvider} from '../context/messageEditor';
import {VoiceRecorderCard} from '../components/VoiceRecorderCard';
import {MessageCard} from '../components/MessageCard';
import {MessageEditorCard} from '../components/MessageComposer';
import {ComposeFloatingActions} from '../components/ComposeFloatingActions';
import {useChats} from '../context/chat';
import {Appbar} from 'react-native-paper';
import {NativeStackHeaderProps} from '@react-navigation/native-stack';
import {Image} from '../components/Image';
import {OnlyShow} from '../components/Helpers/OnlyShow';
import {FileManager} from '../services/FileManager';
import { useColorsForUsers } from '../providers/UserTheme';

export function Tiler() {
  const {theme} = useTheme();
  const {activeChat} = useChats();
  return (
    <ScrollView
      style={{height: '100%', backgroundColor: theme.color.secondary}}
      overScrollMode="auto">
      {activeChat()?.messages.map(m => (
        <MessageCard
          msg={m}
          key={`senderId-[${m.from}]recipientId-[${m.to}]messageId-[${m.id}]`}
        />
      ))}
      <MessageEditorCard />
      <View style={{height: 100}}></View>
    </ScrollView>
  );
}

function ChatHeader(props: NativeStackHeaderProps) {
  const {theme} = useTheme();
  const {activeChat} = useChats();
  const user = activeChat()?.user;
  const {colorsForUsers} = useColorsForUsers();
  const [colors, setColors] = useState(()=>{
    return {
    primary: theme.color.primary,
    secondary: theme.color.secondary,
  }});
  if (!user) {
    return <></>;
  }

  useEffect(()=>{
    const userColors = colorsForUsers.get(user.handle);
    userColors && setColors({
      primary:
        (theme.dark ? userColors.landscape.darkPrimary : userColors.landscape.lightPrimary) ??
        theme.color.primary,
      secondary:
        (theme.dark ? userColors.landscape.darkSecondary : userColors.landscape.lightSecondary) ??
        theme.color.secondary,
    })
  },[theme, colorsForUsers]);

  return (
    <Appbar.Header style={{backgroundColor: colors.primary}}>
      <OnlyShow If={!!props.back}>
        <Appbar.BackAction
          style={{borderRadius: 0}}
          onPress={() => {
            props.navigation.goBack();
          }}
        />
      </OnlyShow>
      <Appbar.Content
        titleStyle={{
          color: theme.color.textPrimary,
          textShadowColor: theme.color.textSecondary,
        }}
        title={user?.handle}
        subtitleStyle={{
          color: theme.color.textPrimary,
          textShadowColor: theme.color.textSecondary,
        }}
        subtitle={`${user?.name} ${user?.surname}`}
      />
      <View style={{height: '100%', width: 50, marginRight: 10}}>
        <Image
          onPress={() => props.navigation.navigate('ChatProfile')}
          source={user?.avatarURI}
          style={{height: '100%', width: '100%'}}
        />
      </View>
    </Appbar.Header>
  );
}

function Chat() {
  const {theme} = useTheme();
  return (
    <MessageComposerProvider>
      <SafeAreaView style={{backgroundColor: theme.color.secondary, height: '100%'}}>
        <Tiler />
        <VoiceRecorderCard />
        <ComposeFloatingActions />
      </SafeAreaView>
    </MessageComposerProvider>
  );
}

export {Chat, ChatHeader};
