import React from 'react';
import {View, Image, ScrollView, TouchableOpacity, Pressable, Text} from 'react-native';
import {Paragraph, Card, IconButton, ActivityIndicator, TouchableRipple} from 'react-native-paper';
import {HorizontalView, Lay, OverlayedView} from '../components/helper';
import {MessagesContext, MessagesContextType} from '../context/messages';

import {ThemeContext, ThemeContextType} from '../context/theme';
import {UserContext, UserContextType} from '../context/user';
import {Chat} from '../types/chat';
import {User} from '../types/user';

export function ChatPreviewCard({chat, navigation}:{chat:Chat, navigation: any}) {
    const {openChat} = React.useContext(MessagesContext) as MessagesContextType;
    const {theme} = React.useContext(ThemeContext) as ThemeContextType;
    const [landscapeClicked, setLandscapeClicked] = React.useState(false);
    const [listeningWMe, setListeningWMe] = React.useState(false);

    const latestMessage = chat.messages.slice(-1).find(e=>true);

    const avatarPrimary = '#8B4513';
    const avatarSecondary = '#F4A460';

    return <Card style={{borderRadius: 5, margin: 2, padding: 4}}>
    <Card.Cover source={{uri: chat.user.landscapeURI}} style={{opacity: landscapeClicked ? 0.8 : 1}}/>
    <OverlayedView style={{justifyContent: 'flex-start', alignItems: 'flex-start', borderColor: avatarPrimary, borderWidth: 2}}>
        <HorizontalView>
            <View style={{height: '100%', width: '25%'}}>
                <View style={{height: '50%', width: '100%'}}>
                    <Lay
                        component={<Image style={{width: '100%', height: '100%'}} source={{uri: chat.user.avatarURI}}/>}
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
                        <Paragraph numberOfLines={1}>
                            { !latestMessage ? `converse with ${chat.user.handle}` : ( latestMessage.text ?? '<sent a file>')}
                        </Paragraph>
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
    </Card>
}

export function Home({navigation}:{navigation:any}) {
    const {user} = React.useContext(UserContext) as UserContextType;
    const {theme} = React.useContext(ThemeContext) as ThemeContextType;

    const interlocutor: User = {
        name: 'Juliana',
        surname: 'Alvarez',
        handle: '->therealjulz',
        avatarURI: 'https://img.icons8.com/color/96/000000/user-female-skin-type-6.png',
        landscapeURI: 'https://picsum.photos/999',
        listenWithMeURI: 'https://up.fakazaweb.com/wp-content/uploads/2022/10/A-Reece_-_Bad_Guy_Fakaza.Me.com.mp3'
    }

    const chats: Chat[] = [
        {
            user: interlocutor,
            messages:[
                {
                    from: user.handle,
                    to: interlocutor.handle,
                    id: '0', 
                    text: "spendisse nec elementum risus, in gravida enim. Pellentesque" +
                    "tempus quam in elit euismod, sed tempus ligula maximus. Phasellus ut. And more" +
                    "eque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit",
                    files: [
                        { type: 'recording/application/mp3', uri: 'uri7', size: 2_342, duration: 17},
                        { type: 'audio', duration: 10_000, uri: 'x', name: "recorded", size: 3_000_248_111},
                        { type: 'video', uri: 'https://picsum.photos/303', size: 0},
                        { type: 'audio', uri: 'a', name: "file.txt", size: 1001},
                        { type: 'application/pdf', uri: 'b', name: "file.txt", size: 1001},
                        { type: 'audio', uri: 'c', name: "file3.txt", size: 333},
                        { type: 'image', uri: 'https://picsum.photos/600', size: 0},
                        { type: 'image', uri: 'https://picsum.photos/500', size: 0},
                        { type: 'video', uri: 'https://picsum.photos/300', size: 0},
                        { type: 'image', uri: 'https://picsum.photos/400', size: 0},
                        { type: 'image', uri: 'https://picsum.photos/700', size: 0},
                        { type: 'image', uri: 'https://picsum.photos/800', size: 0},
                    ],
                    timestamp: new Date(),
                },
                {
                    from: interlocutor.handle,
                    to: user.handle,
                    id: '1',
                    files: [{ type: 'image', uri: 'https://picsum.photos/600', size: 0}],
                },
                {
                    from: user.handle,
                    to: interlocutor.handle,
                    id: '2',
                    text: "spendisse nec elementum risus, in gravida enim. Pellentesque how tillas tu",
                    files: [],
                },
                {
                    from: interlocutor.handle,
                    to: user.handle,
                    id: '3',
                    files: [{ type: 'application/pdf', uri: 'pdf uri', size: 1_000_000, name: 'document.pdf'}],
                },
                {
                    from: user.handle,
                    to: interlocutor.handle,
                    id: '4',
                    files: [
                        { type: 'application/pdf', uri: 'pdf uri', size: 1_000_000, name: 'document.pdf'},
                        { type: 'application/zip', uri: 'pdf uri3', size: 303_101, name: 'document2.pdf'}
                    ],
                },
                {
                    from: user.handle,
                    to: interlocutor.handle,
                    id: '5',
                    files: [
                        { type: 'recording/application/mp3', uri: 'pdf uri', size: 2_120_000, duration: 3600},
                        { type: 'application/zip', uri: 'pdf uri3', size: 303_101, name: 'document2.pdf'}
                    ],
                },
                {
                    from: user.handle,
                    to: interlocutor.handle,
                    id: '6',
                    files: [
                        { type: 'recording/application/mp3', uri: 'pdf uri', size: 332_000, duration: 31},
                    ],
                },
                {
                    from: user.handle,
                    to: interlocutor.handle,
                    id: '7',
                    files: [],
                },
                {
                    from: interlocutor.handle,
                    to: user.handle,
                    id: 'draft8',
                    files: [
                        { type: 'video', uri: 'https://picsum.photos/3003', size: 0},
                        { type: 'video', uri: 'https://picsum.photos/3001', size: 0},
                    ],
                    text: 'this text here',
                },
                {
                    from: interlocutor.handle,
                    to: user.handle,
                    id: '9',
                    files: [
                        { type: 'video', uri: 'https://picsum.photos/1001', size: 0},
                    ],
                    text: 'this text here',
                    timestamp: new Date(2022, 10, 4),
                },
                {
                    from: user.handle,
                    to: interlocutor.handle,
                    id: '10',
                    files: [],
                }
            ].filter(m=>!!m.text || m.files.length),
            messageThreads: []
        }
    ]
    return (
        <ScrollView style={{backgroundColor: theme.color.secondary}}>
            {chats.map( c => <ChatPreviewCard key={c.user.handle} chat={c} navigation={navigation}/>)}
        </ScrollView>
    );
}