import React from 'react';
import {View, FlatList} from 'react-native';

import {ChatPreviewCard} from '../components/chatPreviewCard';
import {ListenWithMeCard} from '../components/listenWithCard';
import {useChats} from '../context/chat';
import {ListenWithMeContextProvider} from '../context/listenWithMe';
import {useTheme} from '../context/theme';
import {useAppState} from '../providers/AppStateProvider';
import {remoteGetChats} from '../remote/chats';

export function Home({navigation}: {navigation: any}) {
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
