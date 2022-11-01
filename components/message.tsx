import React from 'react';
import { Image, ToastAndroid, View} from 'react-native';
import { Card, Paragraph, IconButton, List} from 'react-native-paper';

import { ThemeContext, ThemeContextType } from '../context/theme';
import { MessageFile } from '../types/message';
import { verboseDuration, VoiceNoteCard } from './voiceNote';
import { HorizontalView, OnlyShow, OverlayedView, Show, vidIconOverlay } from './helper';
import { Message, MessageEditorContext } from '../context/messageEditor';
import { openFile } from '../src/fileViewer';
import { MessagesContext, MessagesContextType } from '../context/messages';
import { UserContext, UserContextType } from '../context/user';
import { MessageEditorContextType } from '../types/MessageEditor';

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
                title={<Paragraph>{verboseDuration(audio.duration ?? 0)}</Paragraph>}
                description={<Paragraph>{`[${audio.name}] ${verboseSize(audio.size ?? 0)}`}</Paragraph>}
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
                    title={<Paragraph>{`${verboseSize(file.size)} [${file.type.split('/')[file.type.split('/').length-1]}]`}</Paragraph>}
                    description={<Paragraph numberOfLines={1}>{`${file.name}`}</Paragraph>}
                    left={props => <List.Icon {...props} icon={fileTypeIcon.get(file.type) ?? "file"} />}
                />
            </Card>
}

export const FileRemainingCard = ({numberRemaining=0, user=true, msg}:{numberRemaining?: number, user?: boolean, msg: Message})=> {
    const {theme} = React.useContext(ThemeContext) as ThemeContextType;
    const {openMessage} = React.useContext(MessagesContext) as MessagesContextType;
    return <OnlyShow If={numberRemaining > 0}>
      <Card
        onPress={()=>{
            openMessage(msg);
        }}
        style={{backgroundColor: ( user ? theme.color.userSecondary : theme.color.friendSecondary)}}>
          <Paragraph style={{textAlign: 'center'}}>+{numberRemaining} more</Paragraph>
      </Card>
    </OnlyShow>
}

export const ExpandableParagraph = ({text}:{text:string}) => {
    const [expanded, setExpanded] = React.useState(false);
    const toggleExpanded = () => {
        if( expanded ) setExpanded( false);
        else setExpanded(true);
    }

    return <Show
        component={
            <>
            <Paragraph onPress={toggleExpanded} numberOfLines={!expanded ? 2 : 0}>{text}</Paragraph>
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
        ElseShow={<Paragraph>{text}</Paragraph>}
    />
}

type SeperatedFiles = {
    recordings: MessageFile[],
    visuals: MessageFile[],
    others: MessageFile[],
}

export function separateFiles( fls: MessageFile[]): SeperatedFiles {
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

export const MessageCard = ({msg}:{msg: Message}) => {
    const {userId} = React.useContext(UserContext) as UserContextType;
    const {theme} = React.useContext(ThemeContext) as ThemeContextType;
    const {deleteMessages} = React.useContext(MessagesContext) as MessagesContextType;
    const {saveComposeMessage, setComposeOn} = React.useContext(MessageEditorContext) as MessageEditorContextType;

    const { visuals, recordings, others} = separateFiles( msg.files);
    const sender = userId === msg.senderId;

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
                    <FileRemainingCard msg={msg} numberRemaining={otherFiles.slice(2).length+visuals.slice(4).length} user={sender}/>
                </OnlyShow>
            </>
        );
    }

    const senderOrFriendColor = sender ? theme.color.userPrimary : theme.color.friendPrimary;

    const deleteThisMessage = ()=>{
        deleteMessages([{
            messageId: msg.id,
            senderId: msg.senderId,
            recipientId: msg.recipientId,
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

    return <OnlyShow If={!!msg.text || !!msg.files.length}>
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

                <OnlyShow If={msg.id.includes('draft')}>
                    <OverlayedView style={{backgroundColor: theme.color.secondary, margin: 3, borderRadius: 3, opacity: 0.8}}>
                        <View style={{
                            display: 'flex',
                            flexDirection: 'row',
                            backgroundColor: theme.color.primary,
                            }}
                        >
                            <IconButton
                                size={30}
                                style={{backgroundColor: theme.color.primary, borderRadius: 0, margin: 0}}
                                icon='delete'
                                onPress={deleteThisMessage}
                            />
                            <IconButton
                                size={30}
                                style={{backgroundColor: theme.color.primary, borderRadius: 0, margin: 0}}
                                icon='pencil'
                                onPress={()=>{
                                    saveComposeMessage(msg);
                                    deleteThisMessage();
                                    setComposeOn(true);
                                }}
                            />
                            <IconButton
                                size={30}
                                style={{backgroundColor: theme.color.primary, borderRadius: 0, margin: 0}}
                                icon='send'
                                onPress={()=>{
                                    //TODO send this draft and add it to messages
                                }}
                            />
                        </View>
                    </OverlayedView>
                </OnlyShow>
            </View>
        </Card>
    </OnlyShow>
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

export const verboseSize = (bytes: number):string=> {
    if( bytes < 1024) return `${bytes}B`;
    const kBs = Math.floor(bytes/1024);
    if( kBs < 1024) return `${(bytes/1024).toFixed(1)}KB`;
    const mBs = Math.floor(kBs/1024);
    if( mBs < 1024) return `${(bytes/1024**2).toFixed(1)}MB`;
    return `${(bytes/1024**3).toFixed(1)}GB`;
}

export const verboseTime = (time?: Date):string|undefined => {
    if(!time){
        return undefined;
    }
    const now = new Date();
    const timeDiffSec = Math.floor(Math.abs(now.getTime() - time.getTime())/1_000);
    const min = 60;
    const hour = min*60;
    const day = hour*24;
    const week = day*7;
    const TimeDifference = {
        WEEKS: Math.floor(timeDiffSec/week),
        DAYS: Math.floor(timeDiffSec/day),
        HOURS: Math.floor(timeDiffSec/hour),
        MINUTES: Math.floor(timeDiffSec/min)
    }
    if( TimeDifference.WEEKS > 1) return `${time.toLocaleTimeString()}, ${time.toLocaleDateString()}`;
    if( TimeDifference.WEEKS === 1) return 'a week ago';
    if( TimeDifference.DAYS > 1) return `${TimeDifference.DAYS} days ago`;
    if( TimeDifference.DAYS === 1) return 'a day ago';
    if( TimeDifference.HOURS > 1) return `${TimeDifference.HOURS} hours ago`;
    if( TimeDifference.HOURS === 1) return 'an hour ago';
    if( TimeDifference.MINUTES > 1) return `${TimeDifference.MINUTES} minutes ago`;
    return 'just now';
}