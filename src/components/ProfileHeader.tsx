import React, {useEffect, useState} from 'react';
import {NativeStackHeaderProps} from '@react-navigation/native-stack';
import {Appbar} from 'react-native-paper';
import {useTheme} from '../context/theme';
import {User} from '../types/user';
import {Image} from './Image';
import {OnlyShow} from './Helpers/OnlyShow';
import {useColorsForUsers} from '../providers/UserTheme';
import {StyleSheet} from 'react-native';

function ProfileHeader({
  user,
  props,
}: {
  user: User;
  props: NativeStackHeaderProps;
}) {
  const {theme} = useTheme();
  const {colorsForUsers} = useColorsForUsers();
  const [appHeaderColor, setAppHeaderColor] = useState(theme.color.primary);

  useEffect(() => {
    const colors = colorsForUsers.get(user.handle);
    colors &&
      setAppHeaderColor(
        (theme.dark
          ? colors.landscape.darkPrimary
          : colors.landscape.lightPrimary) ?? theme.color.primary,
      );
  }, [theme, colorsForUsers, user.handle]);

  const styles = StyleSheet.create({
    header: {backgroundColor: appHeaderColor},
    backAction: {borderRadius: 0},
    avatar: {width: 50, height: '100%'},
  });

  return (
    <Appbar.Header style={styles.header}>
      <OnlyShow If={!!props.back}>
        <Appbar.BackAction
          color={theme.color.textPrimary}
          style={styles.backAction}
          onPress={() => {
            props.navigation.goBack();
          }}
        />
      </OnlyShow>
      <Appbar.Content color={theme.color.textPrimary} title={'Profile'} />
      <Image source={user.avatarURI} style={styles.avatar} />
    </Appbar.Header>
  );
}

export {ProfileHeader};
