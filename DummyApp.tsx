import React, {useState} from 'react';
import {ThemeProvider} from './src/context/theme';
import {Login} from './src/pages/LoginPage';

export default () => {
  const [err, setErr] = useState(undefined);
  const onPressLogin = (userCredentials: {handle: string; token: string}) => {
    console.log('logging in with credentials', userCredentials);
    setTimeout(() => {
      setErr(undefined);
      // setErr('NET_ERROR');
      console.log('here');
    }, 3000);
  };
  return (
    <ThemeProvider>
      <Login
        userCredentials={{handle: '', token: ''}}
        loginError={err}
        onPressLoginBtn={onPressLogin}
      />
    </ThemeProvider>
  );
};
