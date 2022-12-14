import React, {useState} from 'react';
import {Text} from 'react-native-paper';
import {Login} from '../pages/Login/Login';
import {RemoteLoginRepository} from '../pages/Login/repository/remote';
import {Profile} from '../types/user';
import {ThemeProvider} from './providers/theme';

const remoteRepo = new RemoteLoginRepository();

export default function Router() {
  const [loggedInUser, setLoggedInUser] = useState<Profile | undefined>(
    undefined,
  );
  const [loginError, setLoginError] = useState<
    'AUTH_ERROR' | 'NET_ERROR' | 'APP_ERROR' | undefined
  >(undefined);
  const [userCredentials, setUserCredentials] = useState({
    handle: '',
    token: '',
  });

  function onPressLogin(credentials: {token: string; handle: string}) {
    remoteRepo
      .getUserProfile(credentials.token, credentials.handle)
      .then(profileResult => {
        if (!profileResult) {
          return;
        }
        setLoggedInUser(profileResult);
        setLoginError(undefined);
      })
      .catch(e => {
        setUserCredentials(credentials);
        setLoginError(e);
      });
  }

  if (!loggedInUser) {
    return (
      <ThemeProvider>
        <Login
          onPressLoginBtn={onPressLogin}
          userCredentials={userCredentials}
          loginError={loginError}
        />
      </ThemeProvider>
    );
  }
  return <Text>TODO navigate to home page</Text>;
}
