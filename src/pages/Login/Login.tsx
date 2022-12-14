import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Paragraph, TextInput} from 'react-native-paper';

import {OnlyShow} from '../../components/Helpers/OnlyShow';
import PageBackground from '../../shared/components/PageBackground';

import {ThemeType, useThemedStyles} from '../../shared/providers/theme';

type LoginErrorType =
  | 'NET_ERROR'
  | 'AUTH_ERROR'
  | 'APP_ERROR'
  | 'SERVER_ERROR'
  | undefined;
type Props = {
  userCredentials: {
    token: string;
    handle: string;
  };
  loginError?: LoginErrorType;
  onPressLoginBtn: (userCredentials: {token: string; handle: string}) => void;
};

const verboseLoginError = (err: LoginErrorType) => {
  switch (err) {
    case 'APP_ERROR':
      return 'unknown error encountered. Please resart application';
    case 'AUTH_ERROR':
      return 'please check credentials and try again';
    case 'NET_ERROR':
      return 'please check network connection and try again';
    case 'SERVER_ERROR':
      return 'something went wrong on our side. Please give us a moment to look into this issue';
    default:
      return '';
  }
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

  const onClickLogin = () => {
    setLoading(true);
    setLoginError(undefined);
    props.onPressLoginBtn({
      handle: handle,
      token: token,
    });
  };

  return (
    <PageBackground>
      <MemoedTextInput
        label="your access token"
        setText={setToken}
        loading={loading}
        defaultValue={props.userCredentials.token}
        loginError={props.loginError}
        secureTextEntry
      />
      <MemoedTextInput
        label="your handle"
        setText={setHandle}
        loading={loading}
        defaultValue={props.userCredentials.handle}
        loginError={props.loginError}
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
            {verboseLoginError(props.loginError)}
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
    </PageBackground>
  );
}

const CustomTextInput = (props: {
  loading: boolean;
  loginError?: any;
  defaultValue: string;
  setText: (token: string) => void;
  label: string;
  secureTextEntry?: boolean;
}) => {
  const styles = useThemedStyles(styleSheet);
  return (
    <TextInput
      label={props.label}
      secureTextEntry={props.secureTextEntry}
      onChangeText={text => props.setText(text)}
      disabled={props.loading}
      error={!!props.loginError}
      defaultValue={props.defaultValue}
      mode="outlined"
      style={styles.textInput}
      accessibilityLabel={props.label}
    />
  );
};

const MemoedTextInput = React.memo(CustomTextInput);

const styleSheet = (theme: ThemeType) =>
  StyleSheet.create({
    textInput: {marginHorizontal: 20},
    loginErrorText: {color: 'red', textAlign: 'center'},
    loginErrorSubText: {fontStyle: 'italic'},
    loginButton: {
      backgroundColor: theme.color.primary,
      marginHorizontal: 50,
      marginVertical: 10,
    },
  });
