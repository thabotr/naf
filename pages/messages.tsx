import React from 'react';
import {SafeAreaView, View} from 'react-native';
import {FAB, Avatar, IconButton, List} from 'react-native-paper';
import ImageView from 'react-native-image-viewing';

import {MessageType} from '../types/message';
import {Tiler} from '../components/tiler';
import {ImageViewContextType} from '../types/images';
import {ImageViewContext} from '../context/images';
import { ThemeContext } from '../context/theme';
import { ThemeContextType } from '../types/theme';
import { MessageEditorContext, MessageEditorProvider } from '../context/messageEditor';
import { MessageEditorContextType } from '../types/MessageEditor';
import { OnlyShow } from '../components/helper';
import { VoiceRecorder } from '../components/voiceRecorder';

const FloatingActions = () => {
    const [expanded, setExpanded] = React.useState(false);
    const {composing, setComposeOn, vrState, onStartRecord, showTextInputOn, onAddAttachments} = React.useContext(MessageEditorContext) as MessageEditorContextType;
    const actions = [
        { color: '#d4d4d4', icon: 'microphone'},
        { color: '#b4b4b4', icon: 'attachment'},
        { color: '#909090', icon: 'camera'},
        { color: '#636363', icon: 'pencil'},
    ]


    const pencilClicked = () => {
        setComposeOn(true);
        showTextInputOn(true);
    }

    return (
    <OnlyShow If={!(composing || vrState.recording)}>
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
            },
            {
                width: expanded ? 150 : 'auto'
            }
        ]}
    >
        { !expanded ?
        <FAB
            style={{margin: 3, borderRadius: 0, backgroundColor: '#636363'}}
            icon="pencil"
            onLongPress={()=>setExpanded(true)}
            onPress={pencilClicked}
        /> :
        actions.map(ab => <IconButton
                key={ab.icon}
                style={{margin: 0, borderRadius: 0, backgroundColor: ab.color, width: '50%'}}
                size={40}
                icon={ab.icon}
                onPress={()=>{
                    switch( ab.icon){
                        case 'microphone':
                            onStartRecord();
                            break;
                        case 'pencil':
                            pencilClicked();
                            break;
                        case 'attachment':
                            onAddAttachments();
                            break;
                        default:
                            console.warn("TODO implement action")
                    }
                }}
            />
        )
        }
    </View>
    </OnlyShow>
    );
}

export function MessagesHeader() {
    const {theme} = React.useContext(ThemeContext) as ThemeContextType;
    return (
    <View style={{display: 'flex', flexDirection: 'row', width: '100%', margin: 0, padding: 0, backgroundColor: theme.color.primary}}>
        <List.Item
            title="Juanita"
            description="perez"
            style={{flex: 1}}
        />
        <Avatar.Image style={{flex: 1, backgroundColor: theme.color.primary, marginRight: 10}} source={{uri: 'https://img.icons8.com/color/96/000000/user-female-skin-type-6.png'}}/>
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

    const {images, onView, onViewOff, sender} = React.useContext(ImageViewContext) as ImageViewContextType;
    const {theme} = React.useContext(ThemeContext) as ThemeContextType;

    return (
    <MessageEditorProvider>
    <SafeAreaView style={{backgroundColor: theme.color.secondary}}>
        <ImageView
            images={images}
            imageIndex={0}
            visible={onView}
            onRequestClose={onViewOff}
            animationType='fade'
            backgroundColor={sender ? theme.color.userPrimary : theme.color.friendPrimary} //TODO set this color to sender or receiver color
        />
        <Tiler/>
        <VoiceRecorder/>
        <FloatingActions/>
    </SafeAreaView>
    </MessageEditorProvider>
    );
}