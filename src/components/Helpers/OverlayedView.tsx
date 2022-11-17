import { View, ViewProps } from "react-native";

export function OverlayedView(props: ViewProps){
  const style: Object = props.style?.valueOf() ?? {};
  const newProps: ViewProps = {
    ...props,
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      ...style,
    }
  }; 
  return <View {...newProps}>
    {props.children}
  </View>
}