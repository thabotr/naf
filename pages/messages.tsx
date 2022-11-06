import React from 'react';
import {SafeAreaView, View, ScrollView} from 'react-native';

import { ThemeContext, ThemeContextType } from '../context/theme';
import { MessageEditorProvider } from '../context/messageEditor';
import { VoiceRecorder } from '../components/voiceRecorder';
import { MessagesContext, MessagesContextType } from '../context/messages';
import { MessageCard } from '../components/message';
import { MessageEditorCard } from '../components/MessageEditor';
import { FloatingActions } from '../components/actionButtons';

export function Tiler() {
    const {theme} = React.useContext(ThemeContext) as ThemeContextType;
    const {chat} = React.useContext(MessagesContext) as MessagesContextType;

    return (
    <ScrollView
        style={{height: '100%', backgroundColor: theme.color.secondary}}
        overScrollMode='auto'
    >
        {chat?.messages.map(m=> <MessageCard msg={m} key={`senderId-[${m.from}]recipientId-[${m.to}]messageId-[${m.id}]`}/>)}
        <MessageEditorCard/>
        <View style={{height: 100}}></View>
    </ScrollView>
    );
}

export function Messages() {
    const {theme} = React.useContext(ThemeContext) as ThemeContextType;
    return (
        <MessageEditorProvider>
        <SafeAreaView style={{backgroundColor: theme.color.secondary}}>
            <Tiler/>
            <VoiceRecorder/>
            <FloatingActions/>
        </SafeAreaView>
        </MessageEditorProvider>
    );
}