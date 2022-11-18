import {NativeStackHeaderProps} from '@react-navigation/native-stack';

import {Appbar} from 'react-native-paper';
import {useTheme} from '../context/theme';
import {User} from '../types/user';
import {Image} from './Image';
import {OnlyShow} from './Helpers/OnlyShow';

function ProfileHeader({
  user,
  props,
}: {
  user: User;
  props: NativeStackHeaderProps;
}) {
  const {theme} = useTheme();
  return (
    <Appbar.Header style={{backgroundColor: theme.color.primary}}>
      <OnlyShow If={!!props.back}>
        <Appbar.BackAction
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
