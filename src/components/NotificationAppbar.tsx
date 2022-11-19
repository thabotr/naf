import {View} from 'react-native';
import {List, Paragraph} from 'react-native-paper';
import {useTheme} from '../context/theme';
import {Lay} from './Helpers/Lay';
import {OverlayedView} from './Helpers/OverlayedView';
import {Image} from './Image';

function NotificationAppbar() {
  const {theme} = useTheme();
  return (
    <OverlayedView>
      <Lay
        component={
          <List.Item
            titleStyle={{
              color: theme.color.textPrimary,
              shadowColor: theme.color.textSecondary,
            }}
            title="w/userHandle"
            descriptionStyle={{marginLeft: 10}}
            description={
              <Paragraph
                numberOfLines={1}
                style={{
                  color: theme.color.textPrimary,
                  textShadowColor: theme.color.textSecondary,
                }}>
                sjnkdkdkjsk djsndjhskjdkbs jdjksdkskdkskdks sdjhd ...
              </Paragraph>
            }
            style={{width: '100%'}}
            right={_ => (
              <Image
                style={{width: 40, height: 40, marginRight: 10}}
                source={{
                  type: 'image/jpeg',
                  uri: 'http://10.0.2.2:3000/avatar1.jpg',
                  size: 2_121,
                }}
              />
            )}
          />
        }
        over={
          <View
            style={{
              width: '100%',
              height: '100%',
              opacity: 0.95,
              backgroundColor: 'gray',
            }}
          />
        }
      />
    </OverlayedView>
  );
}

export {NotificationAppbar};
