import React from 'react';
import { View, ScrollView, FlatList, KeyboardAvoidingView, Text, Pressable } from 'react-native';
import { Dialog, IconButton, Portal} from 'react-native-paper';

import { MessagesContext, MessagesContextType} from '../context/messages';
import { ThemeContext, ThemeContextType } from '../context/theme';
import { UserContext, UserContextType } from '../context/user';
import { OnlyShow, OverlayedView } from './helper';
import { AudioPreviewCard, FilePreviewCard, ImagePreviewCard, MessageCard, VidPreviewCard} from "./message";
import { MessageEditorCard } from './MessageEditor';

export function Tiler({children}:{children?:JSX.Element[]}) {
    const {theme} = React.useContext(ThemeContext) as ThemeContextType;
    const {messages, addMessages, messageInFocus, openMessage} = React.useContext(MessagesContext) as MessagesContextType;
    const {userId} = React.useContext(UserContext) as UserContextType;
    React.useEffect(()=>{
        addMessages([{
            senderId: 'user1',
            recipientId: '',
            id: '0',
            text: "spendisse nec elementum risus, in gravida enim. Pellentesque" +
            "tempus quam in elit euismod, sed tempus ligula maximus. Phasellus ut. And more" +
            "eque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit",
            files: [
                { type: 'recording/application/mp3', uri: 'uri7', size: 2_342, duration: 17},
                { type: 'audio', duration: 10_000, uri: 'x', name: "recorded", size: 3_000_248_111},
                { type: 'video', uri: 'https://picsum.photos/303', size: 0},
                { type: 'audio', uri: 'a', name: "file.txt", size: 1001},
                { type: 'application/pdf', uri: 'b', name: "file.txt", size: 1001},
                { type: 'audio', uri: 'c', name: "file3.txt", size: 333},
                { type: 'image', uri: 'https://picsum.photos/600', size: 0},
                { type: 'image', uri: 'https://picsum.photos/500', size: 0},
                { type: 'video', uri: 'https://picsum.photos/300', size: 0},
                { type: 'image', uri: 'https://picsum.photos/400', size: 0},
                { type: 'image', uri: 'https://picsum.photos/700', size: 0},
                { type: 'image', uri: 'https://picsum.photos/800', size: 0},
            ]
        },
        {
            senderId: 'user2',
            recipientId: 'user1',
            id: '1',
            files: [{ type: 'image', uri: 'https://picsum.photos/600', size: 0}]
        },
        {
            senderId: 'user1',
            recipientId: 'user2',
            id: '2',
            text: "spendisse nec elementum risus, in gravida enim. Pellentesque how tillas tu",
            files: []
        },
        {
            senderId: 'user2',
            recipientId: 'user1',
            id: '3',
            files: [{ type: 'application/pdf', uri: 'pdf uri', size: 1_000_000, name: 'document.pdf'}]
        },
        {
            senderId: 'user1',
            recipientId: 'user3',
            id: '4',
            files: [
                { type: 'application/pdf', uri: 'pdf uri', size: 1_000_000, name: 'document.pdf'},
                { type: 'application/zip', uri: 'pdf uri3', size: 303_101, name: 'document2.pdf'}
            ]
        },
        {
            senderId: 'user1',
            recipientId: 'user3',
            id: '5',
            files: [
                { type: 'recording/application/mp3', uri: 'pdf uri', size: 2_120_000, duration: 3600},
                { type: 'application/zip', uri: 'pdf uri3', size: 303_101, name: 'document2.pdf'}
            ]
        },
        {
            senderId: 'user1',
            recipientId: 'user3',
            id: '6',
            files: [
                { type: 'recording/application/mp3', uri: 'pdf uri', size: 332_000, duration: 31},
            ]
        },
        {
            senderId: 'user1',
            recipientId: 'user3',
            id: '7',
            files: []
        },
        {
            senderId: 'user2',
            recipientId: 'user1',
            id: 'draft8',
            files: [
                { type: 'video', uri: 'https://picsum.photos/3003', size: 0},
                { type: 'video', uri: 'https://picsum.photos/3001', size: 0},
            ],
            text: 'this text here'
        },
        {
            senderId: 'user2',
            recipientId: 'user1',
            id: '9',
            files: [
                { type: 'video', uri: 'https://picsum.photos/1001', size: 0},
            ],
            text: 'this text here'
        },
        {
            senderId: 'user1',
            recipientId: 'user2',
            id: '10',
            files: [],
        }
    ]);
    },[]);

    return (
    <KeyboardAvoidingView behavior='height'>
        <ScrollView
            style={{maxHeight: 930}}
            overScrollMode='auto'
        >
            <Portal>
                <Dialog
                    style={{backgroundColor: messageInFocus?.senderId === userId ? theme.color.userPrimary : theme.color.friendPrimary}}
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
                                    return <AudioPreviewCard user={messageInFocus?.senderId === userId} audio={f}/>
                                default:
                                    return <FilePreviewCard user={messageInFocus?.senderId === userId} file={{...f, size: f.size ?? 0, name: f.name ?? ''}}/>
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
            {messages.map(m=> <MessageCard msg={m} key={`senderId-[${m.senderId}]recipientId-[${m.recipientId}]messageId-[${m.id}]`}/>)}
            <MessageEditorCard/>
            <View style={{height: 100}}></View>
        </ScrollView>
    </KeyboardAvoidingView>
    );
}