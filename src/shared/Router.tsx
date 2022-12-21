import React, {useState} from 'react';
import {Login, LoginErrorType} from '../pages/Login/Login';
import {RemoteLoginRepository} from '../pages/Login/repository/remote';
import {Profile} from '../types/user';
import {ThemeProvider} from './providers/theme';
import Home from '../pages/Home';

const remoteRepo = new RemoteLoginRepository();

export default function Router() {
  const [loggedInUser, setLoggedInUser] = useState<Profile | undefined>(
    undefined,
  );
  const [loginError, setLoginError] = useState<LoginErrorType>(undefined);
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
        setLoginError(e.message);
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
  return (
    <ThemeProvider>
      <Home
        chats={[]}
        onOpenPreferences={() => {}}
        onOpenUserProfile={() => {}}
      />
    </ThemeProvider>
  );
}
