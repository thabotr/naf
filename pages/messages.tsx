import React from 'react';
import {SafeAreaView, View, KeyboardAvoidingView, ScrollView, FlatList} from 'react-native';
import {IconButton, Portal, Dialog} from 'react-native-paper';

import { ThemeContext, ThemeContextType } from '../context/theme';
import { MessageEditorProvider } from '../context/messageEditor';
import { VoiceRecorder } from '../components/voiceRecorder';
import { MessagesContext, MessagesContextType } from '../context/messages';
import { UserContext, UserContextType } from '../context/user';
import { AudioPreviewCard, FilePreviewCard, ImagePreviewCard, MessageCard, VidPreviewCard } from '../components/message';
import { MessageEditorCard } from '../components/MessageEditor';
import { FloatingActions } from '../components/actionButtons';

export function Tiler() {
    const {theme} = React.useContext(ThemeContext) as ThemeContextType;
    const {messageInFocus, openMessage, chat} = React.useContext(MessagesContext) as MessagesContextType;
    const {user} = React.useContext(UserContext) as UserContextType;

    const fromUser = messageInFocus?.from === user.handle;

    return (
    <KeyboardAvoidingView behavior='height'>
        <ScrollView
            style={{maxHeight: '100%'}}
            overScrollMode='auto'
        >
            <Portal>
                <Dialog
                    style={{backgroundColor:  fromUser? theme.color.userPrimary : theme.color.friendPrimary}}
                    visible={!!messageInFocus}
                    onDismiss={()=>openMessage(null)}
                >
                    <Dialog.Title>all attachments</Dialog.Title>
                    <Dialog.Content style={{maxHeight: 700}}>
                    <FlatList
                        data={messageInFocus?.files.map((f,i)=> { return {
                            id: `${i}`,
                            title: f.uri,
                        }})}
                        renderItem={({item})=> {
                            const f = messageInFocus?.files[Number(item.id)] ?? {type: '', uri: ''};
                            switch( f.type.split('/')[0]){
                                case 'image':
                                    return <ImagePreviewCard source={f}/>
                                case 'video':
                                    return <VidPreviewCard source={f}/>
                                case 'audio':
                                    return <AudioPreviewCard user={fromUser} audio={f}/>
                                default:
                                    return <FilePreviewCard user={fromUser} file={{...f, size: f.size ?? 0, name: f.name ?? ''}}/>
                            }
                        }}
                        keyExtractor={(item: {id:string, title:string}) => item.title}
                    />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <IconButton icon="close" onPress={()=>openMessage(null)}/>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
            {chat?.messages.map(m=> <MessageCard msg={m} key={`senderId-[${m.from}]recipientId-[${m.to}]messageId-[${m.id}]`}/>)}
            <MessageEditorCard/>
            <View style={{height: 100}}></View>
        </ScrollView>
    </KeyboardAvoidingView>
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