import React from 'react';
import { Chat } from '../types/chat';

import { Message } from './messageEditor';

export type MessagePK = {
  from: string,
  to: string,
  messageId: string
}

export enum ViewType {
  VISUALS,
  FILES
}

export type MessagesContextType = {
  chat?: Chat;
  openChat: (chat: Chat)=>void;
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
  const [chat, setChat] = React.useState<Chat|undefined>(undefined);

  const [messageInFocus, setMessageOnFocus] = React.useState<null|Message>(null);

  const openChat = (chat: Chat) => {
    setChat(chat);
  }

  const addMessages = (msgs: Message[])=>{
    const newMsgs = msgs.filter( m => !messages.find(em=> em.id === m.id && em.to === m.to && em.from === m.from));
    setMessages([
      ...messages,
      ...newMsgs
    ]);
  }

  const deleteMessages = (msgPKs: MessagePK[])=>{
    const residualImgs = messages.filter( m => !msgPKs.find(em=> em.messageId === m.id && em.to === m.to && em.from === m.from));
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
    chat: chat,
    openChat: openChat,
  }}>
    {children}
  </MessagesContext.Provider>
}