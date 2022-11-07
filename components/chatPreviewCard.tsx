import React from 'react';
import {View, TouchableOpacity, Pressable, Platform} from 'react-native';
import {Paragraph, Card, IconButton, ActivityIndicator, TouchableRipple, Badge, Avatar, List} from 'react-native-paper';
import TrackPlayer, { State as PlayState} from 'react-native-track-player';

import {HorizontalView, Lay, OverlayedView, OnlyShow, Show} from '../components/helper';
import { ChatContext, ChatContextType } from '../context/chat';
import { ListenWithMeContext, ListenWithMeContextType } from '../context/listenWithMe';
import {ThemeContext, ThemeContextType} from '../context/theme';
import { getAudioMetadata} from '../src/audio';
import { getFilePath } from '../src/file';
import {Chat} from '../types/chat';
import {Image} from './image';

export function ChatPreviewCard({chat, navigation}:{chat:Chat, navigation: any}) {
    const {theme} = React.useContext(ThemeContext) as ThemeContextType;
    const {listeningWith, currentTrack, playUserTrack, playState} = React.useContext(ListenWithMeContext) as ListenWithMeContextType;
    const {converseWith} = React.useContext(ChatContext) as ChatContextType;

    const [landscapeClicked, setLandscapeClicked] = React.useState(false);
    const [landscapeUri, setLandscapeUri] = React.useState('');

    const latestMessage = chat.messages.slice(-1).find(_=>true);
    const unreadMessageCount = chat.messages.filter(m => !!m.unread).length;

    const [avatarPrimary, setAP] = React.useState(theme.color.primary);
    const [avatarSecondary, setAS] = React.useState(theme.color.secondary);

    React.useEffect(()=>{
        getFilePath(chat.user.landscapeURI).then(path=> {
            path && setLandscapeUri(Platform.select({android: `file://${path}`,}) ?? path);
        }).catch(e => console.error('failed to get landscape uri: '+ e));
    },[])

    return <Card style={{borderRadius: 5, margin: 2, padding: 4, backgroundColor: avatarSecondary}}>
    <Card.Cover
        source={!!landscapeUri ? {uri: landscapeUri} : undefined}
        style={{opacity: landscapeClicked ? 0.8 : 1, backgroundColor: avatarPrimary}}
    />
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
                        if(listeningWith === chat.user.handle && playState == PlayState.Playing)
                            TrackPlayer.pause()
                            .catch(e => console.log(e));
                        else
                            getAudioMetadata(`http://10.0.2.2:3000/listenwithme/${chat.user.handle.replace('->', '')}/listen1`)
                            .then(track=> track && playUserTrack(chat.user.handle, track))
                            .catch( e => console.log(e));
                    }}
                >
                    <IconButton icon='account-music'/>
                    <Paragraph>{listeningWith === chat.user.handle ? currentTrack?.title ?? '' : ''}</Paragraph>
                    <View>
                        <IconButton icon={listeningWith === chat.user.handle && playState == PlayState.Playing ?  'pause' : 'play'}/>
                        <OverlayedView>
                            <ActivityIndicator
                                size={35}
                                animating={listeningWith === chat.user.handle && playState == PlayState.Playing}
                                color={theme.color.secondary}
                            />
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
                            converseWith(chat.user);
                            navigation.push("Chat");
                        }}
                    >
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