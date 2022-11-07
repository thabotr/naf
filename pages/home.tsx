import React from 'react';
import {ScrollView, View, ViewStyle} from 'react-native';
import {Card, IconButton as RNPIconButton, List, Paragraph, Surface} from 'react-native-paper';
import TrackPlayer, { RepeatMode, State as PlayState, useProgress, Track} from 'react-native-track-player';
import RNFetchBlob from 'rn-fetch-blob';

import { ChatPreviewCard } from '../components/chatPreviewCard';
import { HorizontalView, OnlyShow, OverlayedView } from '../components/helper';
import { ChatContext, ChatContextType } from '../context/chat';
import { ListenWithMeContext, ListenWithMeContextProvider, ListenWithMeContextType } from '../context/listenWithMe';
import {ThemeContext, ThemeContextType} from '../context/theme';
import { getAudioMetadata } from '../src/audio';
import { verboseDuration } from '../src/helper';
import {Chat} from '../types/chat';
import { URLS } from '../types/routes';

function IconButton({If, icon, onPress, style}:{icon: string, onPress: ()=>void, If?:boolean, style?: ViewStyle}){
    if( If===undefined || If)
        return <RNPIconButton icon={icon} onPress={onPress} style={style}/>;
    return null;
}

function ListenWithMeCard(){
    const {theme} = React.useContext(ThemeContext) as ThemeContextType;
    const [expanded, setExpanded] = React.useState(true);
    const [repeatMode, setRepeatMode] = React.useState(RepeatMode.Off);
    const {listeningWith, currentTrack, playState, stopPlayer} = React.useContext(ListenWithMeContext) as ListenWithMeContextType;
    const {chats} = React.useContext(ChatContext) as ChatContextType;
    const [currentTrackInd, setCurrentTrackInd] = React.useState(0);
    const [tracks, setTracks] = React.useState<Track[]>([]);

    const toggleRepeatMode = ()=>setRepeatMode((repeatMode+1)%(Object.keys(RepeatMode).length/2));

    const updateCurrentTrack = ()=>TrackPlayer.getCurrentTrack()
        .then(i=>{if(i!==null)setCurrentTrackInd(i)})
        .catch(e => console.log('failed to update current track', e));

    const updateTracks = ()=>TrackPlayer.getQueue().then(ts=>setTracks(ts))
        .catch(e => console.log('failed to update tracks', e));

    React.useEffect(()=>{
        TrackPlayer.setRepeatMode(repeatMode);
        updateCurrentTrack();
        updateTracks();
    },[listeningWith])

    const {position, duration} = useProgress(1000);

    React.useEffect(()=>{
        if(!!listeningWith){
            const chat = chats.find(c=> listeningWith === c.user.handle);
            chat && TrackPlayer.reset().then(_=>{
                getAudioMetadata(`http://10.0.2.2:3000/listenwithme/${chat.user.handle.replace('->', '')}/listen1`)
                .then( res => {
                    res && TrackPlayer.add(res)
                    .catch(e => console.log('error when adding listen with me track', e));
                })
                .catch( e => console.log('on get audio metadata', e));
            })
        }
    }, [listeningWith])

    return <OnlyShow If={!!listeningWith}>
    <Card style={{marginHorizontal: 3, marginBottom: 3, paddingHorizontal: 5, borderBottomEndRadius: 10, borderBottomLeftRadius: 10}}>
        <Paragraph style={{textAlign: 'center', opacity: 0.5}}>Enjoying the bangers {listeningWith}</Paragraph>
        <OnlyShow If={expanded}>
            <Card.Content>
                <HorizontalView>
                <Surface style={{flex: 1, height: 150, elevation: 3, width: '40%'}}>
                    <ScrollView>
                    {tracks.map((t,i)=> <List.Item
                        style={{borderWidth: 1, borderRadius: 3, margin: 5}}
                        onPress={()=>TrackPlayer.skip(i).then(_=> TrackPlayer.play()).catch(e=>console.log('failed to play track', e))}
                        title={t.title ?? `track ${i+1}`}
                        description={`${t.duration ? verboseDuration(t.duration) : ''} ${t.artist ?? ''}${t.album ? '/'.concat(t.album) : ''}`}
                        key={t.url}
                        />
                    )}
                    </ScrollView>
                </Surface>
                <View style={{flex: 1}}>
                    <OverlayedView>
                    <Card style={{flex: 1, padding: 5, width: '100%', height: '100%'}}>
                        <List.Item title={currentTrack?.title ?? `track ${currentTrackInd + 1}`} description={`${currentTrack?.artist ?? ''}/${currentTrack?.album ?? ''}`}/>
                        <View style={{flex: 1}}></View>
                        <HorizontalView>
                            <Paragraph style={{flex: 1}}>{verboseDuration(position)}</Paragraph>
                            <Paragraph style={{flex: 1, textAlign: 'right'}}>{verboseDuration(duration)}</Paragraph>
                        </HorizontalView>
                    </Card>
                    </OverlayedView>
                </View>
                </HorizontalView>
            </Card.Content>
        </OnlyShow>
        <HorizontalView>
            <OnlyShow If={!expanded}>
                <HorizontalView style={{flex: 1, alignItems: 'center', justifyContent: 'space-between', marginLeft: 5}}>
                    <View>
                        <OnlyShow If={!!currentTrack?.artist}>
                        <Paragraph>{currentTrack?.artist}</Paragraph>
                        </OnlyShow>
                        <Paragraph>{currentTrack?.title ?? `track ${currentTrackInd + 1}`}-{currentTrack?.album}</Paragraph>
                    </View>
                    <Paragraph>{verboseDuration(position)}/{verboseDuration(duration)}</Paragraph>
                </HorizontalView>
            </OnlyShow>
            <Card.Actions style={{flex: 1, justifyContent: 'center'}}>
                <IconButton
                    icon='skip-previous-circle-outline'
                    onPress={()=>{
                        if( position <= 5){
                            TrackPlayer.skipToPrevious();
                        }else {
                            TrackPlayer.seekTo(0);
                        }
                    }}
                />
                <IconButton If={expanded} icon='rewind-10' onPress={()=>TrackPlayer.seekTo(Math.max(position-10, 0))}/>
                <IconButton
                    icon={playState !== PlayState.Playing ? 'play' : 'pause'}
                    onPress={()=> playState === PlayState.Playing ? TrackPlayer.pause() : TrackPlayer.play()}
                />
                <IconButton icon='stop' onPress={stopPlayer}/>
                <IconButton If={expanded} icon='fast-forward-10' onPress={()=>TrackPlayer.seekTo(Math.min(position+10, duration))}/>
                <IconButton icon='skip-next-circle-outline' onPress={()=>TrackPlayer.skipToNext()}/>
                <IconButton
                    If={expanded}
                    style={{opacity: repeatMode === RepeatMode.Off ? 0.5 : 1}}
                    icon={
                        repeatMode === RepeatMode.Queue ? 'repeat' :
                        repeatMode === RepeatMode.Track ? 'repeat-once' : 'repeat-off'
                    }
                    onPress={toggleRepeatMode}
                />
            </Card.Actions>
            <IconButton
                style={{borderRadius: 0, alignSelf: 'center'}}
                icon={expanded ? 'chevron-up' : 'chevron-down'}
                onPress={()=>setExpanded(!expanded)}
            />
        </HorizontalView>
    </Card>
    </OnlyShow>
}

export function Home({navigation}:{navigation:any}) {
    const {theme} = React.useContext(ThemeContext) as ThemeContextType;
    const {saveChats, chats} = React.useContext(ChatContext) as ChatContextType;

    const fetchChats = () => {
        RNFetchBlob.fetch('GET', URLS.CHATS)
        .then(r => {
            if( r.info().status === 200){
                const cs = r.json() as Chat[] ;
                cs.forEach(c => {
                    c.messages.forEach(m=>{
                        if(!m.files) m.files = [];
                        if(!m.voiceRecordings) m.voiceRecordings = [];
                    })
                })
                saveChats(cs);
            }
        }).catch(e => console.error('error fetching chats ' + e));
    }

    React.useEffect(()=>{
        fetchChats();
    },[])
    return (
        <ListenWithMeContextProvider>
        <View style={{height: '100%', backgroundColor: theme.color.secondary}}>
        <ListenWithMeCard/>
        <ScrollView style={{backgroundColor: theme.color.secondary}}>
            {chats.map( c => <ChatPreviewCard key={c.user?.handle ?? ''} chat={c} navigation={navigation}/>)}
        </ScrollView>
        </View>
        </ListenWithMeContextProvider>
    );
}