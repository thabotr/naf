import React from 'react';
import {Surface, TextInput} from 'react-native-paper';
import globalStyles from '../../shared/styles';
export default function () {
  return (
    <Surface accessibilityLabel="message composer" style={globalStyles.card}>
      <TextInput label={'message text'} />
    </Surface>
  );
}
