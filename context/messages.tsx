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
  deleteMessages: (msgPK: MessagePK)=>void;
  openMessage: (msg: null | Message)=> void;
}

export const MessagesContext = React.createContext<MessagesContextType|null>(null);

export function MessagesContextProvider({children}:{children: React.ReactNode}){
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [viewType, setViewType] = React.useState(ViewType.FILES);

  const [messageInFocus, setMessageOnFocus] = React.useState<null|Message>(null);

  const addMessages = (msgs: Message[])=>{
    // TODO filter already existing messages
    setMessages(msgs);
  }

  const deleteMessages = (msgPK: MessagePK)=>{
    setMessages(messages.filter(m=>!(msgPK.messageId === m.id && msgPK.senderId === m.senderId && msgPK.recipientId === m.recipientId)));
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