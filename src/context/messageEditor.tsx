import React, {createContext, ReactNode, useState, useContext} from 'react';
import {validateContext} from '../shared/utils/validateContext';
import {FileManager} from '../services/FileManager';

import {Message} from '../types/message';
import {deduplicatedConcat} from '../utils/deduplicatedConcat';

const MessageComposerContext = createContext<
  MessageComposerContextType | undefined
>(undefined);

type ComposeStateType = {inputTextEnabled: boolean};

type MessageComposerContextType = {
  composeMsg: Message | undefined;
  saveComposeMsg: (
    mutator: (currentMsg: Message | undefined) => Message | undefined,
  ) => void;
  composeState: ComposeStateType;
  saveComposeState: (
    mutator: (currentCS: ComposeStateType) => ComposeStateType,
  ) => void;
  addAttachments: () => void;
  recordVisual: (mode: 'video' | 'photo') => void;
};

type Props = {
  children: ReactNode;
};

const MessageComposerProvider = ({children}: Props) => {
  const [composeMsg, setComposeMsg] = useState<Message | undefined>();
  const [composeState, setComposeState] = useState<ComposeStateType>({
    inputTextEnabled: true,
  });

  const saveComposeMsg = (
    mutator: (msg: Message | undefined) => Message | undefined,
  ) => {
    setComposeMsg(msg => mutator(msg));
  };

  const saveComposeState = (
    mutator: (currentCS: ComposeStateType) => ComposeStateType,
  ) => {
    setComposeState(cs => mutator(cs));
  };

  const addAttachments = () => {
    FileManager.pickFiles().then(files => {
      if (!files) {
        return;
      }
      saveComposeMsg(msg => {
        if (msg) {
          return {
            ...msg,
            files: deduplicatedConcat(
              msg.files,
              files,
              (f1, f2) =>
                f1.name === f2.name &&
                f1.size === f2.size &&
                f1.type === f2.type,
            ),
          };
        } else {
          return {
            to: '',
            id: 0,
            files: files,
            voiceRecordings: [],
            from: '',
          };
        }
      });
    });
  };

  const recordVisual = (mode: 'video' | 'photo') => {
    FileManager.getCameraMedia(mode).then(pic => {
      pic &&
        saveComposeMsg(msg => {
          if (msg) {
            return {
              ...msg,
              files: msg.files.concat(pic),
            };
          } else {
            return {
              from: '',
              to: '',
              id: 0,
              files: [pic],
              voiceRecordings: [],
            };
          }
        });
    });
  };

  const providerValue = {
    composeMsg: composeMsg,
    saveComposeMsg: saveComposeMsg,
    composeState: composeState,
    saveComposeState: saveComposeState,
    addAttachments: addAttachments,
    recordVisual: recordVisual,
  };
  return (
    <MessageComposerContext.Provider value={providerValue}>
      {children}
    </MessageComposerContext.Provider>
  );
};

const useMessageComposer = (): MessageComposerContextType => {
  const context = useContext(MessageComposerContext);
  return validateContext(
    context,
    'useMessageComposer',
    'MessageComposerProvider',
  );
};

export {MessageComposerProvider, useMessageComposer};
