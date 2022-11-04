import React from 'react';

import {View, ImageProps, Image as RNImage} from 'react-native';
import { IconButton, ActivityIndicator } from 'react-native-paper';
import {ImageColorsResult, Config} from 'react-native-image-colors/lib/typescript/types';
import ImageColors from 'react-native-image-colors';
import RNFetchBlob from 'rn-fetch-blob';
import { OnlyShow, OverlayedView } from './helper';

export function Image(props: ImageProps & {
  alt?: React.ReactNode, 
  indicatorColor?: string, 
  indicatorSize?:number, 
  onImageColors?:(icr: ImageColorsResult)=>void, 
  imageColorsConfig?: Config
})
{
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
        return !props.alt ? <IconButton icon='alert-circle' size={props.indicatorSize ?? 35}/> : props.alt;
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

        if( !!props.onImageColors){
          const b64key = RNFetchBlob.base64.encode(`${e.nativeEvent.source.uri}:${JSON.stringify(props.imageColorsConfig)}`);
          const cachedColors = ImageColors.cache.getItem(b64key);
          if(!!cachedColors) {
            props.onImageColors(cachedColors);
          }else{
            ImageColors.getColors(e.nativeEvent.source.uri, props.imageColorsConfig)
            .then( icr => {
              ImageColors.cache.setItem(b64key, icr);
              props.onImageColors?.(icr);
            });
          }
        }

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