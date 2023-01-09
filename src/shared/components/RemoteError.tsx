import React from 'react';
import {View} from 'react-native';
import {Paragraph} from 'react-native-paper';
import styles from '../styles';
type Props = {
  error: {
    name: string;
    desciption?: string;
    text: string;
  };
};
export default function (props: Props): JSX.Element {
  if (!props.error.desciption) {
    return <></>;
  }
  return (
    <View>
      <Paragraph
        accessibilityLabel={`${props.error.name} status`}
        style={styles.loginErrorText}>
        {props.error.text}
      </Paragraph>
      <Paragraph
        accessibilityLabel={`${props.error.name} sub-status`}
        style={[styles.loginErrorText, styles.loginErrorSubText]}>
        {props.error.desciption}
      </Paragraph>
    </View>
  );
}
