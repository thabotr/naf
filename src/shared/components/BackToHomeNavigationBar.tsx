import React from 'react';
import {ViewProps} from 'react-native';
import {Surface} from 'react-native-paper';
import {useThemedStyles} from '../providers/theme';
import globalStyles, {globalThemedStyles} from '../styles';
import IconButton from './IconButton';

type Props = ViewProps & {
  onBackToHome?: () => void;
};

export default function (props: Props): JSX.Element {
  const themedStyle = useThemedStyles(globalThemedStyles);
  return (
    <Surface {...props} style={themedStyle.navbar}>
      <IconButton
        icon="arrow-left"
        accessibilityLabel="back to home"
        onPress={props.onBackToHome}
        style={globalStyles.square}
      />
    </Surface>
  );
}
