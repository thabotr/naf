import React from 'react';
import {Button, View} from 'react-native';
import {List, Avatar, Paragraph} from 'react-native-paper';
import TrackPlayer from 'react-native-track-player';

import { ThemeContext } from '../context/theme';
import { ThemeContextType } from '../types/theme';

export function HomeHeader() {
    const {theme} = React.useContext(ThemeContext) as ThemeContextType;
    return (
    <View style={{display: 'flex', flexDirection: 'row', width: '100%', margin: 0, padding: 0, backgroundColor: theme.color.primary}}>
        <List.Item
            title={<Paragraph>Rodrigo</Paragraph>}
            description={<Paragraph>Carlos</Paragraph>}
            style={{flex: 1}}
        />
        <Avatar.Image style={{flex: 1, backgroundColor: theme.color.primary, marginRight: 10}} source={{uri: 'https://img.icons8.com/emoji/96/000000/man-health-worker.png'}}/>
    </View>
    );
}

export function Home({navigation}:{navigation:any}) {
    const start = async () => {
            // Add a track to the queue
            await TrackPlayer.add({
                url: 'https://up.fakazaweb.com/wp-content/uploads/2022/10/A-Reece_-_Bad_Guy_Fakaza.Me.com.mp3',
                title: 'bad guy',
                artist: 'a-reece',
                duration: 92,
            });

            // Start playing it
            await TrackPlayer.play();
        }
    const stop = async ()=> {await TrackPlayer.pause();}
    const {toggleDarkTheme} = React.useContext(ThemeContext) as ThemeContextType;
    return (
    <>
    <Button
        title={"stop"}
        onPress={stop}
    />
    <Button
        title={"start"}
        onPress={start}
    />
    <Button
        title={"go to chat"}
        onPress={()=> navigation.push("Chat")}
    />
    <Button
        title={"toggle theme"}
        onPress={toggleDarkTheme}
    />
    </>
    );
}