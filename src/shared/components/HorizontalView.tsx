import React from 'react';
import {View, ViewProps} from 'react-native';

export default function HorizontalView(props: ViewProps) {
  const style: Object = props.style?.valueOf() ?? {};
  const newProps: ViewProps = {
    ...props,
    style: {...style, display: 'flex', flexDirection: 'row'},
  };
  return <View {...newProps}>{props.children}</View>;
}
