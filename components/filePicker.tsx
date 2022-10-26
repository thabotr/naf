import React from 'react';
import DocumentPicker, {
  DocumentPickerResponse,
  isInProgress
} from 'react-native-document-picker';
import { IconButton } from 'react-native-paper';

import { Message, MessageEditorContext } from '../context/messageEditor';
import { MessageEditorContextType } from '../types/MessageEditor';
import { MessageFile } from '../context/messageEditor';

export function FilePicker() {
  const {saveMessage, message} = React.useContext(MessageEditorContext) as MessageEditorContextType;
  const handleError = (err: unknown) => {
    if (DocumentPicker.isCancel(err)) {
      console.warn('cancelled')
      // User cancelled the picker, exit any dialogs or menus and move on
    } else if (isInProgress(err)) {
      console.warn('multiple pickers were opened, only the last will be considered')
    } else {
      throw err
    }
  }

  return (
    <IconButton icon="attachment" onPress={()=>{
      DocumentPicker.pick({allowMultiSelection: true}).then(
        ( dprs: Array<DocumentPickerResponse> | null | undefined) => {
          if( dprs){
            const selectedFiles = dprs.map(
              ( dpr: DocumentPickerResponse): MessageFile => {
                return {
                  name: dpr.name ?? undefined,
                  size: dpr.size ?? undefined,
                  type: dpr.type ?? '',
                  uri: dpr.uri,
                }
              }
            )
            const mFilesNotInSelection = message.files.filter(mf => !selectedFiles.find( sf => sf.uri === mf.uri))
            console.warn('TODO generate video thumbnail');
            const updatedMessage: Message = {
              ...message,
              files: mFilesNotInSelection.concat(selectedFiles)
            }
            saveMessage(updatedMessage);
          }
    }).catch(handleError);
    }}/>
  )
}