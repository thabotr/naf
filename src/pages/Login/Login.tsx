import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {Button, Paragraph} from 'react-native-paper';
import MemoedTextInput from '../../shared/components/MemoedTextInput';
import OnlyShow from '../../shared/components/OnlyShow';

import PageBackground from '../../shared/components/PageBackground';
import RemoteError from '../../shared/components/RemoteError';
import {HelperText} from '../../shared/middleware';

import {ThemeType, useThemedStyles} from '../../shared/providers/theme';

export type LoginErrorType =
  | 'NET_ERROR'
  | 'AUTH_ERROR'
  | 'APP_ERROR'
  | 'SERVER_ERROR'
  | undefined;
export type Credentials = {token: string; handle: string};
type Props = {
  userCredentials: {
    token: string;
    handle: string;
  };
  loginError?: string;
  onPressLoginBtn: (userCredentials: Credentials) => void;
  onToRegistration: (credentials: Credentials) => void;
  registered?: boolean;
};

export const verboseLoginError = (err: LoginErrorType): string => {
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
      return 'unexpected error';
  }
};

function SuccessfulRegistrationHelperText({
  registerd,
}: {
  registerd?: boolean;
}): JSX.Element {
  const styles = StyleSheet.create({
    paragraph: {
      textAlign: 'center',
      color: 'green',
      fontSize: 17,
      padding: 5,
    },
  });
  return (
    <OnlyShow If={registerd}>
      <Paragraph style={styles.paragraph}>
        {HelperText.successfulRegistrationText}
      </Paragraph>
    </OnlyShow>
  );
}

export function Login(props: Props): JSX.Element {
  const [loginError, setLoginError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [handle, setHandle] = useState('');
  const [token, setToken] = useState('');
  const [loginBtnDisabled, disableLoginBtn] = useState(true);

  useEffect(() => {
    if (!handle || !token || loading) {
      disableLoginBtn(true);
    } else {
      disableLoginBtn(false);
    }
  }, [handle, token, loading]);

  useEffect(() => {
    setLoginError(props.loginError);
    setLoading(false);
  }, [props.loginError]);

  useEffect(() => {
    setHandle(props.userCredentials.handle);
    setToken(props.userCredentials.token);
  }, [props.userCredentials.handle, props.userCredentials.token]);

  const onClickLogin = () => {
    setLoading(true);
    setLoginError(undefined);
    props.onPressLoginBtn({
      handle: handle,
      token: token,
    });
  };

  const styles = useThemedStyles(styleSheet);
  return (
    <PageBackground accessibilityLabel="login page" style={styles.pageBg}>
      <MemoedTextInput
        label="your access token"
        setText={setToken}
        disabled={loading}
        defaultValue={props.userCredentials.token}
        error={props.loginError}
        secureTextEntry
      />
      <MemoedTextInput
        label="your handle"
        setText={setHandle}
        disabled={loading}
        defaultValue={props.userCredentials.handle}
        error={props.loginError}
      />
      <SuccessfulRegistrationHelperText registerd={props.registered} />
      <RemoteError
        error={{
          name: 'login',
          text: 'Login failed!',
          desciption: loginError,
        }}
      />
      <Button
        onPress={onClickLogin}
        loading={loading}
        disabled={loginBtnDisabled}
        accessibilityLabel="login"
        style={styles.loginButton}>
        Login
      </Button>
      <Button
        accessibilityLabel="to registration"
        onPress={() => props.onToRegistration({handle: handle, token: token})}
        icon="account-plus"
        mode="outlined"
        color={styles.toRegistrationBtn.color}
        contentStyle={styles.toRegistrationBtn.contentStyle}
        compact
        uppercase={false}>
        New to these parts? Register.
      </Button>
    </PageBackground>
  );
}
const styleSheet = (theme: ThemeType) =>
  StyleSheet.create({
    loginButton: {
      backgroundColor: theme.color.primary,
      marginHorizontal: 50,
      marginVertical: 10,
    },
    pageBg: {
      justifyContent: 'center',
    },
    toRegistrationBtn: {
      color: theme.color.textPrimary,
      contentStyle: {
        flexDirection: 'row-reverse',
      },
    },
  });
