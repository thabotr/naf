import {ToastAndroid} from 'react-native';
import FileViewer from 'react-native-file-viewer';

export const openFile = async (uri: string):Promise<void> => {
  await FileViewer.open(uri, { showOpenWithDialog: true})
    .catch((e)=>{
      if( `${e}`.includes('No app associated with this mime type'))
        ToastAndroid.show('Oops! We found no apps to open this file type.', 4_000);
      console.error(`when opening file ${uri} ` + e)
    });
}