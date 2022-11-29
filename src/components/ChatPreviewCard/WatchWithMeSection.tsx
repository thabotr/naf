import {
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import {IconButton} from 'react-native-paper';

import {useTheme} from '../../context/theme';
import {Chat} from '../../types/chat';

function WatchWithMeSection({chat}: {chat: Chat}) {
  const {theme} = useTheme();
  return (
    <TouchableOpacity
      style={{
        width: '15%',
        height: '100%',
        backgroundColor: theme.color.secondary,
        opacity: 0.5,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onPress={() => {
        ToastAndroid.show(
          `Coming soon\nsee what movies and TV shows\n${chat.user.handle} is watching`,
          3000,
        );
      }}>
      <IconButton icon="movie" />
    </TouchableOpacity>
  );
}

export {WatchWithMeSection};
