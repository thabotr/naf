import React from 'react';
import { Button, Paragraph, Surface } from "react-native-paper";
import RNFetchBlob from 'rn-fetch-blob';

import { OnlyShow } from '../components/helper';
import {useTheme} from '../context/theme';
import { UserContext, UserContextType } from "../context/user";
import { URLS } from '../types/routes';
import { User } from '../types/user';

export function Login(){
  const {loginAs} = React.useContext(UserContext) as UserContextType;
  const {theme} = useTheme();
  const [loginError, setLoginError] = React.useState(false);
  const login = () => {
    RNFetchBlob.fetch('GET', URLS.PROFILE)
    .then( r => {
      if( r.info()['status'] === 200){
        const body = r.json();
        const user = body as User;
        setLoginError(false);
        loginAs(user);
      }
    })
    .catch( e => {
      setLoginError(true);
      console.error(e);
    })
  }
  return <Surface style={{width: '100%', height: '100%', justifyContent: 'center', backgroundColor: theme.color.secondary}}>
    <OnlyShow If={loginError}>
      <Paragraph style={{color: 'red', textAlign: 'center'}}>Login failed!</Paragraph>
    </OnlyShow>
    <Button style={{backgroundColor: theme.color.primary}} onPress={login}>Login</Button>
  </Surface>
}