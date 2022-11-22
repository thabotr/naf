import {
  createNativeStackNavigator,
  NativeStackHeaderProps,
} from '@react-navigation/native-stack';
import {View} from 'react-native';

import {useTheme} from '../context/theme';
import {ChatHeader, Chat} from '../pages/Chat';
import {Home, HomeHeader} from '../pages/Home';
import {Settings} from '../pages/Settings';
import {UserProfile, UserProfileHeader} from '../pages/UserProfile';
import {ChatProfile, ChatProfileHeader} from '../pages/ChatProfile';
import {GenericHeader} from './GenericPageHeader';
import {NotificationAppbar} from './NotificationAppbar';
import {useEffect} from 'react';
import {useLoggedInUser} from '../context/user';
import {Login} from '../pages/Login';

const Stack = createNativeStackNavigator();

const LoginHeader = ({props}: {props: NativeStackHeaderProps}) => {
  const {userProfile} = useLoggedInUser();

  useEffect(() => {
    if (!userProfile.user.handle) {
      props.navigation.navigate('Login', {});
    } else {
      props.navigation.navigate('Home', {});
    }
  }, [userProfile]);
  return <></>;
};

function StackNavigator() {
  const {theme} = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        header: props => {
          return (
            <View
              style={{
                width: '100%',
                height: 56,
                opacity: 1,
                backgroundColor: theme.color.secondary,
              }}>
              {(() => {
                switch (props.route.name) {
                  case 'ChatProfile':
                    return <ChatProfileHeader {...props} />;
                  case 'UserProfile':
                    return <UserProfileHeader {...props} />;
                  case 'Home':
                    return <HomeHeader {...props} />;
                  case 'Chat':
                    return <ChatHeader {...props} />;
                  case 'Settings':
                    return <GenericHeader name="Settings" props={props} />;
                  case 'Login':
                    return <LoginHeader props={props} />;
                }
              })()}
              <NotificationAppbar />
            </View>
          );
        },
        headerStyle: {backgroundColor: theme.color.primary},
      }}>
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="UserProfile" component={UserProfile} />
      <Stack.Screen name="ChatProfile" component={ChatProfile} />
      <Stack.Screen name="Login" component={Login} />
    </Stack.Navigator>
  );
}

export {StackNavigator};
