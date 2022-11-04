import React from 'react';
import {View, TouchableOpacity, Pressable, Text} from 'react-native';
import {Paragraph, Card, IconButton, ActivityIndicator, TouchableRipple, Badge, Avatar, List} from 'react-native-paper';

import {HorizontalView, Lay, OverlayedView, OnlyShow, Show} from '../components/helper';
import {MessagesContext, MessagesContextType} from '../context/messages';
import {ThemeContext, ThemeContextType} from '../context/theme';
import {Chat} from '../types/chat';
import {Image} from './image';

export function ChatPreviewCard({chat, navigation}:{chat:Chat, navigation: any}) {
    const {openChat} = React.useContext(MessagesContext) as MessagesContextType;
    const {theme} = React.useContext(ThemeContext) as ThemeContextType;
    const [landscapeClicked, setLandscapeClicked] = React.useState(false);
    const [listeningWMe, setListeningWMe] = React.useState(false);

    const latestMessage = chat.messages.slice(-1).find(_=>true);
    const unreadMessageCount = chat.messages.filter(m => !!m.unread).length;

    const [{avatarPrimary, avatarSecondary}, setAC] = React.useState<{avatarPrimary: string, avatarSecondary: string}>({
        avatarPrimary: theme.color.primary, avatarSecondary: theme.color.secondary,
    });

    return <Card style={{borderRadius: 5, margin: 2, padding: 4, backgroundColor: avatarSecondary}}>
    <Card.Cover source={{uri: chat.user.landscapeURI}} style={{opacity: landscapeClicked ? 0.8 : 1, backgroundColor: avatarPrimary}}/>
    <OverlayedView style={{justifyContent: 'flex-start', alignItems: 'flex-start', borderColor: avatarPrimary, borderWidth: 2}}>
        <HorizontalView>
            <View style={{height: '100%', width: '25%'}}>
                <View style={{height: '50%', width: '100%'}}>
                    <Lay
                        component={<Image
                            style={{width: '100%', height: '100%'}}
                            source={{uri: chat.user.avatarURI}}
                            imageColorsConfig={{cache: true, pixelSpacing: 10}}
                            onImageColors={imgColors=>{
                                switch( imgColors.platform){
                                    case 'android':
                                        setAC({
                                            avatarPrimary: ( theme.dark ? imgColors.darkVibrant : imgColors.average) ?? avatarPrimary,
                                            avatarSecondary:( theme.dark ? imgColors.darkMuted : imgColors.dominant) ?? avatarSecondary,
                                        })
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
                            <Paragraph style={{ fontWeight: 'bold'}}>{chat.user.handle}</Paragraph>
                            <Paragraph>{chat.user.name} {chat.user.surname}</Paragraph>
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
                        //TODO play theme song
                        setListeningWMe(!listeningWMe);
                    }}
                    onLongPress={()=>{
                        //TODO view in expanded music player
                    }}
                >
                    {/* play theme song  */}
                    <IconButton icon='account-music'/>
                    <Text>Marquue track name</Text>
                    <View>
                        <IconButton icon={ listeningWMe ?  'play' : 'pause'}/>
                        <OverlayedView>
                        <ActivityIndicator size={35} animating={listeningWMe} color='gray'/>
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
                            component={<Paragraph numberOfLines={1}>
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