import React from 'react';
import {Button, Paragraph, Surface} from 'react-native-paper';
import { OnlyShow } from '../components/Helpers/OnlyShow';

import {useTheme} from '../context/theme';
import {useLoggedInUser} from '../context/user';
import {useAppState} from '../providers/AppStateProvider';
import {remoteSignIn} from '../remote/login';

export function Login() {
  const {theme} = useTheme();
  const [loginError, setLoginError] = React.useState(false);
  const {loggedInUser, saveAppLoggedInUser} = useAppState();
  const {loginAs} = useLoggedInUser();

  React.useEffect(() => {
    loggedInUser && loginAs(loggedInUser);
  }, [loggedInUser]);

  const login = () => {
    remoteSignIn().then(user => {
      if (user) {
        setLoginError(false);
        loginAs(user);
        saveAppLoggedInUser(user);
      } else {
        setLoginError(true);
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
      <OnlyShow If={loginError}>
        <Paragraph style={{color: 'red', textAlign: 'center'}}>
          Login failed!
        </Paragraph>
      </OnlyShow>
      <Button style={{backgroundColor: theme.color.primary}} onPress={login}>
        Login
      </Button>
    </Surface>
  );
}
