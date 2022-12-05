import React from 'react';
import {Snackbar as RNPSnackbar} from 'react-native-paper';
import {useSnackable} from '../providers/Snackable';

function Snackbar() {
  const {msgAction, showMsgAction} = useSnackable();
  return (
    <RNPSnackbar
      visible={!!msgAction}
      onDismiss={() => showMsgAction(undefined)}
      action={{
        label: msgAction?.actionName ?? '',
        onPress: msgAction?.action,
      }}>
      {msgAction?.message}
    </RNPSnackbar>
  );
}

export {Snackbar};
