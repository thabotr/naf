import React from 'react';
import {SafeAreaView, View, BackHandler} from 'react-native';
import {FAB, Avatar, IconButton, List} from 'react-native-paper';

import {Tiler} from '../components/tiler';
import { ThemeContext, ThemeContextType } from '../context/theme';
import { MessageEditorContext, MessageEditorProvider } from '../context/messageEditor';
import { MessageEditorContextType } from '../types/MessageEditor';
import { OnlyShow } from '../components/helper';
import { VoiceRecorder } from '../components/voiceRecorder';
import { MessagesContextProvider } from '../context/messages';
import { openCamera } from '../src/camera';

const ExtendedActions = ({onBack}:{onBack: ()=>void}) => {
    const {setComposeOn, onStartRecord, showTextInputOn, onAddAttachments, saveComposeMessage, message} = React.useContext(MessageEditorContext) as MessageEditorContextType;
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

    const backAction = () => {
        onBack();
        return true;
    }

    const takePic = (mode: 'video' | 'photo') => {
        openCamera(mode)
        .then(img=> {
            saveComposeMessage({
                ...message,
                files: [...message.files, img],
            });
            setComposeOn(true);
        })
        .catch( e => console.warn("camera error " + e));
    }

    React.useEffect(()=>{
        BackHandler.addEventListener('hardwareBackPress', backAction);
        return ()=> BackHandler.removeEventListener('hardwareBackPress', backAction);
    },[])

    return <>
        {actions.map(ab => <IconButton
                key={ab.icon}
                style={{margin: 0, borderRadius: 0, backgroundColor: ab.color, width: '50%'}}
                size={40}
                icon={ab.icon}
                onLongPress={()=>{
                    switch( ab.icon){
                        case 'camera':
                            takePic('video');
                            break;
                        default:
                    }
                }}
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
                        case 'camera':
                            takePic('photo');
                            break;
                        default:
                            console.warn("TODO implement action")
                    }
                }}
            />
        )}
    </>
}

const FloatingActions = () => {
    const [expanded, setExpanded] = React.useState(false);
    const {composing, setComposeOn, vrState, showTextInputOn} = React.useContext(MessageEditorContext) as MessageEditorContextType;
    const {fabOpacity} = React.useContext(ThemeContext) as ThemeContextType;
    
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
            opacity: fabOpacity,
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
                width: expanded && fabOpacity === 1 ? 150 : 'auto'
            }
        ]}
    >
        { !expanded || fabOpacity !== 1 ?
        <FAB
            style={{margin: 3, borderRadius: 0, backgroundColor: '#636363'}}
            icon="pencil"
            onLongPress={()=>{
                setExpanded(true);
            }}
            onPress={pencilClicked}
        /> : <ExtendedActions onBack={()=>setExpanded(false)}/>
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
    const {theme} = React.useContext(ThemeContext) as ThemeContextType;

    return (
    <MessagesContextProvider>
        <MessageEditorProvider>
        <SafeAreaView style={{backgroundColor: theme.color.secondary}}>
            <Tiler/>
            <VoiceRecorder/>
            <FloatingActions/>
        </SafeAreaView>
        </MessageEditorProvider>
    </MessagesContextProvider>
    );
}