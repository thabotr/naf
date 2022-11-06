import React from 'react';
import { FlatList, Image, ToastAndroid, View} from 'react-native';
import { Card, Paragraph, IconButton, List, Portal, Dialog, Chip} from 'react-native-paper';

import { ThemeContext, ThemeContextType } from '../context/theme';
import { MessageFile } from '../types/message';
import { VoiceNoteCard } from './voiceNote';
import { HorizontalView, OnlyShow, OverlayedView, Show, vidIconOverlay } from './helper';
import { Message, MessageEditorContext, MessageEditorContextType } from '../context/messageEditor';
import { openFile } from '../src/fileViewer';
import { MessagesContext, MessagesContextType } from '../context/messages';
import { UserContext, UserContextType } from '../context/user';
import { verboseDuration, verboseSize, verboseTime } from '../src/helper';

export const ImagePreviewCard = ({source}:{source: {uri: string}}) => {
    return <Card
        onPress={()=>openFile(source.uri)}
        style={{margin: 1, flexGrow: 1}}
    >
        <Card.Cover
            source={source}
        />
    </Card>
}

// TODO use dynamic value for iconSize
export const VidPreviewCard = ({iconSize=64, source}:{iconSize?: number, source: {uri: string}}) => {
    return (
    <Card
        onPress={()=>openFile(source.uri)}
        style={{flexGrow: 1, margin: 1}}
    >
        <Card.Cover style={{opacity: 0.9}} source={source} />
        {vidIconOverlay(iconSize)}
    </Card>
    );
}

export const AudioPreviewCard = ({audio, user=true}:{audio: MessageFile, user?: boolean}) => {
    const {theme} = React.useContext(ThemeContext) as ThemeContextType;
    //TODO determine audio length so can add to card
    return (
        <Card
            onPress={()=>openFile(audio.uri)}
            style={{flex: 1, margin: 1, backgroundColor: user ? theme.color.userSecondary : theme.color.friendSecondary}}
        >
            <List.Item
                style={{margin: 0, padding: 0}}
                title={<Paragraph style={{color: theme.color.textPrimary, textShadowColor: theme.color.textSecondary}}>{verboseDuration(audio.duration ?? 0)}</Paragraph>}
                description={<Paragraph style={{color: theme.color.textPrimary, textShadowColor: theme.color.textSecondary}}>{`[${audio.name}] ${verboseSize(audio.size ?? 0)}`}</Paragraph>}
                left={props => <List.Icon {...props} icon="file-music" />}
            />
        </Card>
    );
}

const fileTypeIcon = new Map([
    ["application/pdf", "file-pdf-box"],
    ["application/zip", "folder-zip"]
])

export const FilePreviewCard = ({file, user=true}:{file: {uri: string, type: string, size: number, name: string}, user?: boolean})=> {
    const {theme} = React.useContext(ThemeContext) as ThemeContextType;
    return <Card
                onPress={()=>openFile(file.uri)}
                style={{flex: 1, margin: 1, backgroundColor: (user ? theme.color.userSecondary : theme.color.friendSecondary)}}
            >
                <List.Item
                    style={{margin: 0, padding: 0}}
                    title={<Paragraph style={{color: theme.color.textPrimary, textShadowColor: theme.color.textSecondary}}>{`${verboseSize(file.size)} [${file.type.split('/')[file.type.split('/').length-1]}]`}</Paragraph>}
                    description={<Paragraph style={{color: theme.color.textPrimary, textShadowColor: theme.color.textSecondary}} numberOfLines={1}>{`${file.name}`}</Paragraph>}
                    left={props => <List.Icon {...props} icon={fileTypeIcon.get(file.type) ?? "file"} />}
                />
            </Card>
}

export const ExpandableParagraph = ({text}:{text:string}) => {
    const [expanded, setExpanded] = React.useState(false);
    const {theme} = React.useContext(ThemeContext) as ThemeContextType;
    const toggleExpanded = () => {
        if( expanded ) setExpanded( false);
        else setExpanded(true);
    }

    return <Show
        component={
            <>
            <Paragraph style={{color: theme.color.textPrimary, textShadowColor: theme.color.textSecondary}} onPress={toggleExpanded} numberOfLines={!expanded ? 2 : 0}>{text}</Paragraph>
            <IconButton
                onPress={toggleExpanded}
                style={{
                    width: '100%',
                    transform: [{rotate: expanded ? '180deg' : '0deg'}],
                }}
                size={10}
                icon={{uri: 'https://img.icons8.com/material-sharp/24/000000/give-way--v1.png'}}
            />
            </>
        }
        If={text.length > 150}
        ElseShow={<Paragraph style={{color: theme.color.textPrimary, textShadowColor: theme.color.textSecondary}}>{text}</Paragraph>}
    />
}

