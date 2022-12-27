import React, {useEffect, useState} from 'react';
import {ToastAndroid, View} from 'react-native';
import {Button, Paragraph} from 'react-native-paper';
import BackToHomeNavigationBar from '../../shared/components/BackToHomeNavigationBar';
import OnlyShow from '../../shared/components/OnlyShow';
import PageBackground from '../../shared/components/PageBackground';
import {Chat} from '../../types/chat';
import {LoginErrorType, verboseLoginError} from '../Login/Login';
import globalStyles from '../../shared/styles';

type Props = {
  onGoBack?: () => void;
  chat?: Chat;
  onDisconnect?: () => void;
  error?: LoginErrorType;
};
export default function ({onGoBack, chat, onDisconnect, error}: Props) {
  const [disconnecting, setDisconnecting] = useState(false);
  useEffect(() => {
    if (error) {
      setDisconnecting(false);
    }
  }, [error]);
  return (
    <PageBackground pageLabel={`${chat?.user.handle} profile page`}>
      <BackToHomeNavigationBar
        accessibilityLabel="chat profile navigation bar"
        onBackToHome={onGoBack}
      />
      <Button
        onPress={() =>
          ToastAndroid.show('hold to disconnect from user', ToastAndroid.SHORT)
        }
        onLongPress={() => {
          setDisconnecting(true);
          onDisconnect?.();
        }}
        loading={disconnecting}
        disabled={disconnecting}
        icon="account-remove"
        accessibilityLabel={`disconnect from chat ${chat?.user.handle}`}
        children={null}
      />
      <OnlyShow If={!!error}>
        <View>
          <Paragraph
            accessibilityLabel="chat profile status"
            style={globalStyles.loginErrorText}>
            Chat profile error!
          </Paragraph>
          <Paragraph
            accessibilityLabel="chat profile sub-status"
            style={[
              globalStyles.loginErrorText,
              globalStyles.loginErrorSubText,
            ]}>
            {verboseLoginError(error)}
          </Paragraph>
        </View>
      </OnlyShow>
    </PageBackground>
  );
}
