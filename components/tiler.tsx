import React from 'react';
import { View, ScrollView, Image} from 'react-native';

import { DummyMessage, MessageCard, MessageEditorCard } from "./message";
import { VoiceNoteCard } from './voiceNote';


export function Tiler({children}:{children?:JSX.Element[]}) {
    const dummyMessage: DummyMessage = {
        text: "spendisse nec elementum risus, in gravida enim. Pellentesque tempus quam in elit euismod, sed tempus ligula maximus. Phasellus ut. And more",
        audio: [
            {title: "3s", description: "[recorded] 3.1MB", recorded: true},
            {title: "34s", description: "[file.txt] 1MB", recorded: false},
            {title: "19s", description: "[file3.txt] 10MB", recorded: true}
        ],
        visuals: [
            { type: 'image', uri: 'https://picsum.photos/600'},
            { type: 'image', uri: 'https://picsum.photos/500'},
            { type: 'vid', uri: 'https://picsum.photos/300'},
            { type: 'vid', uri: 'https://picsum.photos/3000'},
            { type: 'image', uri: 'https://picsum.photos/4000'},
            { type: 'image', uri: 'https://picsum.photos/7000'},
            { type: 'image', uri: 'https://picsum.photos/8000'},
        ]
    }

    return (
    <ScrollView style={{height: 930}} overScrollMode='auto'>
        <MessageCard sender={false} msg={dummyMessage}/>
        <MessageCard sender msg={{
            text: '',
            audio: [],
            visuals: [{ type: 'vid', uri: 'https://picsum.photos/3000'}]
        }}/>
        <MessageCard msg={{
            text: "",
            visuals: [{type: 'image', uri: 'https://picsum.photos/400'}],
            audio: []
        }} sender/>
        <MessageEditorCard/>
        <VoiceNoteCard track={{
            url: 'https://up.fakazaweb.com/wp-content/uploads/2022/10/A-Reece_-_Bad_Guy_Fakaza.Me.com.mp3',
            title: 'bad guy',
            artist: 'a-reece'
        }}/>
        <View style={{height: 200, opacity: 0}}>
        </View>
    </ScrollView>
    );
}