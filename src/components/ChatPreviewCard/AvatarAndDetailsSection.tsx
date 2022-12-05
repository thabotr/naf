import React from 'react';
import {TouchableOpacity, View, StyleSheet} from 'react-native';
import {Avatar, Paragraph} from 'react-native-paper';
import {useChats} from '../../context/chat';
import {useTheme} from '../../context/theme';
import {Chat} from '../../types/chat';
import {Image} from '../Image';
import {Lay} from '../Helpers/Lay';

function AvatarAndDetailsSection({
  chat,
  contextualTheme,
  setAvatarURI,
  navigation,
}: {
  chat: Chat;
  contextualTheme: {primary: string; secondary: string};
  setAvatarURI: (uri: string) => void;
  navigation: any;
}) {
  const {saveActiveChat} = useChats();
  const {theme} = useTheme();
  const styles = StyleSheet.create({
    touchOp: {height: '100%', width: '25%'},
    view: {height: '50%', width: '100%'},
    img: {width: '100%', height: '100%'},
    avatarTxt: {
      borderRadius: 0,
      width: '100%',
      height: '100%',
      backgroundColor: contextualTheme.primary,
    },
    overView: {
      height: '100%',
      width: '100%',
      backgroundColor: contextualTheme.primary,
      opacity: 1,
    },
    coverView: {height: '50%', width: '100%', alignItems: 'center'},
    handle: {
      fontWeight: 'bold',
      color: theme.color.textPrimary,
      textShadowColor: theme.color.textSecondary,
    },
    names: {
      height: '100%',
      width: '100%',
      backgroundColor: contextualTheme.secondary,
      opacity: 1,
    },
  });
  return (
    <TouchableOpacity
      style={styles.touchOp}
      onPress={() => {
        saveActiveChat(chat);
        navigation.navigate('ChatProfile');
      }}
      activeOpacity={0.8}>
      <View style={styles.view}>
        <Lay
          component={
            <Image
              style={styles.img}
              source={chat.user.avatarURI}
              onURI={uri => setAvatarURI(uri)}
              alt={
                <Avatar.Text
                  style={styles.avatarTxt}
                  label={chat.user.initials}
                />
              }
            />
          }
          over={<View style={styles.overView} />}
        />
      </View>
      <View style={styles.coverView}>
        <Lay
          component={
            <>
              <Paragraph style={styles.handle}>{chat.user.handle}</Paragraph>
              <Paragraph
                style={{
                  color: theme.color.textPrimary,
                  textShadowColor: theme.color.textSecondary,
                }}>
                {chat.user.name} {chat.user.surname}
              </Paragraph>
            </>
          }
          over={<View style={styles.names} />}
        />
      </View>
    </TouchableOpacity>
  );
}

export {AvatarAndDetailsSection};
