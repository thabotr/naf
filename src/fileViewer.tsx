import FileViewer from 'react-native-file-viewer';
import {Toast} from 'toastify-react-native';

export const openFile = async (uri: string):Promise<void> => {
  await FileViewer.open(uri, { showOpenWithDialog: true})
    .catch((e)=>{
      if( `${e}`.includes('No app associated with this mime type'))
        Toast.warn('Oops! We found no apps to open this file type.');
      console.error(`when opening file ${uri} ` + e)
    });
}