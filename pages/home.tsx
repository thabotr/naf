import {Text, Button, View} from 'react-native';
import {List, Avatar} from 'react-native-paper';
import TrackPlayer from 'react-native-track-player';

export function HomeHeader() {
    return (
    <View style={{display: 'flex', flexDirection: 'row', width: '100%', margin: 0, padding: 0, backgroundColor: '#373737'}}>
        <List.Item
            title="Rodrigo"
            description="Carlos"
            style={{flex: 1}}
        />
        <Avatar.Image style={{flex: 1, backgroundColor: '#373737', marginRight: 10}} source={{uri: 'https://img.icons8.com/emoji/96/000000/man-health-worker.png'}}/>
    </View>
    );
}

export function Home({navigation}) {
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
    </>
    );
}