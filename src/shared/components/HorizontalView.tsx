import React from 'react';
import {StyleSheet, View, ViewProps} from 'react-native';

export default function HorizontalView(props: ViewProps): JSX.Element {
  const styles = StyleSheet.create({
    view: {display: 'flex', flexDirection: 'row'},
  });
  return (
    <View {...props} style={[props.style, styles.view]}>
      {props.children}
    </View>
  );
}
