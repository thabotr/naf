import React from 'react';

import {View, ViewProps} from 'react-native';
import { Paragraph, IconButton } from 'react-native-paper';

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
      ...style,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center'
    }
  }; 
  return <View {...newProps}>
    {props.children}
  </View>
}

export const numberRemainingOverlay = (numberRemaining: number)=> <OnlyShow If={numberRemaining > 0}>
        <OverlayedView>
          <Paragraph style={{
                      textAlign: 'center',
                      fontSize: 17,
                      fontWeight: 'bold',
                      transform: [{rotate: '90deg'}],
                      width: '100%'
                  }}
          >+{numberRemaining} more</Paragraph>
        </OverlayedView>
    </OnlyShow>

export const vidIconOverlay= (iconSize: number, blur?:boolean) => <OverlayedView>
      <IconButton size={iconSize} icon="play-circle-outline"  style={{opacity: blur ? 0.4 : 1}}/>
    </OverlayedView>

export function HorizontalView(props: ViewProps) {
  const style: Object = props.style?.valueOf() ?? {};
  const newProps: ViewProps = {...props, style: {...style, display: 'flex', flexDirection: 'row'}};
  return <View {...newProps}>
    {props.children}
  </View>
}