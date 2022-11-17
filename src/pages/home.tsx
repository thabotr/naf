import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import React from 'react';
import {View, FlatList, Pressable} from 'react-native';
import { Appbar, Card, IconButton } from 'react-native-paper';
import { CardCover } from '../components/CardCover';

import {ChatPreviewCard} from '../components/ChatPreviewCard';
import {ListenWithMeCard} from '../components/listenWithCard';
import {useChats} from '../context/chat';
import {ListenWithMeContextProvider} from '../context/listenWithMe';
import {useTheme} from '../context/theme';
import { useLoggedInUser } from '../context/user';
import {useAppState} from '../providers/AppStateProvider';
import {remoteGetChats} from '../remote/chats';

function HomeHeader(props: NativeStackHeaderProps){
  const {theme} = useTheme();
  const {user} = useLoggedInUser();
  return <Appbar.Header style={{backgroundColor: theme.color.primary}}>
    <IconButton icon='menu' onPress={()=>props.navigation.navigate('Settings')}/>
    <Appbar.Content
      titleStyle={{ color: theme.color.textPrimary, textShadowColor: theme.color.textSecondary}}
      title={user?.handle}
      subtitleStyle={{ color: theme.color.textPrimary, textShadowColor: theme.color.textSecondary}}
      subtitle={`${user?.name} ${user?.surname}`}
    />
      <Pressable
        style={{height: '100%', width: 50, marginRight: 10}} 
        onPress={()=>props.navigation.navigate('UserProfile')}
      >
        <CardCover source={user?.avatarURI} style={{ height: '100%', borderRadius: 0, width: '100%'}}/>
      </Pressable>
  </Appbar.Header>
}

function Home({navigation}: {navigation: any}) {
  const [fetchingChats, setFetchingChats] = React.useState(false);
  const {theme} = useTheme();
  const {saveChats, chats} = useChats();
  const {saveAppChats, chats: savedChats} = useAppState();

  const fetchChats = () => {
    setFetchingChats(true);
    remoteGetChats()
      .then(chats => {
        if (chats) {
          saveChats(chats);
          saveAppChats(chats);
        }
      })
      .finally(() => setFetchingChats(false));
  };

  React.useEffect(() => {
    if (savedChats.length) {
      saveChats(savedChats);
    } else {
      fetchChats();
    }
  }, [savedChats]);

  return (
    <ListenWithMeContextProvider>
      <View style={{height: '100%', backgroundColor: theme.color.secondary}}>
        <FlatList
          ListHeaderComponent={<ListenWithMeCard />}
          refreshing={fetchingChats}
          onRefresh={fetchChats}
          data={chats.map(c => {
            return {title: '', key: c.user.handle};
          })}
          renderItem={({index}) => {
            const c = chats[index];
            return (
              <ChatPreviewCard
                key={c.user?.handle ?? ''}
                chat={c}
                navigation={navigation}
              />
            );
          }}
        />
      </View>
    </ListenWithMeContextProvider>
  );
}

export {Home, HomeHeader};