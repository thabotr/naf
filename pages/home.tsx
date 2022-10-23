import {Text, Button, View} from 'react-native';
import {List, Avatar} from 'react-native-paper';

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
    return (
    <Button
        title={"go to chat"}
        onPress={()=> navigation.push("Chat")}
    />
    );
}