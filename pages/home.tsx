import React from 'react';
import {ScrollView, View} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

import { ChatPreviewCard } from '../components/chatPreviewCard';
import { ListenWithMeCard } from '../components/listenWithCard';
import {useChats} from '../context/chat';
import { ListenWithMeContextProvider, ListenWithMeContextType } from '../context/listenWithMe';
import {useTheme} from '../context/theme';
import {Chat} from '../types/chat';
import { URLS } from '../types/routes';

export function Home({navigation}:{navigation:any}) {
    const {theme} = useTheme();
    const {saveChats, chats} = useChats();

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