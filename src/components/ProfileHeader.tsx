import {useEffect} from 'react';
import {NativeStackHeaderProps} from '@react-navigation/native-stack';
import {Appbar} from 'react-native-paper';
import {useTheme} from '../context/theme';
import {User} from '../types/user';
import {Image} from './Image';
import {OnlyShow} from './Helpers/OnlyShow';
import {useColorsForUsers} from '../providers/UserTheme';
import {useState} from 'react';

function ProfileHeader({
  user,
  props,
}: {
  user: User;
  props: NativeStackHeaderProps;
}) {
  const {theme} = useTheme();
  const {colorsForUsers} = useColorsForUsers();
  const [appHeaderColor, setAppHeaderColor] = useState(theme.color.primary);

  useEffect(() => {
    const colors = colorsForUsers.get(user.handle);
    colors &&
      setAppHeaderColor(
        (theme.dark
          ? colors.landscape.darkPrimary
          : colors.landscape.lightPrimary) ?? theme.color.primary,
      );
  }, [theme, colorsForUsers]);

  return (
    <Appbar.Header style={{backgroundColor: appHeaderColor}}>
      <OnlyShow If={!!props.back}>
        <Appbar.BackAction
          color={theme.color.textPrimary}
          style={{borderRadius: 0}}
          onPress={() => {
            props.navigation.goBack();
          }}
        />
      </OnlyShow>
      <Appbar.Content title={'Profile'} />
      <Image source={user.avatarURI} style={{width: 50, height: '100%'}} />
    </Appbar.Header>
  );
}

export {ProfileHeader};
