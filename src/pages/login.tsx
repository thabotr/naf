import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {Button, Paragraph, Surface, TextInput} from 'react-native-paper';
import {OnlyShow} from '../components/Helpers/OnlyShow';

import {useTheme} from '../context/theme';
import {useLoggedInUser} from '../context/user';
import {useColorsForUsers} from '../providers/UserTheme';
import {Remote} from '../services/Remote';
import {UserCredentials} from '../types/user';
import {getColorsForUser} from '../utils/getUserColors';

export function Login() {
  const {theme} = useTheme();
  const [loginError, setLoginError] = useState(false);
  const [loading, setLoading] = useState(false);
  const {saveProfile} = useLoggedInUser();
  const {saveUserColors} = useColorsForUsers();
  const [credentials, setCredentials] = useState<UserCredentials>({
    handle: '',
    token: '',
  });

  // useEffect(() => {
  //   setLoading(true);
  //   AsyncStorage.getItem('profile')
  //     .then(profileString => {
  //       if (profileString) {
  //         const profile = JSON.parse(profileString) as Profile;
  //         Remote.getProfile(
  //           profile.credentials.token,
  //           profile.credentials.handle,
  //           profile.lastModified,
  //         ).then(profile => {
  //           if (profile) {
  //             AsyncStorage.setItem('profile', JSON.stringify(profile));
  //             saveProfile(profile);
  //           }
  //         });
  //         saveProfile({...profile, credentials: profile.credentials});
  //       }
  //     })
  //     .finally(() => setLoading(false));
  // }, []);

  const login = () => {
    setLoginError(false);
    setLoading(true);
    Remote.getProfile(credentials.token, credentials.handle)
      .then(profile => {
        if (profile) {
          setLoginError(false);
          saveProfile(profile);
          AsyncStorage.setItem('profile', JSON.stringify(profile));
          getColorsForUser(profile).then(
            colors => colors && saveUserColors(profile.handle, colors),
          );
        } else {
          setLoginError(true);
        }
      })
      .finally(() => setLoading(false));
  };

  const setFieldValue = (text: string, field: 'token' | 'handle') => {
    setCredentials(c => {
      switch (field) {
        case 'handle':
          return {
            ...c,
            handle: text,
          };
        case 'token':
          return {
            ...c,
            token: text,
          };
      }
    });
  };

  const styles = StyleSheet.create({
    page: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      backgroundColor: theme.color.secondary,
    },
    textInput: {marginHorizontal: 20},
    loginErrorText: {color: 'red', textAlign: 'center'},
    loginButton: {
      backgroundColor: theme.color.primary,
      marginHorizontal: 50,
      marginVertical: 10,
    },
  });

  return (
    <Surface style={styles.page}>
      <TextInput
        secureTextEntry
        label="your access token"
        accessibilityLabel="your access token"
        error={loginError}
        mode="outlined"
        onChangeText={text => setFieldValue(text, 'token')}
        style={styles.textInput}
        disabled={loading}
      />
      <TextInput
        label="your handle"
        accessibilityLabel="your handle"
        error={loginError}
        mode="outlined"
        onChangeText={text => setFieldValue(text, 'handle')}
        style={styles.textInput}
        disabled={loading}
      />
      <OnlyShow If={loginError}>
        <Paragraph
          accessibilityLabel="login status"
          style={styles.loginErrorText}>
          Login failed!
        </Paragraph>
      </OnlyShow>
      <Button
        onPress={login}
        loading={loading}
        disabled={!credentials?.handle || !credentials.token || loading}
        accessibilityLabel="login"
        style={styles.loginButton}>
        Login
      </Button>
    </Surface>
  );
}
