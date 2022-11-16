import React from 'react';

import {View, ViewProps} from 'react-native';
import { IconButton } from 'react-native-paper';

export function OnlyShow({If, children}:{If?:boolean, children: React.ReactNode}) {
  return If ? <>{children}</> : null;
}

export function Show({component, If, ElseShow}:{component:React.ReactNode, If: boolean, ElseShow:React.ReactNode}): JSX.Element{
  return <>{If ? component : ElseShow}</>;
}

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

export function Lay({component, over}:{component:React.ReactNode, over:React.ReactNode}){
  return <>
    {over}
    {<OverlayedView>{component}</OverlayedView>}
  </>
}

export const vidIconOverlay= (iconSize: number, blur?:boolean) => <OverlayedView>
      <IconButton size={iconSize} icon="play-circle-outline"  style={{opacity: blur ? 0.4 : 1}}/>
    </OverlayedView>