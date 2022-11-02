import React from 'react';

import {View, ViewProps, ImageProps, Image as RNImage} from 'react-native';
import { Paragraph, IconButton, ActivityIndicator } from 'react-native-paper';

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

export function Image(props: ImageProps & {alt?: React.ReactNode, indicatorColor?: string, indicatorSize?:number}){
  enum IMState {
    LOADING,
    ERROR,
    SUCCESS,
  }
  const [state, setState] = React.useState<IMState>(IMState.LOADING);
  const intermediateCompont = ()=>{
    switch(state){
      case IMState.LOADING:
        return <>
          <IconButton icon='image' size={props.indicatorSize ?? 35}/>
          <OverlayedView>
            <ActivityIndicator color={props.indicatorColor?? 'gray' } size={(props.indicatorSize ?? 35)+3} animating/>
          </OverlayedView>
        </>
      case IMState.ERROR:
        return <IconButton icon='alert-circle' size={props.indicatorSize ?? 35}/>
      case IMState.SUCCESS:
        return null;
  }
  }
  return <View style={[{justifyContent: 'center', alignContent: 'center'}, props.style]}>
    <RNImage
      {...props}
      onError={(e)=>{
        setState(IMState.ERROR);
        props.onError?.(e);
      }}
      onLoad={(e)=>{
        setState(IMState.SUCCESS);
        props.onLoad?.(e);
      }}
      onLoadStart={()=>{
        setState(IMState.LOADING);
        props.onLoadStart?.();
      }}
    />
    <OnlyShow If={state !== IMState.SUCCESS}>
      <OverlayedView>
        {intermediateCompont()}
      </OverlayedView>
    </OnlyShow>
  </View>
}