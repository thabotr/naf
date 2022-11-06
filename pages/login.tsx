import React from 'react';
import {ToastAndroid} from 'react-native';
import { Button, Paragraph, Surface } from "react-native-paper";
import RNFetchBlob from 'rn-fetch-blob';
import { OnlyShow } from '../components/helper';
import { UserContext, UserContextType } from "../context/user";
import { URLS } from '../types/routes';
import { User } from '../types/user';

export function Login(){
  const {loginAs} = React.useContext(UserContext) as UserContextType;
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
  return <Surface style={{width: '100%', height: '100%', justifyContent: 'center'}}>
    <OnlyShow If={loginError}>
      <Paragraph style={{color: 'red', textAlign: 'center'}}>Login failed!</Paragraph>
    </OnlyShow>
    <Button onPress={login}>Login</Button>
  </Surface>
}