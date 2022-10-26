import React from 'react';
import { Image} from 'react-native';
import { Card, Paragraph, IconButton, List, Chip} from 'react-native-paper';
import {Toast} from 'toastify-react-native';

import {ImageViewContext} from '../context/images';
import {ImageViewContextType} from '../types/images';
import { ThemeContext } from '../context/theme';
import { ThemeContextType } from '../types/theme';
import { MessageFile } from '../types/message';
import { verboseDuration } from './voiceNote';
import { HorizontalView, numberRemainingOverlay, OnlyShow, Show, vidIconOverlay } from './helper';

// TODO use dynamic value for iconSize
export const VidPreviewCard = ({iconSize=64, source, numberRemaining=0}:{iconSize?: number, source: {uri: string}, numberRemaining?: number}) => {
    const {theme} = React.useContext(ThemeContext) as ThemeContextType;
    const single = <>
        <Card.Cover style={{opacity: 0.8}} source={source} />
        {vidIconOverlay(iconSize)}
    </>
    const extra = <>
        <Card.Cover style={{opacity: 0.5}} source={source} />
        {vidIconOverlay(iconSize)}
        {numberRemainingOverlay(numberRemaining)}
    </>

    return (
    <Card
        onPress={()=>{
            Toast.warn('TODO bring up message visuals with this vid in focus');
        }}
        style={{flexGrow: numberRemaining > 0 ? 0.5 : 1, margin: 1}}
    >
        {numberRemaining > 0 ? extra : single}
    </Card>
    );
}


export const AudioPreviewCard = ({audio, user=true}:{audio: MessageFile, user?: boolean}) => {
    const {theme} = React.useContext(ThemeContext) as ThemeContextType;
    return (
        <Card
            onPress={()=>{
                Toast.warn('TODO launch external music player with this messages audio and have this one in focus');
            }}
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
                onPress={()=>console.warn("TODO open external file viewer")}
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

export const FileRemainingCard = ({numberRemaining=0, user=true}:{numberRemaining?: number, user?: boolean})=> {
    const {theme} = React.useContext(ThemeContext) as ThemeContextType;
    return <OnlyShow If={numberRemaining > 0}>
      <Card
        onPress={()=>console.warn("TODO open external file viewer")}
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

export const ImagePreviewCard = ({source, numberRemaining=0}:{source: {uri: string}, numberRemaining?: number}) => {
    const {saveImages, onViewOn} = React.useContext(ImageViewContext) as ImageViewContextType;

    // todo get all media for associated image
    const oneElseHalf = numberRemaining === 0 ? 1 : 0.5;
    return <Card
        onPress={()=>{}}
        style={{margin: 1, flexGrow: oneElseHalf}}
    >
        <Card.Cover
            style={{opacity: oneElseHalf}}
            source={source}
        />
        <OnlyShow If={numberRemaining > 0}>
           {numberRemainingOverlay(numberRemaining)}
        </OnlyShow>
    </Card>
}

export const MessageCard = ({msg, sender=true}:{msg: {
    userId: string,
    id: string,
    text?: string,
    files: {
        name?: string,
        type: string,
        uri: string,
        size?: number,
        duration?: number,
    }[]
}, sender?: boolean}) => {
    const {theme} = React.useContext(ThemeContext) as ThemeContextType;
    const visuals = msg.files.filter(f => f.type.split('/')[0] === 'image' || f.type.split('/')[0] === 'video');
    const otherFiles = msg.files.filter(f => !(f.type.split('/')[0] === 'image' || f.type.split('/')[0] === 'video'));

    const renderVisualFiles = () => {
        return <HorizontalView>
            {visuals.slice(0,4).map((vz: {type: string, uri: string}, i:number)=>
                <Show key={vz.uri}
                    component={<ImagePreviewCard source={vz} numberRemaining={ i==3 ? visuals.slice(3).length : 0}/>}
                    If={vz.type.split('/')[0] === 'image'}
                    ElseShow={<VidPreviewCard iconSize={64} source={vz} numberRemaining={ i==3 ? visuals.slice(3).length : 0}/>}
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
                <OnlyShow If={otherFiles.length > 2}>
                    <FileRemainingCard numberRemaining={otherFiles.slice(2).length} user={sender}/>
                </OnlyShow>
            </>
        );
    }

    const msgHasNoTextNorFiles = !msg.text && otherFiles.length === 0 ;
    const msgIsEmpty = msgHasNoTextNorFiles && visuals.length === 0;
    const msgHasJustOneVisual = msgHasNoTextNorFiles && visuals.length === 1;
    const msgHasJustOneFile = otherFiles.length === 1 && visuals.length === 0;

    const senderOrFriendColor = sender ? theme.color.userPrimary : theme.color.friendPrimary;
    
    if(msgIsEmpty) return <></>;
    if(msgHasJustOneVisual){
        return <Card
            style={{backgroundColor: senderOrFriendColor,
            margin: 2,
            padding: 3}}
        >
            <Show
                component={<ImagePreviewCard source={visuals[0]}/>}
                If={visuals[0].type === 'image'}
                ElseShow={<VidPreviewCard source={visuals[0]} iconSize={96}/>}
            />
        </Card>
    }
    if(msgHasJustOneFile){
        const f = otherFiles[0];
        return <FilePreviewCard file={{ name: f.name ?? 'noname', size: f.size ?? 0, type: f.type, uri: f.uri }} user={sender}/>
    }

    return (
        <Card style={{backgroundColor: senderOrFriendColor, margin: 2}}>
            <Card.Content>
                <ExpandableParagraph text={msg.text ?? ''}/>
                {renderVisualFiles()}
                {renderOtherFiles()}
            </Card.Content>
        </Card>
    );
}

export const VisualPreview = ({mFile, numberRemaining=0}:{mFile:MessageFile, numberRemaining?:number})=> {
    return <Card
        onPress={()=>{
            console.warn("TODO bring up visualizer with this visual on focus and delete options");
        }}
        onLongPress={()=>console.warn("TODO bring up media selector for deletion from message")}
        elevation={0} style={{borderRadius: 0, flex: 1, height: 80, margin: 1, flexGrow: numberRemaining > 0 ? 0.5 : 1}}>
        <Show
            component={<>
                <Image style={{flex: 1, height: 80, margin: 1, opacity: numberRemaining > 0 ? 0.5 : 1}} source={mFile}/>
                {numberRemainingOverlay(numberRemaining)}
            </>}
            If={mFile.thumbnailUrl === ''}
            ElseShow={<>
                <Image style={{height: '100%' , opacity: numberRemaining > 0 ? 0.5 : 0.8}} source={{ uri: mFile.thumbnailUrl}}/>
                {vidIconOverlay(32)}
                {numberRemainingOverlay(numberRemaining)}
            </>}
        />
    </Card>
}

export const verboseSize = (bytes: number):string=> {
    if( bytes < 1024) return `${bytes}B`;
    const kBs = Math.floor(bytes/1024);
    if( kBs < 1024) return `${kBs}KB`;
    const mBs = Math.floor(kBs/1024);
    if( mBs < 1024) return `${mBs}MB`;
    const gBs = Math.floor(mBs/1024);
    return `${gBs}GB`;
}