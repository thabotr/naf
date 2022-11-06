import React from 'react';

import {View, ImageProps, Image as RNImage, Platform} from 'react-native';
import { IconButton, ActivityIndicator } from 'react-native-paper';
import {ImageColorsResult, Config} from 'react-native-image-colors/lib/typescript/types';
import ImageColors from 'react-native-image-colors';
import RNFetchBlob from 'rn-fetch-blob';
import { OnlyShow, OverlayedView } from './helper';

export const getImagePath = async (url: string, headers?:{[key:string]:string}):Promise<string|null> => {
  if(!url.includes('http')) return url; // TODO find better ways to determine if file is remote
  const b64URL = RNFetchBlob.base64.encode(url);
  const path = `${RNFetchBlob.fs.dirs.CacheDir}/images/${b64URL}`;
  try{
    const cached = await RNFetchBlob.fs.exists(path);
    if(cached)
      return path;
  } catch( e ) {
    console.error( 'file check failed ' + e);
  }

  return RNFetchBlob.config({fileCache: true,})
    .fetch('GET', url, headers)
    .then( r => {
      if(r.info().status === 200){
        const tempFilePath = r.data;
        return RNFetchBlob.fs.mv(tempFilePath, path)
        .then( b => {
          if(b) return path;
          return null;
        })
      }else if( r.info().status === 404){
        return null;
      }
      // TODO process other response codes like 304 accordingly
      console.log("TODO handle=>Image got response" + JSON.stringify(r));
      return null;
    })
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
  enum IMState {
    FETCHING,
    LOADING,
    ERROR,
    SUCCESS,
  }
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
    getImagePath(props.url, props.headers).then(p=> {
      if( !!p)
        setURI(p);
      else
        setState(IMState.ERROR);
    }).catch(e => {
      console.error('encountered image error ' + e);
      setState(IMState.ERROR);
    })
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
    </OnlyShow>
    <OnlyShow If={state !== IMState.SUCCESS}>
      <OverlayedView>
        {intermediateCompont()}
      </OverlayedView>
    </OnlyShow>
  </View>
}