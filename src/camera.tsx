import {launchCamera} from 'react-native-image-picker';

import { MessageFile } from '../types/message';

export const openCamera = async (mode: 'video' | 'photo'): Promise<MessageFile>=> {
  return new Promise((resolve, reject)=>{
    launchCamera({
      mediaType: mode,
      quality: 1,
      maxHeight: 7680,
      maxWidth: 4320,
      videoQuality: 'high',
      durationLimit: 10*60,
      includeExtra: true,
    }).then( result => {
      if( result.didCancel){
        reject('cancelled');
        return;
      }
      if( result.errorCode){
        reject(result.errorCode);
        return;
      }
      const resultAsset:{
        id?: string,
        fileName?: string,
        bitrate?: number,
        duration?: number,
        fileSize?: number,
        height?: number,
        width?: number,
        timestamp?: string,
        type?: string,
        uri?: string,
      } = (result.assets ?? [])[0]
      resolve({
        name: `${resultAsset.timestamp}.${resultAsset.type?.split('/')[1]}`,
        uri: resultAsset.uri ?? '',
        type: resultAsset.type ?? '',
        duration: resultAsset.duration,
        size: resultAsset.fileSize,
      });
    })
  })
}