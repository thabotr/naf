import React from 'react';
import {StyleSheet} from 'react-native';
import {TextInput} from 'react-native-paper';

const CustomTextInput = (props: {
  disabled: boolean;
  error?: string;
  defaultValue: string;
  setText: (token: string) => void;
  label: string;
  secureTextEntry?: boolean;
}) => {
  return (
    <TextInput
      label={props.label}
      secureTextEntry={props.secureTextEntry}
      onChangeText={text => props.setText(text)}
      disabled={props.disabled}
      error={!!props.error}
      defaultValue={props.defaultValue}
      mode="outlined"
      style={styles.textInput}
      accessibilityLabel={props.label}
    />
  );
};

const MemoedTextInput = React.memo(CustomTextInput);

const styles = StyleSheet.create({
  textInput: {marginHorizontal: 20},
});

export default MemoedTextInput;
