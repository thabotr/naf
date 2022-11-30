import {
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import {IconButton} from 'react-native-paper';

import {useTheme} from '../../context/theme';
import {Chat} from '../../types/chat';

function ReadWithMeSection({chat}: {chat: Chat}) {
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
          `Coming soon\nsee what books\n${chat.user.handle} is reading`,
          3000,
        );
      }}>
      <IconButton icon="bookshelf"
        color={theme.color.textPrimary}
      />
    </TouchableOpacity>
  );
}

export {ReadWithMeSection};