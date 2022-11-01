import React from 'react';

import { Message } from './messageEditor';

export type MessagePK = {
  senderId: string,
  recipientId: string,
  messageId: string
}

export enum ViewType {
  VISUALS,
  FILES
}

export type MessagesContextType = {
  viewType: ViewType;
  saveViewType: (vt: ViewType)=>void;
  messageInFocus: null | Message;
  messages: Message[];
  addMessages: (msgs: Message[])=> void;
  deleteMessages: (msgPKs: MessagePK[])=>void;
  openMessage: (msg: null | Message)=> void;
}

export const MessagesContext = React.createContext<MessagesContextType|null>(null);

export function MessagesContextProvider({children}:{children: React.ReactNode}){
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [viewType, setViewType] = React.useState(ViewType.FILES);

  const [messageInFocus, setMessageOnFocus] = React.useState<null|Message>(null);

  const addMessages = (msgs: Message[])=>{
    const newMsgs = msgs.filter( m => !messages.find(em=> em.id === m.id && em.recipientId === m.recipientId && em.senderId === m.senderId));
    setMessages([
      ...messages,
      ...newMsgs
    ]);
  }

  const deleteMessages = (msgPKs: MessagePK[])=>{
    const residualImgs = messages.filter( m => !msgPKs.find(em=> em.messageId === m.id && em.recipientId === m.recipientId && em.senderId === m.senderId));
    setMessages(residualImgs);
  }

  const openMessage = (msg: Message | null)=> {
    setMessageOnFocus(msg);
  }

  const saveViewType = (vt: ViewType)=> setViewType(vt);

  return <MessagesContext.Provider value={{
    viewType: viewType,
    saveViewType: saveViewType,
    messageInFocus: messageInFocus,
    messages: messages,
    addMessages: addMessages,
    deleteMessages: deleteMessages,
    openMessage: openMessage,
  }}>
    {children}
  </MessagesContext.Provider>
}