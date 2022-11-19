import {View} from 'react-native';
import {
  Button,
  IconButton,
  Paragraph,
  TouchableRipple,
} from 'react-native-paper';
import {useTheme} from '../context/theme';
import {User} from '../types/user';
import {HorizontalView} from './Helpers/HorizontalView';
import {Image} from './Image';

const ProfilePreview = ({user}: {user: User}) => {
  const {theme} = useTheme();
  return (
    <>
      <Image viewable source={user?.landscapeURI} style={{width: '100%'}} />
      <HorizontalView
        style={{
          width: '100%',
          alignItems: 'center',
          padding: 10,
          backgroundColor: theme.color.secondary,
        }}>
        <Image
          viewable
          source={user?.avatarURI}
          style={{width: 120, height: 120}}
        />
        <View
          style={{
            backgroundColor: theme.color.secondary,
            width: 340,
            padding: 10,
          }}>
          <Paragraph
            style={{
              fontWeight: 'bold',
              color: theme.color.textPrimary,
              shadowColor: theme.color.textSecondary,
            }}>
            {user?.handle}
          </Paragraph>
          <Paragraph
            style={{
              color: theme.color.textPrimary,
              shadowColor: theme.color.textSecondary,
            }}>
            {user?.name} {user?.surname} [{user?.initials}]
          </Paragraph>
        </View>
      </HorizontalView>
      <TouchableRipple onPress={() => {}}>
        <HorizontalView
          style={{alignItems: 'center', justifyContent: 'center'}}>
          <IconButton icon="account-remove" />
          <Paragraph
            style={{
              color: theme.color.textPrimary,
              shadowColor: theme.color.textSecondary,
            }}>
            Disconnect from {user.handle}
          </Paragraph>
        </HorizontalView>
      </TouchableRipple>
    </>
  );
};

export {ProfilePreview};
