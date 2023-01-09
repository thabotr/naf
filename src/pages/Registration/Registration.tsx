import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {Button, Paragraph} from 'react-native-paper';
import MemoedTextInput from '../../shared/components/MemoedTextInput';
import OnlyShow from '../../shared/components/OnlyShow';
import PageBackground from '../../shared/components/PageBackground';
import RemoteError from '../../shared/components/RemoteError';
import {ThemeType, useThemedStyles} from '../../shared/providers/theme';
import {Validator, ValidatorResultType} from '../../shared/middleware';
import {Credentials} from '../Login/Login';
type Props = {
  onBackToLogin: () => void;
  registrationError?: string;
  credentials: Credentials;
  onRegister: (credentials: Credentials) => void;
};
export default (props: Props): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [registerBtnDisabled, disableRegisterBtn] = useState(true);
  const [handle, setHandle] = useState('');
  const [token, setToken] = useState('');
  const handleValidation = Validator.validateHandle(handle);
  const tokenValidation = Validator.validateToken(token);

  useEffect(() => {
    setLoading(false);
  }, [props.registrationError]);

  useEffect(() => {
    if (handleValidation.isValid && tokenValidation.isValid) {
      disableRegisterBtn(false);
    } else {
      disableRegisterBtn(true);
    }
  }, [handleValidation.isValid, tokenValidation.isValid]);

  useEffect(() => {
    setHandle(props.credentials.handle);
    setToken(props.credentials.token);
  }, [props.credentials.handle, props.credentials.token]);

  const onClickRegister = () => {
    setLoading(true);
    props.onRegister({
      token: token,
      handle: handle,
    });
  };

  const styles = useThemedStyles(styleSheet);
  return (
    <PageBackground accessibilityLabel="registration page">
      <MemoedTextInputWithHelperText
        defaultValue={props.credentials.token}
        label="your new access token"
        disabled={loading}
        setText={text => setToken(text)}
        secureTextEntry
        validation={tokenValidation}
      />
      <MemoedTextInputWithHelperText
        defaultValue={props.credentials.handle}
        label="your new handle"
        disabled={loading}
        setText={text => setHandle(text)}
        validation={handleValidation}
        error={'handle already taken'}
      />
      <Button
        onPress={onClickRegister}
        loading={loading}
        disabled={registerBtnDisabled || loading}
        accessibilityLabel="register"
        style={styles.loginButton}>
        Register
      </Button>
      <RemoteError
        error={{
          name: 'registration',
          text: 'Registration failed!',
          desciption: props.registrationError,
        }}
      />
      <Button
        accessibilityLabel="back to login"
        onPress={props.onBackToLogin}
        disabled={loading}
        icon="arrow-left"
        mode="outlined"
        color={styles.toLoginBtn.color}
        compact
        uppercase={false}>
        Already a citizen? Back to login.
      </Button>
    </PageBackground>
  );
};

type MemoedTextInputWithHelperTextProps = React.ComponentProps<
  typeof MemoedTextInput
> & {validation: ValidatorResultType};
function MemoedTextInputWithHelperText(
  props: MemoedTextInputWithHelperTextProps,
): JSX.Element {
  const styles = useThemedStyles(styleSheet);
  return (
    <>
      <MemoedTextInput {...props} />
      <OnlyShow If={!props.validation.isValid}>
        <Paragraph
          accessibilityLabel={`${props.label} validation helper text`}
          style={[styles.hintText, styles.paddedParagraph]}>
          {props.validation.reason}
        </Paragraph>
      </OnlyShow>
    </>
  );
}

const styleSheet = (theme: ThemeType) =>
  StyleSheet.create({
    loginButton: {
      backgroundColor: theme.color.primary,
      marginHorizontal: 50,
      marginVertical: 10,
    },
    toLoginBtn: {
      color: theme.color.textPrimary,
    },
    paddedParagraph: {
      paddingHorizontal: 30,
    },
    hintText: {
      color: 'purple',
    },
  });
