import React from 'react';
import { FlatList, SafeAreaView, Text, View, Image } from 'react-native';
import { Appbar, FAB, Avatar, Provider, IconButton } from 'react-native-paper';

import {MessageField} from '../components/messageField';
import {MessageType} from '../types/message';
import {Tiler} from '../components/tiler';

const FloatingActions = () => {
    const [expanded, setExpanded] = React.useState(false);
    const actions = [
        { color: '#d4d4d4', icon: 'microphone'},
        { color: '#b4b4b4', icon: 'attachment'},
        { color: '#909090', icon: 'camera'},
        { color: '#636363', icon: 'pencil'},
    ]
    return (
    <View
        style={
        [
            {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            padding: 0,
            elevation: 2,
            borderRadius: 3,
            position: 'absolute',
            right: 10,
            bottom: 50,
            backgroundColor: 'black', // TODO get from theme,
            width: expanded ? 150 : null
            }
        ]}
    >
        { !expanded ?
        <FAB
            style={{margin: 3, borderRadius: 0, backgroundColor: '#636363'}}
            icon="pencil"
            onLongPress={()=>setExpanded(true)}
            onPress={()=>{}}
        /> :
        actions.map(ab => <IconButton
                key={ab.icon}
                style={{margin: 0, borderRadius: 0, backgroundColor: ab.color, width: '50%'}}
                size={40}
                icon={ab.icon}
                onPress={()=>{}}
            />
        )
        }
    </View>
    );
}

export function Messages() {
        const messages: MessageType[] = [
            {id: 'id', text: 'text', sender: 'from', recipients: ['to'], media: []},
            {id: 'id1', text: 'text1', sender: 'from1', recipients: ['to1'], media: []},
            {id: 'id2', text: 'text2', sender: 'from2', recipients: ['to2'], media: []},
            {id: 'id3', text: 'text3', sender: 'from3', recipients: ['to3'], media: []},
            {id: 'id4', text: 'text4', sender: 'from4', recipients: ['to4'], media: []}
        ];

    return (
    <SafeAreaView>
        <Appbar.Header>
            <Appbar.BackAction onPress={()=>{}}/>
            <Appbar.Content title="Juan" subtitle="Perez"/>
            <Appbar.Action size={40} icon={{uri: 'https://img.icons8.com/doodle/48/000000/user-male-skin-type-5.png'}} onPress={() => {}} />
        </Appbar.Header>
        <Tiler/>
        <FloatingActions/>
    </SafeAreaView>
    );
}