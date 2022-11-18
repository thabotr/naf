import React from 'react';
import {View, TouchableOpacity, Pressable} from 'react-native';
import {
  Paragraph,
  Card,
  IconButton,
  ActivityIndicator,
  TouchableRipple,
  Badge,
  Avatar,
  List,
} from 'react-native-paper';
import TrackPlayer, {State as PlayState} from 'react-native-track-player';

import {useChats} from '../context/chat';
import {
  ListenWithMeContext,
  ListenWithMeContextType,
} from '../context/listenWithMe';
import {useTheme} from '../context/theme';
import {getAudioMetadata} from '../audio';
import {Chat} from '../types/chat';
import {CardCover} from './CardCover';
import {HorizontalView} from './Helpers/HorizontalView';
import {OverlayedView} from './Helpers/OverlayedView';
import {Lay} from './Helpers/Lay';
import {Show} from './Helpers/Show';
import {OnlyShow} from './Helpers/OnlyShow';
import { FileManager } from '../services/FileManager';

export function ChatPreviewCard({
  chat,
  navigation,
}: {
  chat: Chat;
  navigation: any;
}) {
  const {theme} = useTheme();
  const {listeningWith, currentTrack, playUserTrack, playState, saveColors} =
    React.useContext(ListenWithMeContext) as ListenWithMeContextType;
  const {saveActiveChat} = useChats();

  const [landscapeUri, setLandscapeUri] = React.useState('');
  const [avatarURI, setAvatarURI] = React.useState('');

  const latestMessage = chat.messages.slice(-1).find(_ => true);
  const unreadMessageCount = chat.messages.filter(m => !!m.unread).length;

  const [avatarPrimary, setAP] = React.useState(()=>theme.color.primary);
  const [avatarSecondary, setAS] = React.useState(()=>theme.color.secondary);

  React.useEffect(() => {
    if (chat.user.landscapeURI.includes('http'))
      FileManager.getFileURI(chat.user.landscapeURI, 'image/jpeg')
        .then(path => {
          path && setLandscapeUri(path);
        })
        .catch(e => console.error('failed to get landscape uri: ' + e));
  }, []);

  React.useEffect(()=>{
    landscapeUri && FileManager.getImageColors(landscapeUri)
    .then( colors => {
      colors && saveColors(colors);
    })
  }, [landscapeUri, theme])

  React.useEffect(()=>{
    avatarURI && FileManager.getImageColors(avatarURI)
    .then( colors => {
      if(colors){
        setAP(c=>(theme.dark ? colors.darkPrimary : colors.lightPrimary) ?? c);
        setAS(c=>(theme.dark ? colors.darkSecondary : colors.lightSecondary) ?? c);
      }
    })
  }, [avatarURI, theme])

  return (
    <Card
      style={{
        borderRadius: 5,
        margin: 2,
        padding: 4,
        backgroundColor: avatarSecondary,
      }}>
      <CardCover
        source={landscapeUri}
        style={{backgroundColor: avatarPrimary}}
      />
      <OverlayedView
        style={{
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          borderColor: avatarPrimary,
          borderWidth: 2,
        }}>
        <HorizontalView>
          <Pressable
            style={{height: '100%', width: '25%'}}
            onPress={() => {
              saveActiveChat(chat);
              navigation.navigate('ChatProfile');
            }}>
            <View style={{height: '50%', width: '100%'}}>
              <Lay
                component={
                  <CardCover
                    style={{width: '100%', height: '100%'}}
                    source={chat.user.avatarURI}
                    onURI={(uri)=>setAvatarURI(uri)}
                    alt={
                      <Avatar.Text
                        style={{
                          borderRadius: 0,
                          width: '100%',
                          height: '100%',
                          backgroundColor: avatarPrimary,
                        }}
                        label={chat.user.initials}
                      />
                    }
                  />
                }
                over={
                  <View
                    style={{
                      height: '100%',
                      width: '100%',
                      backgroundColor: avatarPrimary,
                      opacity: 1,
                    }}
                  />
                }
              />
            </View>
            <View style={{height: '50%', width: '100%', alignItems: 'center'}}>
              <Lay
                component={
                  <>
                    <Paragraph
                      style={{
                        fontWeight: 'bold',
                        color: theme.color.textPrimary,
                        textShadowColor: theme.color.textSecondary,
                      }}>
                      {chat.user.handle}
                    </Paragraph>
                    <Paragraph
                      style={{
                        color: theme.color.textPrimary,
                        textShadowColor: theme.color.textSecondary,
                      }}>
                      {chat.user.name} {chat.user.surname}
                    </Paragraph>
                  </>
                }
                over={
                  <View
                    style={{
                      height: '100%',
                      width: '100%',
                      backgroundColor: avatarSecondary,
                      opacity: 1,
                    }}
                  />
                }
              />
            </View>
          </Pressable>
          <View style={{height: '100%', width: '75%'}}>
            <TouchableOpacity
              style={{
                width: '100%',
                height: '25%',
                backgroundColor: theme.color.secondary,
                opacity: 0.5,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                if (
                  listeningWith === chat.user.handle &&
                  playState == PlayState.Playing
                )
                  TrackPlayer.pause().catch(e => console.log(e));
                else
                  getAudioMetadata(
                    `http://10.0.2.2:3000/listenwithme/${chat.user.handle.replace(
                      '->',
                      '',
                    )}/listen1`,
                  )
                    .then(
                      track => track && playUserTrack(chat.user.handle, track),
                    )
                    .catch(e => console.log(e));
              }}>
              <IconButton icon="account-music" />
              <Paragraph>
                {listeningWith === chat.user.handle
                  ? currentTrack?.title ?? ''
                  : ''}
              </Paragraph>
              <View>
                <IconButton
                  icon={
                    listeningWith === chat.user.handle &&
                    playState == PlayState.Playing
                      ? 'pause'
                      : 'play'
                  }
                />
                <OverlayedView>
                  <ActivityIndicator
                    size={35}
                    animating={
                      listeningWith === chat.user.handle &&
                      playState == PlayState.Playing
                    }
                    color={theme.color.secondary}
                  />
                </OverlayedView>
              </View>
            </TouchableOpacity>
            <View style={{width: '100%', height: '50%'}} />
            <View style={{width: '100%', height: '25%'}}>
              <Lay
                component={
                  <TouchableRipple
                    style={{
                      width: '100%',
                      height: '100%',
                      justifyContent: 'center',
                      padding: 5,
                    }}
                    onPress={() => {
                      saveActiveChat(chat);
                      navigation.push('Chat');
                    }}>
                    <Show
                      component={
                        <Paragraph
                          style={{
                            color: theme.color.textPrimary,
                            textShadowColor: theme.color.textSecondary,
                          }}
                          numberOfLines={1}>
                          {`converse with ${chat.user.handle}`}
                        </Paragraph>
                      }
                      If={!latestMessage}
                      ElseShow={
                        <List.Item
                          title={
                            !latestMessage?.text
                              ? '<sent a file>'
                              : latestMessage.text
                          }
                          left={_ => (
                            <List.Icon
                              icon={
                                latestMessage?.draft
                                  ? 'content-save-edit'
                                  : latestMessage?.text
                                  ? 'message-text'
                                  : 'attachment'
                              }
                            />
                          )}
                        />
                      }
                    />
                  </TouchableRipple>
                }
                over={
                  <View
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: theme.color.secondary,
                      opacity: 0.5,
                    }}
                  />
                }
              />
            </View>
          </View>
        </HorizontalView>
      </OverlayedView>
      <OnlyShow If={!!unreadMessageCount}>
        <Badge
          style={{
            position: 'absolute',
            bottom: -1,
            right: -1,
            borderRadius: 0,
            backgroundColor: theme.color.friendSecondary,
            borderWidth: 1,
            borderColor: theme.color.friendPrimary,
            borderStyle: 'solid',
          }}
          size={33}>
          {unreadMessageCount}
        </Badge>
      </OnlyShow>
    </Card>
  );
}
