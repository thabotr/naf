import React, {useEffect, useState} from 'react';
import {SafeAreaView, View, ScrollView, StyleSheet} from 'react-native';

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
import {useColorsForUsers} from '../providers/UserTheme';

export function MessageListing() {
  const {theme} = useTheme();
  const {activeChat} = useChats();
  const styles = StyleSheet.create({
    scrollView: {height: '100%', backgroundColor: theme.color.secondary},
  });
  return (
    <ScrollView style={styles.scrollView} overScrollMode="auto">
      {activeChat()?.messages.map(m => (
        <MessageCard msg={m} key={[m.from, m.to, m.id].join('|')} />
      ))}
      <MessageEditorCard />
    </ScrollView>
  );
}

function ChatHeader(props: NativeStackHeaderProps) {
  const {theme} = useTheme();
  const {activeChat} = useChats();
  const user = activeChat()?.user;
  const {colorsForUsers} = useColorsForUsers();
  const [colors, setColors] = useState(() => {
    return {
      primary: theme.color.primary,
      secondary: theme.color.secondary,
    };
  });

  useEffect(() => {
    const userColors = colorsForUsers.get(user.handle);
    userColors &&
      setColors({
        primary:
          (theme.dark
            ? userColors.landscape.darkPrimary
            : userColors.landscape.lightPrimary) ?? theme.color.primary,
        secondary:
          (theme.dark
            ? userColors.landscape.darkSecondary
            : userColors.landscape.lightSecondary) ?? theme.color.secondary,
      });
  }, [theme, colorsForUsers, user.handle]);

  if (!user) {
    return <></>;
  }

  const styles = StyleSheet.create({
    square: {borderRadius: 0},
    avatarContainer: {height: '100%', width: 50, marginRight: 10},
    spanningAvatar: {height: '100%', width: '100%'},
  });

  return (
    <Appbar.Header style={{backgroundColor: colors.primary}}>
      <OnlyShow If={!!props.back}>
        <Appbar.BackAction
          color={theme.color.textPrimary}
          style={styles.square}
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
      <View style={styles.avatarContainer}>
        <Image
          onPress={() => props.navigation.navigate('ChatProfile')}
          source={user?.avatarURI}
          style={styles.spanningAvatar}
        />
      </View>
    </Appbar.Header>
  );
}

function Chat() {
  const {theme} = useTheme();
  const styles = StyleSheet.create({
    background: {backgroundColor: theme.color.secondary, height: '100%'},
  });
  return (
    <MessageComposerProvider>
      <SafeAreaView style={styles.background}>
        <MessageListing />
        <VoiceRecorderCard />
        <ComposeFloatingActions />
      </SafeAreaView>
    </MessageComposerProvider>
  );
}

export {Chat, ChatHeader};
