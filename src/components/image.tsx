import React from 'react';

import {View, ImageProps, Image as RNImage, Platform} from 'react-native';
import { IconButton, ActivityIndicator } from 'react-native-paper';
import {ImageColorsResult, Config} from 'react-native-image-colors/lib/typescript/types';
import ImageColors from 'react-native-image-colors';
import RNFetchBlob from 'rn-fetch-blob';
import { getFilePath } from '../file';
import { OverlayedView } from './Helpers/OverlayedView';
import { OnlyShow } from './Helpers/OnlyShow';

export enum IMState {
  FETCHING,
  LOADING,
  ERROR,
  SUCCESS,
}

export function Image(props: ImageProps & {
  url: string,
  headers?: {[key:string]: string},
  alt?: React.ReactNode, 
  indicatorColor?: string, 
  indicatorSize?:number, 
  onImageColors?:(icr: ImageColorsResult)=>void,
  imageColorsConfig?: Config
})
{
  const [state, setState] = React.useState<IMState>(IMState.FETCHING);
  const [uri, setURI] = React.useState('');
  const intermediateCompont = ()=>{
    switch(state){
      case IMState.FETCHING:
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

  React.useEffect(()=>{
    if( props.url.includes('http')){
      getFilePath(props.url, undefined, props.headers).then(path=> {
        (path && setURI(path)) || setState(IMState.ERROR);
      }).catch(e => {
        console.error('encountered image error', e);
        setState(IMState.ERROR);
      })
    }
    else setURI(props.url);
  },[])

  return <View style={[{justifyContent: 'center', alignContent: 'center'}, props.style]}>
    <OnlyShow If={!!uri}>
    <RNImage
      {...props}
      source={{uri: Platform.select({android: `file://${uri}`}) ?? uri}}
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
            })
            .catch( e => console.log('found error whilst setting contextual colors', e));
          }
        }

        props.onLoad?.(e);
      }}
      onLoadStart={()=>{
        setState(IMState.LOADING);
        props.onLoadStart?.();
      }}
    />
    </OnlyShow>
    <OnlyShow If={state !== IMState.SUCCESS}>
      <OverlayedView>
        {intermediateCompont()}
      </OverlayedView>
    </OnlyShow>
  </View>
}