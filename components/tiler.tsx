import React from 'react';
import { View, ScrollView} from 'react-native';

import { MessageCard} from "./message";
import { MessageEditorCard } from './MessageEditor';
import { VoiceNoteCard } from './voiceNote';


export function Tiler({children}:{children?:JSX.Element[]}) {
    const dummyMessage = {
        userId: 'user',
        id: '0',
        text: "spendisse nec elementum risus, in gravida enim. Pellentesque tempus quam in elit euismod, sed tempus ligula maximus. Phasellus ut. And more",
        files: [
            { type: 'audio', duration: 10_000, uri: 'x', title: "3s", name: "recorded", size: 3_000_248_111, recorded: true},
            { type: 'audio', uri: 'a', title: "34s", name: "file.txt", size: 1001, recorded: false},
            { type: 'audio', uri: 'c', title: "19s", name: "file3.txt", size: 333, recorded: true},
            { type: 'image', uri: 'https://picsum.photos/600', size: 0},
            { type: 'image', uri: 'https://picsum.photos/500', size: 0},
            { type: 'video', uri: 'https://picsum.photos/300', size: 0},
            { type: 'video', uri: 'https://picsum.photos/3000', size: 0},
            { type: 'image', uri: 'https://picsum.photos/4000', size: 0},
            { type: 'image', uri: 'https://picsum.photos/7000', size: 0},
            { type: 'image', uri: 'https://picsum.photos/8000', size: 0},
        ]
    }

    return (
    <ScrollView style={{height: 930}} overScrollMode='auto'>
        <MessageCard sender={false} msg={dummyMessage}/>
        <MessageCard sender msg={{
            userId: 'user',
            id: '0',
            files: [{ type: 'vid', uri: 'https://picsum.photos/3000', size: 10, name: 'cid'}]
        }}/>
        <MessageCard msg={{
            userId: 'user',
            id: '0',
            files: [{ type: 'image', uri: 'https://picsum.photos/1000', size: 10333, name: 'img'}]
        }} sender/>
        <VoiceNoteCard
            file={{uri:'https://up.fakazaweb.com/wp-content/uploads/2022/10/A-Reece_-_Bad_Guy_Fakaza.Me.com.mp3', size: 3_000_123}}
            // uri='file:////data/user/0/com.naf/cache/recording.mp3'
        />
        <MessageEditorCard/>
        <View style={{height: 500, opacity: 0}}>
        </View>
    </ScrollView>
    );
}