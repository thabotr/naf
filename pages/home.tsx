import React from 'react';
import {ScrollView} from 'react-native';
import { ChatPreviewCard } from '../components/chatPreviewCard';

import {HorizontalView} from '../components/helper';
import {ThemeContext, ThemeContextType} from '../context/theme';
import {UserContext, UserContextType} from '../context/user';
import {Chat} from '../types/chat';
import {User} from '../types/user';

export function Home({navigation}:{navigation:any}) {
    const {user} = React.useContext(UserContext) as UserContextType;
    const {theme} = React.useContext(ThemeContext) as ThemeContextType;

    const interlocutors: User[] = [{
        name: 'Juliana',
        surname: 'Alvarez',
        handle: '->therealjulz',
        avatarURI: 'https://img.icons8.com/color/96/000000/user-female-skin-type-6.png',
        landscapeURI: 'https://picsum.photos/999',
        listenWithMeURI: 'https://up.fakazaweb.com/wp-content/uploads/2022/10/A-Reece_-_Bad_Guy_Fakaza.Me.com.mp3',
        initials: 'MD',
    },
    {
        avatarURI: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.jeancoutu.com%2Fen%2Fphoto%2Fphoto-related-tips%2Fselfie%2F&psig=AOvVaw2TbNYCHj_SSIBn3vm7Yly0&ust=1667562052564000&source=images&cd=vfe&ved=0CA0QjRxqFwoTCOCrrPD2kfsCFQAAAAAdAAAAABAE',
        name: 'Mariana',
        surname: 'Diaz',
        handle: '->marianadiaz',
        landscapeURI: '',
        listenWithMeURI: '',
        initials: 'MD',
    }
    ]

    const chats: Chat[] = [
        {
            user: interlocutors[1],
            messages: [{
                from: interlocutors[1].handle,
                to: user.handle,
                id: '1',
                files: [{ type: 'image', uri: 'https://picsum.photos/600', size: 0}],
            }],
            messageThreads: [],
        },
        {
            user: interlocutors[0],
            messages:[
                {
                    from: user.handle,
                    to: interlocutors[0].handle,
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
                    from: interlocutors[0].handle,
                    to: user.handle,
                    id: '1',
                    files: [{ type: 'image', uri: 'https://picsum.photos/600', size: 0}],
                },
                {
                    from: user.handle,
                    to: interlocutors[0].handle,
                    id: '2',
                    text: "spendisse nec elementum risus, in gravida enim. Pellentesque how tillas tu",
                    files: [],
                    unread: true,
                },
                {
                    from: interlocutors[0].handle,
                    to: user.handle,
                    id: '3',
                    files: [{ type: 'application/pdf', uri: 'pdf uri', size: 1_000_000, name: 'document.pdf'}],
                    unread: true,
                },
                {
                    from: user.handle,
                    to: interlocutors[0].handle,
                    id: '4',
                    files: [
                        { type: 'application/pdf', uri: 'pdf uri', size: 1_000_000, name: 'document.pdf'},
                        { type: 'application/zip', uri: 'pdf uri3', size: 303_101, name: 'document2.pdf'}
                    ],
                },
                {
                    from: user.handle,
                    to: interlocutors[0].handle,
                    id: '5',
                    files: [
                        { type: 'recording/application/mp3', uri: 'pdf uri', size: 2_120_000, duration: 3600},
                        { type: 'application/zip', uri: 'pdf uri3', size: 303_101, name: 'document2.pdf'}
                    ],
                },
                {
                    from: user.handle,
                    to: interlocutors[0].handle,
                    id: '6',
                    files: [
                        { type: 'recording/application/mp3', uri: 'pdf uri', size: 332_000, duration: 31},
                    ],
                },
                {
                    from: user.handle,
                    to: interlocutors[0].handle,
                    id: '7',
                    files: [],
                },
                {
                    to: interlocutors[0].handle,
                    from: user.handle,
                    id: 'draft8',
                    files: [
                        { type: 'video', uri: 'https://picsum.photos/3003', size: 0},
                        { type: 'video', uri: 'https://picsum.photos/3001', size: 0},
                    ],
                    text: 'this text here',
                },
                {
                    from: interlocutors[0].handle,
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
                    to: interlocutors[0].handle,
                    id: '10',
                    files: [],
                }
            ].filter(m=>!!m.text || m.files.length),
            messageThreads: []
        }
    ]
    return (
        <HorizontalView style={{height: '100%', backgroundColor: theme.color.secondary}}>
        <ScrollView style={{backgroundColor: theme.color.secondary}}>
            {chats.map( c => <ChatPreviewCard key={c.user.handle} chat={c} navigation={navigation}/>)}
        </ScrollView>
        </HorizontalView>
    );
}