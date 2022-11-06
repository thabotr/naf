import React from 'react';
import {View, TouchableOpacity, Pressable, Text, Platform} from 'react-native';
import {Paragraph, Card, IconButton, ActivityIndicator, TouchableRipple, Badge, Avatar, List} from 'react-native-paper';
import TrackPlayer, { usePlaybackState , State as PlayState} from 'react-native-track-player';

import {HorizontalView, Lay, OverlayedView, OnlyShow, Show} from '../components/helper';
import { ListenWithMeContext, ListenWithMeContextType } from '../context/listenWithMe';
import {MessagesContext, MessagesContextType} from '../context/messages';
import {ThemeContext, ThemeContextType} from '../context/theme';
import {Chat} from '../types/chat';
import {getImagePath, Image} from './image';

export function ChatPreviewCard({chat, navigation}:{chat:Chat, navigation: any}) {
    const {openChat} = React.useContext(MessagesContext) as MessagesContextType;
    const {theme} = React.useContext(ThemeContext) as ThemeContextType;
    const {saveListeningWith, listeningWith} = React.useContext(ListenWithMeContext) as ListenWithMeContextType;

    const [landscapeClicked, setLandscapeClicked] = React.useState(false);

    const [cardUri, setCardUri] = React.useState('');

    const latestMessage = chat.messages.slice(-1).find(_=>true);
    const unreadMessageCount = chat.messages.filter(m => !!m.unread).length;

    const [avatarPrimary, setAP] = React.useState(theme.color.primary);
    const [avatarSecondary, setAS] = React.useState(theme.color.secondary);

    React.useEffect(()=>{
        getImagePath(chat.user.landscapeURI).then(p=> {
            if( !!p) setCardUri(Platform.select({android: `file://${p}`,})?? p);
        }).catch(e => console.error('failed to get landscape uri: '+e));
    },[])

    const playState = usePlaybackState();
    const playing = listeningWith === chat.user.handle && playState === PlayState.Playing;

    return <Card style={{borderRadius: 5, margin: 2, padding: 4, backgroundColor: avatarSecondary}}>
    <Card.Cover source={!!cardUri ? {uri: cardUri} : undefined} style={{opacity: landscapeClicked ? 0.8 : 1, backgroundColor: avatarPrimary}}/>
    <OverlayedView style={{justifyContent: 'flex-start', alignItems: 'flex-start', borderColor: avatarPrimary, borderWidth: 2}}>
        <HorizontalView>
            <View style={{height: '100%', width: '25%'}}>
                <View style={{height: '50%', width: '100%'}}>
                    <Lay
                        component={<Image
                            style={{width: '100%', height: '100%'}}
                            url={chat.user.avatarURI}
                            imageColorsConfig={{cache: true, pixelSpacing: 10}}
                            onImageColors={imgColors=>{
                                switch( imgColors.platform){
                                    case 'android':
                                        setAP((theme.dark ? imgColors.darkVibrant : imgColors.average) ?? theme.color.primary);
                                        setAS((theme.dark ? imgColors.darkMuted : imgColors.dominant) ?? theme.color.secondary);
                                        return;
                                }
                            }}
                            alt={<Avatar.Text
                                style={{borderRadius: 0, width: '100%', height: '100%', backgroundColor: avatarPrimary}}
                                label={chat.user.initials}
                            />}
                        />
                        }
                        over={<View style={{height: '100%', width: '100%', backgroundColor: avatarPrimary, opacity: 1}}/>}
                    />
                </View>
                <View style={{height: '50%', width: '100%', alignItems: 'center'}}>
                    <Lay
                        component={<>
                            <Paragraph style={{ fontWeight: 'bold', color: theme.color.textPrimary, textShadowColor: theme.color.textSecondary}}>{chat.user.handle}</Paragraph>
                            <Paragraph style={{color: theme.color.textPrimary, textShadowColor: theme.color.textSecondary}}>{chat.user.name} {chat.user.surname}</Paragraph>
                            </>}
                        over={<View style={{height: '100%', width: '100%', backgroundColor: avatarSecondary, opacity: 1}}/>}
                    />
                </View>
            </View>
            <View style={{height: '100%', width: '75%'}}>
                <TouchableOpacity
                    style={{
                        width: '100%',
                        height: '25%',
                        backgroundColor: theme.color.secondary,
                        opacity: 0.5,
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                    onPress={()=>{
                        //TODO if listening with me, play
                        // else reset player and add our songs
                        if( playing){
                            TrackPlayer.pause();
                        } else if(listeningWith !== chat.user.handle){
                            saveListeningWith(chat.user.handle);
                        }else {
                            if(playState !== PlayState.Paused){
                                TrackPlayer.getCurrentTrack()
                                .then(async (ti)=>{
                                    return TrackPlayer.getQueue()
                                    .then(ts=>{
                                        if( (ti) !== null && ts.length)
                                            return TrackPlayer.skip(ti)
                                        else
                                            return TrackPlayer.add({
                                                url: chat.user.listenWithMeURI,
                                            });
                                    })
                                })
                                .then(_=>{
                                    TrackPlayer.play();
                                })
                            }else
                                TrackPlayer.play();
                        }
                    }}
                >
                    {/* play theme song  */}
                    <IconButton icon='account-music'/>
                    <Text>Marquue track name</Text>
                    <View>
                        <IconButton icon={ playing ?  'pause' : 'play'}/>
                        <OverlayedView>
                        <ActivityIndicator size={35} animating={playing} color='gray'/>
                        </OverlayedView>
                    </View>
                </TouchableOpacity>
                <Pressable
                    style={{width: '100%', height: '50%'}}
                    onPressIn={()=>setLandscapeClicked(true)}
                    onPressOut={()=>setLandscapeClicked(false)}
                />
                <View style={{ width: '100%', height: '25%'}}>
                <Lay
                    component={
                    <TouchableRipple
                        style={{ width: '100%', height: '100%', justifyContent: 'center', padding: 5}}
                        onPress={()=>{
                            openChat(chat);
                            navigation.push("Chat");
                        }}
                    >
                        {/* chats preview */}
                        <Show
                            component={<Paragraph style={{color: theme.color.textPrimary, textShadowColor: theme.color.textSecondary}} numberOfLines={1}>
                                {`converse with ${chat.user.handle}`}
                            </Paragraph>}
                            If={!latestMessage}
                            ElseShow={<List.Item
                                title={latestMessage?.text ?? "<sent a file>"}
                                left={_=>latestMessage?.text ? <List.Icon icon='message-text'/> : <List.Icon icon='attachment'/>}
                                />}
                        />
                    </TouchableRipple>
                    }
                    over={<View style={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: theme.color.secondary,
                            opacity: 0.5,
                        }}/>
                    }
                />
                </View>
            </View>
        </HorizontalView>
    </OverlayedView>
    <OnlyShow If={!!unreadMessageCount}>
        <Badge
            style={{
                position: 'absolute',
                bottom: -1, right: -1,
                borderRadius: 0, 
                backgroundColor: theme.color.friendSecondary,
                borderWidth: 1,
                borderColor: theme.color.friendPrimary,
                borderStyle: 'solid',
                }}
            size={33}
        >
            {unreadMessageCount}
        </Badge>
    </OnlyShow>
    </Card>
}