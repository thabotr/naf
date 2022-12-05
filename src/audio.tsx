import {Track} from 'react-native-track-player';
import RNFetchBlob from 'rn-fetch-blob';

export const getAudioMetadata = async (
  url: string,
  headers?: {[key: string]: string},
): Promise<Track | undefined> => {
  try {
    const resp = await RNFetchBlob.fetch('GET', url, headers);
    if (resp.info().status === 200) {
      const track: Track = resp.json();
      return track;
    } else {
      console.log(
        'status',
        resp.info().status,
        'returned when fetching resource',
        url,
      );
    }
  } catch (e) {
    console.error('getting audio path with URL [', url, '] ', e);
  }
};
