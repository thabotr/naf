import {useState, useEffect} from 'react';
import {Button, Paragraph, Surface, TextInput} from 'react-native-paper';
import {OnlyShow} from '../components/Helpers/OnlyShow';

import {useTheme} from '../context/theme';
import {useLoggedInUser} from '../context/user';
import {useAppState} from '../providers/AppStateProvider';
import {useColorsForUsers} from '../providers/UserTheme';
import {Remote} from '../services/Remote';
import {getColorsForUser} from '../utils/getUserColors';

export function Login() {
  const {theme} = useTheme();
  const [loginError, setLoginError] = useState(false);
  const [loading, setLoading] = useState(false);
  const {loggedInUser, saveAppLoggedInUser} = useAppState();
  const {loginAs, useProfile} = useLoggedInUser();
  const {saveUserColors} = useColorsForUsers();
  const [credentials, setCredentials] = useState<{
    token: string;
    handle: string;
  }>({handle: '', token: ''});

  useEffect(() => {
    loggedInUser && loginAs(loggedInUser);
  }, [loggedInUser]);

  const login = () => {
    setLoginError(false);
    setLoading(true);
    Remote.getProfile(credentials.token, credentials.handle)
      .then(profile => {
        if (profile) {
          setLoginError(false);
          loginAs(profile.user);
          useProfile(profile);
          saveAppLoggedInUser(profile.user);
          // saveUserColors(profile.user.handle)
          getColorsForUser(profile.user).then(
            colors => colors && saveUserColors(profile.user.handle, colors),
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

  return (
    <Surface
      style={{
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        backgroundColor: theme.color.secondary,
      }}>
      <TextInput
        label="your access token"
        error={loginError}
        mode="outlined"
        onChangeText={text => setFieldValue(text, 'token')}
        style={{
          marginHorizontal: 20,
        }}
        disabled={loading}
      />
      <TextInput
        label="your handle"
        error={loginError}
        mode="outlined"
        onChangeText={text => setFieldValue(text, 'handle')}
        style={{
          marginHorizontal: 20,
        }}
        disabled={loading}
      />
      <OnlyShow If={loginError}>
        <Paragraph style={{color: 'red', textAlign: 'center'}}>
          Login failed!
        </Paragraph>
      </OnlyShow>
      <Button
        loading={loading}
        disabled={!credentials?.handle || !credentials.token || loading}
        style={{
          backgroundColor: theme.color.primary,
          marginHorizontal: 50,
          marginVertical: 10,
        }}
        onPress={login}>
        Login
      </Button>
    </Surface>
  );
}
