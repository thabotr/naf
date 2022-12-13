import {
  createNativeStackNavigator,
  NativeStackHeaderProps,
} from '@react-navigation/native-stack';
import React, {StyleSheet, View} from 'react-native';

import {useTheme} from '../shared/providers/theme';
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
    if (userProfile.handle) {
      props.navigation.navigate('Home', {});
    }
  }, [userProfile, props.navigation]);
  return <></>;
};

function StackNavigator() {
  const {theme} = useTheme();

  const styles = StyleSheet.create({
    header: {
      width: '100%',
      height: 56,
      opacity: 1,
      backgroundColor: theme.color.secondary,
    },
  });

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        header: props => {
          return (
            <View style={styles.header}>
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
