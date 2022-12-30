import React from 'react';
import {StyleSheet} from 'react-native';
import {Surface} from 'react-native-paper';

type Props = React.ComponentProps<typeof Surface>;

export default function (props: Props): JSX.Element {
  return <Surface style={[styles.floater, props.style]} {...props} />;
}

const styles = StyleSheet.create({
  floater: {
    position: 'absolute',
    right: 40,
    bottom: 50,
    elevation: 3,
  },
});
