import React from 'react';
import { MessageEditorContextType } from '../types/MessageEditor';
export const MessageEditorContext = React.createContext<MessageEditorContextType|null>(null);

export type Message = {
  userId: string,
  id: string,
  text?: string,
  files: MessageFile[],
}

export type MessageFile = {
    name?: string,
    type: string,
    uri: string,
    size?: number,
    duration?: number,
}

export function MessageEditorProvider({children}:{children:React.ReactNode}){
  const [message, setMessage] = React.useState<Message>({userId: '', id: '', files:[]});
  const [composing, setComposing] = React.useState(false);

  const saveMessage = (m: Message)=> {
    setMessage(m);
  }

  const setComposeOn = (b: boolean)=> {
    setComposing(b);
  }

  return <MessageEditorContext.Provider value={{ message: message, setComposeOn: setComposeOn, composing: composing, saveMessage: saveMessage}}>
    {children}
  </MessageEditorContext.Provider>
}