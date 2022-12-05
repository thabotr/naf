import React, {useState, useEffect, useCallback} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {NativeStackHeaderProps} from '@react-navigation/native-stack';
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
  }, [userProfile, props.navigation]);

  const styles = StyleSheet.create({
    square: {borderRadius: 0},
    avatarCont: {height: '100%', width: 50, marginRight: 10},
    spanningAvatar: {height: '100%', width: '100%'},
  });

  return (
    <Appbar.Header style={{backgroundColor: theme.color.primary}}>
      <IconButton
        icon="menu"
        color={theme.color.textPrimary}
        style={styles.square}
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
      <View style={styles.avatarCont}>
        <Image
          onPress={() => props.navigation.navigate('UserProfile')}
          source={userProfile.avatarURI}
          style={styles.spanningAvatar}
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

  const fetchChats = useCallback(() => {
    const updateChatAndUserColors = (newchats: Chat[]) => {
      newchats.forEach(c => {
        getColorsForUser(c.user).then(
          colors => colors && saveUserColors(c.user.handle, colors),
        );
      });
      getColorsForUser(userProfile).then(
        colors => colors && saveUserColors(userProfile.handle, colors),
      );
    };
    setFetchingChats(true);
    Remote.getChats(userProfile.token, userProfile.handle)
      .then(newchats => {
        if (newchats) {
          saveChats(newchats);
          updateChatAndUserColors(newchats);
        }
      })
      .finally(() => setFetchingChats(false));
  }, [saveChats, saveUserColors, userProfile]);

  useEffect(() => {
    if (userProfile.handle) {
      fetchChats();
    }
  }, [userProfile, userProfile.handle, fetchChats]);

  const styles = StyleSheet.create({
    background: {height: '100%', backgroundColor: theme.color.secondary},
  });

  return (
    <ListenWithMeContextProvider>
      <View style={styles.background}>
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
