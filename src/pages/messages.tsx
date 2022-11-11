import React from 'react';
import {SafeAreaView, View, ScrollView} from 'react-native';

import {useTheme} from '../context/theme';
import {MessageComposerProvider} from '../context/messageEditor';
import {VoiceRecorder} from '../components/voiceRecorder';
import {MessageCard} from '../components/message';
import {MessageEditorCard} from '../components/MessageEditor';
import {FloatingActions} from '../components/actionButtons';
import {useChats} from '../context/chat';

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

export function Messages() {
  const {theme} = useTheme();
  return (
    <MessageComposerProvider>
      <SafeAreaView style={{backgroundColor: theme.color.secondary}}>
        <Tiler />
        <VoiceRecorder />
        <FloatingActions />
      </SafeAreaView>
    </MessageComposerProvider>
  );
}