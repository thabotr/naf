import React from 'react';
import {ViewProps} from 'react-native';
import {IconButton} from 'react-native-paper';
import globalStyles from '../../shared/styles';

type Props = ViewProps & any & {};

export default function (props: Props) {
  return (
    <IconButton
      accessibilityLabel="compose message"
      icon="pencil"
      style={[globalStyles.square, props.style]}
      {...props}
    />
  );
}
