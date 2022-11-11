import {launchCamera} from 'react-native-image-picker';

import {FileType} from './types/message';

export const openCamera = async (
  mode: 'video' | 'photo',
): Promise<FileType | undefined> => {
  const cameraRes = await launchCamera({
    mediaType: mode,
    quality: 1,
    maxHeight: 7680,
    maxWidth: 4320,
    videoQuality: 'high',
    durationLimit: 10 * 60,
    includeExtra: true,
  });

  if (cameraRes.didCancel) return;
  if (cameraRes.errorCode) throw new Error(cameraRes.errorMessage);

  const resultAsset: {
    id?: string;
    fileName?: string;
    bitrate?: number;
    duration?: number;
    fileSize?: number;
    height?: number;
    width?: number;
    timestamp?: string;
    type?: string;
    uri?: string;
  } = (cameraRes.assets ?? [])[0];

  return {
    name:
      resultAsset.fileName ??
      `${new Date().getTime()}.${resultAsset.type?.split('/')[1]}`,
    uri: resultAsset.uri ?? '',
    type: resultAsset.type ?? '',
    size: resultAsset.fileSize ?? 0,
  };
};
