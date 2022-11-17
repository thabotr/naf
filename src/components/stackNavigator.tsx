import React from 'react';
import { createNativeStackNavigator} from '@react-navigation/native-stack';

import {useTheme} from '../context/theme';
import { ChatHeader, Chat } from '../pages/Chat';
import { Home, HomeHeader } from '../pages/Home';
import { Settings } from '../pages/Settings';
import { UserProfile, UserProfileHeader } from '../pages/UserProfile';
import { ChatProfile, ChatProfileHeader } from '../pages/ChatProfile';
import { GenericHeader } from './GenericPageHeader';

const Stack = createNativeStackNavigator();

function StackNavigator(){
  const {theme} = useTheme();

  return <Stack.Navigator
    initialRouteName="Home"
    screenOptions={{
      header: props => {
        switch(props.route.name){
          case 'ChatProfile':
            return <ChatProfileHeader {...props}/>;
          case 'UserProfile':
            return <UserProfileHeader {...props}/>;
          case 'Home':
            return <HomeHeader {...props}/>;
          case 'Chat':
            return <ChatHeader {...props}/>;
          case 'Settings':
            return <GenericHeader name='Settings' props={props}/>
        }
      },
      headerStyle: { backgroundColor: theme.color.primary}
    }}
  >
    <Stack.Screen
      name="Chat"
      component={Chat}
    />
    <Stack.Screen
      name="Home"
      component={Home}
    />
    <Stack.Screen
      name="Settings"
      component={Settings}
    />
    <Stack.Screen
      name="UserProfile"
      component={UserProfile}
    />
    <Stack.Screen
      name="ChatProfile"
      component={ChatProfile}
    />
  </Stack.Navigator>
}

export {StackNavigator};