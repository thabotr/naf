import {createContext, ReactNode, useState, useContext} from 'react';

import {Message} from '../types/message';

const MessageComposerContext =
  createContext<MessageComposerContextType | null>(null);

type ComposeStateType = {inputTextEnabled: boolean};

type MessageComposerContextType = {
  composeMsg: Message | undefined;
  saveComposeMsg: (mutator: ((currentMsg: Message | undefined)=>Message|undefined))=>void;
  composeState: ComposeStateType;
  saveComposeState: (mutator: ((currentCS: ComposeStateType )=>ComposeStateType))=>void;
}

type Props = {
  children: ReactNode;
};

const MessageComposerProvider = ({children}: Props) => {
  const [composeMsg, setComposeMsg] = useState<Message|undefined>();
  const [composeState, setComposeState] = useState<ComposeStateType>({inputTextEnabled: true});

  const saveComposeMsg=(mutator:(msg: Message|undefined)=>Message|undefined)=>{
    setComposeMsg(msg=>mutator(msg));
  }

  const saveComposeState=(mutator:((currentCS: ComposeStateType )=>ComposeStateType))=>{
    setComposeState(cs=>mutator(cs));
  }

  const providerValue = {
    composeMsg: composeMsg,
    saveComposeMsg: saveComposeMsg,
    composeState: composeState,
    saveComposeState: saveComposeState,
  };
  return (
    <MessageComposerContext.Provider value={providerValue}>
      {children}
    </MessageComposerContext.Provider>
  );
};

const useMessageComposer = (): MessageComposerContextType => {
  const context = useContext(MessageComposerContext);
  if (!context)
    throw new Error(
      'Encapsulate useMessageComposer with MessageComposerProvider',
    );
  return context;
};

export {MessageComposerProvider, useMessageComposer};
