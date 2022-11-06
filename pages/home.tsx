import React from 'react';
import {ScrollView, Image, View} from 'react-native';
import {Banner, Button, Card, IconButton, List, Paragraph, Surface} from 'react-native-paper';
import TrackPlayer, { RepeatMode, State as PlayState, useTrackPlayerEvents, Event as PlayerEvent, useProgress, Track} from 'react-native-track-player';
import RNFetchBlob from 'rn-fetch-blob';

import { ChatPreviewCard } from '../components/chatPreviewCard';
import { HorizontalView, OnlyShow, OverlayedView } from '../components/helper';
import { ChatContext, ChatContextType } from '../context/chat';
import { ListenWithMeContext, ListenWithMeContextProvider, ListenWithMeContextType } from '../context/listenWithMe';
import {ThemeContext, ThemeContextType} from '../context/theme';
import {UserContext, UserContextType} from '../context/user';
import { verboseDuration } from '../src/helper';
import {Chat} from '../types/chat';
import { URLS } from '../types/routes';
import {User} from '../types/user';


function ListenWithMeCard(){
    const {theme} = React.useContext(ThemeContext) as ThemeContextType;
    const [expanded, setExpanded] = React.useState(true);
    const [playState, setPlayState] = React.useState(PlayState.Stopped);
    const [repeatMode, setRepeatMode] = React.useState(RepeatMode.Off);
    const {listeningWith} = React.useContext(ListenWithMeContext) as ListenWithMeContextType;
    const {chats} = React.useContext(ChatContext) as ChatContextType;
    const [currentTrackInd, setCurrentTrackInd] = React.useState(0);
    const [tracks, setTracks] = React.useState<Track[]>([]);

    TrackPlayer.setRepeatMode(repeatMode);

    const toggleRepeatMode = ()=> {
        setRepeatMode((repeatMode+1)%(Object.keys(RepeatMode).length/2));
    }

    const updateCurrentTrack = () => {
        TrackPlayer.getCurrentTrack()
        .then(i=>{
            if(i !== null)
                setCurrentTrackInd(i);
        })
    }

    const updateTracks = () => {
        TrackPlayer.getQueue().then(ts=>{
            setTracks(ts);
        })
    }

    React.useEffect(()=>{
        updateCurrentTrack();
        updateTracks();
    },[])

    useTrackPlayerEvents([PlayerEvent.PlaybackState, PlayerEvent.PlaybackTrackChanged], (event) => {
        switch(event.type){
            case PlayerEvent.PlaybackState:
                setPlayState(event.state);
                break;
            case PlayerEvent.PlaybackTrackChanged:
                updateCurrentTrack();
                break;
        }
    });

    const {position, duration, buffered} = useProgress(1_000);

    React.useEffect(()=>{
        if(!!listeningWith){
            updateTracks();
            const chat = chats.find(c=> listeningWith === c.user.handle);
            if( !!chat)
            {
                TrackPlayer.reset().then(_=>{
                    TrackPlayer.add({
                        url: chat.user.listenWithMeURI,
                    })
                })
            }
        }
    }, [listeningWith])

    const currentTrack = tracks.find((_,i)=>i===currentTrackInd);

    return <OnlyShow If={playState !== PlayState.None}>
    <Card style={{marginHorizontal: 3, marginBottom: 3, paddingHorizontal: 5}}>
        <OnlyShow If={expanded}>
            <Card.Content>
                <HorizontalView>
                <Surface style={{flex: 1, height: 150, elevation: 3}}>
                    <ScrollView>
                    {tracks.map((t,i)=> <List.Item
                        style={{borderWidth: 1, borderRadius: 3, margin: 5}}
                        onPress={()=>TrackPlayer.skip(i).then(_=> TrackPlayer.play())}
                        title={t.title ?? `track ${i+1}`}
                        description={`${t.duration ? verboseDuration(t.duration) : ''} ${t.artist ?? ''}${t.album ? '/'.concat(t.album) : ''}`}
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
                        <Paragraph>{currentTrack?.title ?? `track ${currentTrackInd + 1}`} {currentTrack?.album}</Paragraph>
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
                <OnlyShow If={expanded}>
                    <IconButton icon='rewind-10' onPress={()=>TrackPlayer.seekTo(Math.max(position-10, 0))}/>
                </OnlyShow>
                <IconButton
                    disabled={playState === PlayState.None}
                    icon={playState !== PlayState.Playing ? 'play' : 'pause'}
                    onPress={()=>{
                        if(playState === PlayState.Stopped){
                            TrackPlayer.getCurrentTrack()
                            .then(ct => {
                                if( ct !== null)
                                    TrackPlayer.skip(ct);
                            })
                        }
                        else if( playState !== PlayState.Playing){
                            TrackPlayer.play();
                        }else if(playState === PlayState.Playing){
                            TrackPlayer.pause();
                        }
                    }}
                />
                <OnlyShow If={playState !== PlayState.Stopped}>
                    <IconButton icon='stop' onPress={()=>TrackPlayer.reset()}/>
                </OnlyShow>
                <OnlyShow If={expanded}>
                    <IconButton icon='fast-forward-10' onPress={()=>TrackPlayer.seekTo(Math.min(position + 10, duration))}/>
                </OnlyShow>
                <IconButton icon='skip-next-circle-outline' onPress={()=>TrackPlayer.skipToNext()}/>
                <OnlyShow If={expanded}>
                    <IconButton
                        style={{opacity: repeatMode === RepeatMode.Off ? 0.5 : 1}}
                        icon={(()=>{
                            switch(repeatMode){
                                case RepeatMode.Queue:
                                    return 'repeat';
                                case RepeatMode.Track:
                                    return 'repeat-once';
                                default:
                                    return 'repeat-off';
                            }
                        })()}
                        onPress={toggleRepeatMode}
                    />
                </OnlyShow>
            </Card.Actions>
            <IconButton style={{borderRadius: 0, alignSelf: 'center'}} icon={expanded ? 'chevron-up' : 'chevron-down'} onPress={()=>setExpanded(!expanded)}/>
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
                saveChats(cs);
            }
        }).catch(e => console.error('error fetching chats ' + e));
    }

    React.useEffect(()=>{
        fetchChats();
        // const interlocutors: User[] = [{
        //     name: 'Juliana',
        //     surname: 'Alvarez',
        //     handle: '->therealjulz',
        //     avatarURI: 'https://img.icons8.com/color/96/000000/user-female-skin-type-6.png',
        //     landscapeURI: 'https://picsum.photos/999',
        //     listenWithMeURI: 'https://up.fakazaweb.com/wp-content/uploads/2022/10/A-Reece_-_Bad_Guy_Fakaza.Me.com.mp3',
        //     initials: 'MD',
        // },
        // {
        //     avatarURI: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.jeancoutu.com%2Fen%2Fphoto%2Fphoto-related-tips%2Fselfie%2F&psig=AOvVaw2TbNYCHj_SSIBn3vm7Yly0&ust=1667562052564000&source=images&cd=vfe&ved=0CA0QjRxqFwoTCOCrrPD2kfsCFQAAAAAdAAAAABAE',
        //     name: 'Mariana',
        //     surname: 'Diaz',
        //     handle: '->marianadiaz',
        //     landscapeURI: '',
        //     listenWithMeURI: '',
        //     initials: 'MD',
        // }
        // ]
    
        // const chats: Chat[] = [
        //     {
        //         user: interlocutors[1],
        //         messages: [{
        //             from: interlocutors[1].handle,
        //             to: user?.handle ?? '',
        //             id: '1',
        //             files: [{ type: 'image', uri: 'https://picsum.photos/600', size: 0}],
        //         }],
        //         messageThreads: [],
        //     },
        //     {
        //         user: interlocutors[0],
        //         messages:[
        //             {
        //                 from: interlocutors[0].handle,
        //                 to: user?.handle ?? '',
        //                 id: '0', 
        //                 text: "spendisse nec elementum risus, in gravida enim. Pellentesque" +
        //                 "tempus quam in elit euismod, sed tempus ligula maximus. Phasellus ut. And more" +
        //                 "eque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit",
        //                 files: [
        //                     { type: 'recording/application/mp3', uri: 'uri7', size: 2_342, duration: 17},
        //                     { type: 'audio', duration: 10_000, uri: 'x', name: "recorded", size: 3_000_248_111},
        //                     { type: 'video', uri: 'https://picsum.photos/303', size: 0},
        //                     { type: 'audio', uri: 'a', name: "file.txt", size: 1001},
        //                     { type: 'application/pdf', uri: 'b', name: "file.txt", size: 1001},
        //                     { type: 'audio', uri: 'c', name: "file3.txt", size: 333},
        //                     { type: 'image', uri: 'https://picsum.photos/600', size: 0},
        //                     { type: 'image', uri: 'https://picsum.photos/401', size: 0},
        //                     { type: 'video', uri: 'https://picsum.photos/300', size: 0},
        //                     { type: 'image', uri: 'https://picsum.photos/400', size: 0},
        //                     { type: 'image', uri: 'https://picsum.photos/700', size: 0},
        //                     { type: 'image', uri: 'https://picsum.photos/800', size: 0},
        //                 ],
        //                 timestamp: new Date(),
        //             },
        //             {
        //                 from: interlocutors[0].handle,
        //                 to: user?.handle ?? '',
        //                 id: '1',
        //                 files: [{ type: 'image', uri: 'https://picsum.photos/600', size: 0}],
        //             },
        //             {
        //                 from: user?.handle ?? '',
        //                 to: interlocutors[0].handle,
        //                 id: '2',
        //                 text: "spendisse nec elementum risus, in gravida enim. Pellentesque how tillas tu",
        //                 files: [],
        //                 unread: true,
        //             },
        //             {
        //                 from: interlocutors[0].handle,
        //                 to: user?.handle ?? '',
        //                 id: '3',
        //                 files: [{ type: 'application/pdf', uri: 'pdf uri', size: 1_000_000, name: 'document.pdf'}],
        //                 unread: true,
        //             },
        //             {
        //                 from: user?.handle ?? '',
        //                 to: interlocutors[0].handle,
        //                 id: '4',
        //                 files: [
        //                     { type: 'application/pdf', uri: 'pdf uri', size: 1_000_000, name: 'document.pdf'},
        //                     { type: 'application/zip', uri: 'pdf uri3', size: 303_101, name: 'document2.pdf'}
        //                 ],
        //             },
        //             {
        //                 from: user?.handle ?? '',
        //                 to: interlocutors[0].handle,
        //                 id: '5',
        //                 files: [
        //                     { type: 'recording/application/mp3', uri: 'pdf uri', size: 2_120_000, duration: 3600},
        //                     { type: 'application/zip', uri: 'pdf uri3', size: 303_101, name: 'document2.pdf'}
        //                 ],
        //             },
        //             {
        //                 from: user?.handle ?? '',
        //                 to: interlocutors[0].handle,
        //                 id: '6',
        //                 files: [
        //                     { type: 'recording/application/mp3', uri: 'pdf uri', size: 332_000, duration: 31},
        //                 ],
        //             },
        //             {
        //                 from: user?.handle ?? '',
        //                 to: interlocutors[0].handle,
        //                 id: '7',
        //                 files: [],
        //             },
        //             {
        //                 to: interlocutors[0].handle,
        //                 from: user?.handle ?? '',
        //                 id: '8',
        //                 files: [
        //                     { type: 'video', uri: 'https://picsum.photos/3003', size: 0},
        //                     { type: 'video', uri: 'https://picsum.photos/3001', size: 0},
        //                 ],
        //                 text: 'this text here',
        //                 draft: true,
        //             },
        //             {
        //                 from: interlocutors[0].handle,
        //                 to: user?.handle ?? '',
        //                 id: '9',
        //                 files: [
        //                     { type: 'video', uri: 'https://picsum.photos/1001', size: 0},
        //                 ],
        //                 text: 'this text here',
        //                 timestamp: new Date(2022, 10, 4),
        //             },
        //             {
        //                 from: user?.handle ?? '',
        //                 to: interlocutors[0].handle,
        //                 id: '10',
        //                 files: [],
        //             }
        //         ].filter(m=>!!m.text || m.files.length),
        //         messageThreads: []
        //     }
        // ]
        // saveChats(chats);
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