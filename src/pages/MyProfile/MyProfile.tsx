import React from 'react';
import {ToastAndroid} from 'react-native';
import {Button} from 'react-native-paper';
import BackToHomeNavigationBar from '../../shared/components/BackToHomeNavigationBar';
import PageBackground from '../../shared/components/PageBackground';

type Props = {
  onLogout?: () => void;
  onBackToHome?: () => void;
};

export default function ({onLogout, onBackToHome}: Props) {
  return (
    <PageBackground pageLabel="my profile page">
      <BackToHomeNavigationBar
        accessibilityLabel="my profile navigation bar"
        onBackToHome={onBackToHome}
      />
      <Button
        onPress={() => ToastAndroid.show('hold to logout', ToastAndroid.SHORT)}
        onLongPress={onLogout}
        icon="logout"
        accessibilityLabel="logout"
        children={null}
      />
    </PageBackground>
  );
}
