import React from 'react';
import { View } from 'react-native';
import { Appbar, Button, Paragraph} from "react-native-paper";
import {NativeStackHeaderProps} from '@react-navigation/native-stack';

import { CardCover } from '../components/CardCover';
import { OnlyShow} from '../components/helper';
import { HorizontalView } from '../components/HorizontalView';
import { useChats } from '../context/chat';
import { useTheme } from '../context/theme';
import { User } from '../types/user';

const ProfilePreview=({user}:{user: User})=>{
  const {theme} = useTheme();
  return <>
    <CardCover source={user?.landscapeURI} style={{width: '100%'}}/>
    <HorizontalView style={{width: '100%', alignItems: 'center', padding: 10, backgroundColor: theme.color.secondary}}>
      <CardCover source={user?.avatarURI} style={{width: 120, height: 120}}/>
      <View style={{backgroundColor: theme.color.secondary, width: 340, padding: 10}}>
        <Paragraph style={{fontWeight: 'bold'}}>{user?.handle}</Paragraph>
        <Paragraph>{user?.name} {user?.surname} [{user?.initials}]</Paragraph>
      </View>
    </HorizontalView>
    <Button
      icon='account-remove'
      onPress={()=>{}}
      uppercase={false}
      >
      Disconnect from {user.handle}
    </Button>
  </>
}

function ChatProfileHeader(props:NativeStackHeaderProps){
  const {activeChat} = useChats();
  const {theme} = useTheme();

  return <Appbar.Header style={{backgroundColor: theme.color.primary}}>
  <OnlyShow If={!!props.back}>
    <Appbar.BackAction onPress={()=>{
      props.navigation.goBack();
    }}/>
  </OnlyShow>
  <Appbar.Content title={'Profile'}/>
  <CardCover source={activeChat()?.user.avatarURI} style={{width: 50, height: '100%'}}/>
</Appbar.Header>
}

function ChatProfile(){
  const {activeChat} = useChats();
  const user = activeChat()?.user;
  if(!user){
    return <></>;
  }

  return <>
    <ProfilePreview user={user}/>
  </>
}

export {ChatProfile, ChatProfileHeader};