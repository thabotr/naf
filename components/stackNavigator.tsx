import React from 'react';
import { Appbar, Avatar, IconButton} from 'react-native-paper';
import { createNativeStackNavigator} from '@react-navigation/native-stack';

import {useTheme} from '../context/theme';
import { UserContext, UserContextType } from '../context/user';
import { OnlyShow, Show } from './helper';
import { Messages } from '../pages/messages';
import { Home } from '../pages/home';
import { Image } from './image';
import { Settings } from '../pages/settings';
import {useChats} from '../context/chat';

const Stack = createNativeStackNavigator();

export function StackNavigator(){
  const {theme} = useTheme();
  const {user} = React.useContext(UserContext) as UserContextType;
  const {activeChat} = useChats();

  return <Stack.Navigator
    initialRouteName="Home"
    screenOptions={{
        header: props => {
          const navBarUser = props.route.name !== "Chat" ? user : activeChat()?.user;
          return <Appbar.Header style={{backgroundColor: theme.color.primary}}>
              <OnlyShow If={props.route.name === "Home"}>
                <IconButton icon='menu' onPress={()=>props.navigation.navigate('Settings')}/>
              </OnlyShow>
              <OnlyShow If={!!props.back}>
                <Appbar.BackAction onPress={()=>{
                  props.navigation.goBack();
                }}/>
              </OnlyShow>
              <Show
                component={
                <Appbar.Content
                  titleStyle={{ color: theme.color.textPrimary, textShadowColor: theme.color.textSecondary}}
                  title={navBarUser?.handle}
                  subtitleStyle={{ color: theme.color.textPrimary, textShadowColor: theme.color.textSecondary}}
                  subtitle={`${navBarUser?.name} ${navBarUser?.surname}`}
                />
                }
                If={props.route.name !== 'Settings'}
                ElseShow={
                  <Appbar.Content title='Settings'/>
                }
              />
              <Image
                url={navBarUser?.avatarURI ?? ''}
                style={{ height: '100%', borderRadius: 0, width: 50, marginRight: 10}}
                alt={<Avatar.Text
                  style={{borderRadius: 0, width: 50, marginRight: 10, backgroundColor: theme.color.primary}}
                  label={navBarUser?.initials ?? ''}
                />}
              />
            </Appbar.Header>
      },
      headerStyle: { backgroundColor: theme.color.primary}
    }}
  >
    <Stack.Screen
        name="Chat"
        component={Messages}
    />
    <Stack.Screen
        name="Home"
        component={Home}
    />
    <Stack.Screen
        name="Settings"
        component={Settings}
    />
  </Stack.Navigator>
}