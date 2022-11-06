import React from 'react';
import { Chat } from '../types/chat';
import { ChatContext, ChatContextType } from './chat';

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
  messages: Message[];
  addMessages: (msgs: Message[])=> void;
  deleteMessages: (msgPKs: MessagePK[])=>void;
}

export const MessagesContext = React.createContext<MessagesContextType|null>(null);

export function MessagesContextProvider({children}:{children: React.ReactNode}){
  const {chats, conversingWith} = React.useContext(ChatContext) as ChatContextType;
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [chat, setChat] = React.useState<Chat|undefined>();

  React.useEffect(()=>{
    const chat = chats.find(c=> c.user.handle === conversingWith?.handle)
    setChat(chat);
    chat?.messages && setMessages(chat?.messages);
  },[conversingWith, chats])

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

  return <MessagesContext.Provider value={{
    messages: messages,
    addMessages: addMessages,
    deleteMessages: deleteMessages,
    chat: chat,
  }}>
    {children}
  </MessagesContext.Provider>
}