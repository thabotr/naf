import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Paragraph, Surface, TextInput} from 'react-native-paper';

import {OnlyShow} from '../components/Helpers/OnlyShow';

import {ThemeType, useThemedStyles} from '../shared/providers/theme';

type Props = {
  userCredentials: {
    token: string;
    handle: string;
  };
  loginError?: 'NET_ERROR' | 'AUTH_ERROR';
  onPressLoginBtn: (userCredentials: {token: string; handle: string}) => void;
};

export function Login(props: Props) {
  const styles = useThemedStyles(styleSheet);
  const [loginError, setLoginError] = useState(() => props.loginError);
  const [loading, setLoading] = useState(false);
  const [handle, setHandle] = useState(props.userCredentials.handle);
  const [token, setToken] = useState(props.userCredentials.token);
  const [loginBtnDisabled, disableLoginBtn] = useState(true);

  useEffect(() => {
    if (!handle || !token || loading) {
      disableLoginBtn(true);
    } else {
      disableLoginBtn(false);
    }
  }, [handle, token, loading]);

  useEffect(() => {
    if (props.loginError) {
      setLoginError(props.loginError);
      setLoading(false);
    }
  }, [props.loginError]);

  const onClickLogin = () => {
    setLoading(true);
    setLoginError(undefined);
    props.onPressLoginBtn({
      handle: handle,
      token: token,
    });
  };

  return (
    <Surface style={styles.page}>
      <TextInput
        label="your access token"
        secureTextEntry
        onChangeText={text => setToken(text)}
        disabled={loading}
        error={!!loginError}
        defaultValue={props.userCredentials.token}
        mode="outlined"
        style={styles.textInput}
        accessibilityLabel="your access token"
      />
      <TextInput
        label="your handle"
        onChangeText={text => setHandle(text)}
        disabled={loading}
        error={!!loginError}
        defaultValue={props.userCredentials.handle}
        mode="outlined"
        style={styles.textInput}
        accessibilityLabel="your handle"
      />
      <OnlyShow If={!!loginError}>
        <View>
          <Paragraph
            accessibilityLabel="login status"
            style={styles.loginErrorText}>
            Login failed!
          </Paragraph>
          <Paragraph
            accessibilityLabel="login sub-status"
            style={[styles.loginErrorText, styles.loginErrorSubText]}>
            please check{' '}
            {loginError === 'AUTH_ERROR' ? 'credentials' : 'network connection'}{' '}
            and try again
          </Paragraph>
        </View>
      </OnlyShow>
      <Button
        onPress={onClickLogin}
        loading={loading}
        disabled={loginBtnDisabled}
        accessibilityLabel="login"
        style={styles.loginButton}>
        Login
      </Button>
    </Surface>
  );
}

const styleSheet = (theme: ThemeType) =>
  StyleSheet.create({
    page: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      backgroundColor: theme.color.secondary,
    },
    textInput: {marginHorizontal: 20},
    loginErrorText: {color: 'red', textAlign: 'center'},
    loginErrorSubText: {fontStyle: 'italic'},
    loginButton: {
      backgroundColor: theme.color.primary,
      marginHorizontal: 50,
      marginVertical: 10,
    },
  });