type SeparatedFiles = {
    recordings: MessageFile[],
    visuals: MessageFile[],
    others: MessageFile[],
}

export function separateFiles( fls: MessageFile[]): SeparatedFiles {
    return {
        recordings: fls.filter( f=> f.type.split('/')[0] === 'recording'),
        visuals: fls.filter( f => f.type.split('/')[0] === 'image' || f.type.split('/')[0] === 'video'),
        others: fls.filter( f => !(
            f.type.split('/')[0] === 'recording' ||
            f.type.split('/')[0] === 'image' ||
            f.type.split('/')[0] === 'video'
        ))
    }
}

export enum DeliveryStatus {
    ERROR,
    UNSEEN,
    SEEN,
    NONE,
}

function MessageFilesPreview({msg, onDismiss}:{msg: Message, onDismiss: ()=>void}){
    const {user} = React.useContext(UserContext) as UserContextType;
    const {theme} = React.useContext(ThemeContext) as ThemeContextType;
    const fromUser = msg.from === user?.handle;
    return <Portal>
    <Dialog
        style={{backgroundColor:  fromUser? theme.color.userPrimary : theme.color.friendPrimary}}
        visible={true}
        onDismiss={onDismiss}
    >
        <Dialog.Title>all attachments</Dialog.Title>
        <Dialog.Content style={{maxHeight: 700}}>
        <FlatList
            data={msg.files.map((f,i)=> { return {
                id: `${i}`,
                title: f.uri,
            }})}
            renderItem={({item})=> {
                const f = msg.files[Number(item.id)] ?? {type: '', uri: ''};
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
            <IconButton icon="close" onPress={onDismiss}/>
        </Dialog.Actions>
    </Dialog>
</Portal>
}

export const MessageCard = ({msg}:{msg: Message}) => {
    const {user} = React.useContext(UserContext) as UserContextType;
    const {theme} = React.useContext(ThemeContext) as ThemeContextType;
    const {deleteMessages, addMessages} = React.useContext(MessagesContext) as MessagesContextType;
    const {saveComposeMessage, setComposeOn} = React.useContext(MessageEditorContext) as MessageEditorContextType;
    const [previewingFiles, setPreviewingFiles] = React.useState(false);

    const { visuals, recordings, others} = separateFiles( msg.files);
    const sender = user?.handle === msg.from;

    const otherFiles = others;
    const voiceRecordings = recordings;

    const renderVisualFiles = () => {
        return <HorizontalView>
            {visuals.slice(0,4).map((vz: {type: string, uri: string}, i:number)=>
                <Show key={vz.uri}
                    component={<ImagePreviewCard source={vz}/>}
                    If={vz.type.split('/')[0] === 'image'}
                    ElseShow={<VidPreviewCard iconSize={64} source={vz}/>}
                />
            )}
        </HorizontalView>
    }

    const renderOtherFiles = () => {
        return (
            <>
                <HorizontalView>
                    {otherFiles.slice(0,2).map( f => <Show
                        component={<AudioPreviewCard audio={f} user={sender}/>}
                        If={f.type.split('/')[0] === 'audio'}
                        ElseShow={<FilePreviewCard 
                            file={{ name: f.name ?? 'noname', size: f.size ?? 0, type: f.type, uri: f.uri }}
                            user={sender}
                            />}
                        key={f.uri}
                    />)}
                </HorizontalView>
                <OnlyShow If={otherFiles.slice(2).length+visuals.slice(4).length > 0}>
                <Chip onPress={()=>setPreviewingFiles(true)} style={{borderRadius: 0, margin: 2, backgroundColor: sender ? theme.color.userSecondary : theme.color.friendSecondary}} icon='file-multiple'>
                    <Paragraph style={{color: theme.color.textPrimary, textShadowColor: theme.color.textSecondary}}>Preview all {otherFiles.slice(2).length+visuals.slice(4).length} attachaments</Paragraph>
                </Chip>
                </OnlyShow>
            </>
        );
    }

    const senderOrFriendColor = sender ? theme.color.userPrimary : theme.color.friendPrimary;

    const deleteThisMessage = ()=>{
        deleteMessages([{
            messageId: msg.id,
            from: msg.from,
            to: msg.to,
        }]);
    }
    const deliveryStatuses = new Map<DeliveryStatus,{icon: string, message: string}>([
        [DeliveryStatus.ERROR, {icon: 'message-alert', message: 'message delivery failed'}],
        [DeliveryStatus.SEEN, {icon: 'eye', message: 'message viewed'}],
        [DeliveryStatus.UNSEEN, {icon: 'eye-off', message: 'message delivered'}],
        [DeliveryStatus.NONE, {icon: 'circle-small', message: 'message status'}]
    ])

    const displayMessageStatus = () => {
        ToastAndroid.show(deliveryStatuses.get(msg.status??DeliveryStatus.NONE)?.message ?? '', 3_000);
    }

    const draftOverlay = () => {
        return <OnlyShow If={msg.daft}>
            <OverlayedView style={{backgroundColor: theme.color.userSecondary, margin: 3, borderRadius: 3, opacity: 0.8}}>
                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    backgroundColor: theme.color.primary,
                    }}
                >
                    <IconButton
                        size={30}
                        style={{backgroundColor: theme.color.userPrimary, borderRadius: 0, margin: 0}}
                        icon='delete'
                        onPress={deleteThisMessage}
                    />
                    <IconButton
                        size={30}
                        style={{backgroundColor: theme.color.userPrimary, borderRadius: 0, margin: 0}}
                        icon='pencil'
                        onPress={()=>{
                            saveComposeMessage(msg);
                            deleteThisMessage();
                            setComposeOn(true);
                        }}
                    />
                    <IconButton
                        size={30}
                        style={{backgroundColor: theme.color.userPrimary, borderRadius: 0, margin: 0}}
                        icon='send'
                        onPress={()=>{
                            addMessages([{...msg, id: `${new Date().getTime()}`}]);
                            deleteThisMessage();
                        }}
                    />
                </View>
            </OverlayedView>
        </OnlyShow>
    }

    return <>
        <OnlyShow If={previewingFiles}>
            <MessageFilesPreview msg={msg} onDismiss={()=>setPreviewingFiles(false)}/>
        </OnlyShow>
        <OnlyShow If={!!msg.text || !!msg.files.length}>
        <Card style={{backgroundColor: senderOrFriendColor, margin: 2}}>
            <View style={{padding: 7}}>
                <OnlyShow If={!!msg.text}>
                    <ExpandableParagraph text={msg.text ?? ''}/>
                </OnlyShow>
                {voiceRecordings.map(t => <VoiceNoteCard
                    key={t.uri}
                    file={{uri:t.uri, size: t.size ?? 0, durationSecs: t.duration ?? 0}}
                    user={sender}
                    />)
                }
                {renderVisualFiles()}
                {renderOtherFiles()}

                <HorizontalView>
                <OnlyShow If={sender && !!msg.status}>
                    <IconButton
                        size={15}
                        onPress={()=>{}}
                        onLongPress={displayMessageStatus}
                        icon={deliveryStatuses.get(msg.status??DeliveryStatus.NONE)?.icon ?? 'circle-small'}
                        style={{padding: 0, margin: 0, borderRadius: 0}}
                    />
                </OnlyShow>
                <OnlyShow If={!!msg.timestamp}>
                    <Paragraph
                        style={{
                            alignSelf: 'flex-start',
                            paddingHorizontal: 10,
                            color: theme.color.textPrimary,
                            textShadowColor: theme.color.textSecondary,
                            backgroundColor: sender ? theme.color.userSecondary : theme.color.friendSecondary,
                            borderRadius: 5,
                            marginTop: 2,
                            opacity: 0.5,
                        }}
                    >
                        {verboseTime(msg.timestamp)}
                    </Paragraph>
                </OnlyShow>
                </HorizontalView>

                {draftOverlay()}
            </View>
        </Card>
        </OnlyShow>
    </>
}

export const VisualPreview = ({mFile}:{mFile:MessageFile})=> {
    return <Card
        onPress={()=>openFile(mFile.uri)}
        elevation={0} style={{borderRadius: 0, flex: 1, height: 80, margin: 1, flexGrow: 1}}>
        <Show
            component={<Image style={{flex: 1, height: 80, margin: 1}} source={mFile}/>}
            If={mFile.type.split('/')[0] === 'image'}
            ElseShow={<>
                <Image style={{height: '100%' , opacity: 0.8}} source={{ uri: mFile.uri}}/>
                {vidIconOverlay(32)}
            </>}
        />
    </Card>
}