import {NativeStackHeaderProps} from '@react-navigation/native-stack';
import {useState, useEffect} from 'react';
import {View, FlatList} from 'react-native';
import {Appbar, IconButton} from 'react-native-paper';
import {Image} from '../components/Image';

import {ChatPreviewCard} from '../components/ChatPreviewCard';
import {ListenWithMeCard} from '../components/listenWithCard';
import {useChats} from '../context/chat';
import {ListenWithMeContextProvider} from '../context/listenWithMe';
import {useTheme} from '../context/theme';
import {useLoggedInUser} from '../context/user';
import {getColorsForUser} from '../utils/getUserColors';
import {useColorsForUsers} from '../providers/UserTheme';
import {Chat} from '../types/chat';
import {Remote} from '../services/Remote';

function HomeHeader(props: NativeStackHeaderProps) {
  const {theme} = useTheme();
  const {userProfile} = useLoggedInUser();

  useEffect(() => {
    if (!userProfile.handle) {
      props.navigation.navigate('Login');
    }
  }, [userProfile]);

  return (
    <Appbar.Header style={{backgroundColor: theme.color.primary}}>
      <IconButton
        icon="menu"
        color={theme.color.textPrimary}
        style={{borderRadius: 0}}
        onPress={() => props.navigation.navigate('Settings')}
      />
      <Appbar.Content
        titleStyle={{
          color: theme.color.textPrimary,
          textShadowColor: theme.color.textSecondary,
        }}
        title={userProfile.handle}
        subtitleStyle={{
          color: theme.color.textPrimary,
          textShadowColor: theme.color.textSecondary,
        }}
        subtitle={`${userProfile.name} ${userProfile.surname}`}
      />
      <View style={{height: '100%', width: 50, marginRight: 10}}>
        <Image
          onPress={() => props.navigation.navigate('UserProfile')}
          source={userProfile.avatarURI}
          style={{height: '100%', width: '100%'}}
        />
      </View>
    </Appbar.Header>
  );
}

function Home({navigation}: {navigation: any}) {
  const [fetchingChats, setFetchingChats] = useState(false);
  const {theme} = useTheme();
  const {saveChats, chats} = useChats();
  const {saveUserColors} = useColorsForUsers();
  const {userProfile} = useLoggedInUser();

  const updateChatAndUserColors = (chats: Chat[]) => {
    chats.forEach(c => {
      getColorsForUser(c.user).then(
        colors => colors && saveUserColors(c.user.handle, colors),
      );
    });
    getColorsForUser(userProfile).then(
      colors => colors && saveUserColors(userProfile.handle, colors),
    );
  };

  const fetchChats = () => {
    setFetchingChats(true);
    Remote.getChats(userProfile.token, userProfile.handle)
      .then(chats => {
        if (chats) {
          saveChats(chats);
          updateChatAndUserColors(chats);
        }
      })
      .finally(() => setFetchingChats(false));
  };

  // useEffect(() => {
  //   if (userProfile.handle) {
  //     fetchChats();
  //   }
  // }, [userProfile]);

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
