import React from 'react';
import { MessageThread } from '../types/message';
import { Chat } from '../types/chat';
import { Message } from './messageEditor';

export type ChatContextType = {
  chats: Chat[],
  saveChats: (cs: Chat[])=>void,
}

export const ChatContext = React.createContext<ChatContextType|null>(null);

export function ChatContextProvider({children}:{children: React.ReactNode}){
  const [chats, setChats] = React.useState<Chat[]>([]);
  const saveChats = (cs: Chat[])=> {
    setChats(cs);
  }

  return <ChatContext.Provider
    value={{
      chats: chats,
      saveChats: saveChats,
    }}
  >
    {children}
  </ChatContext.Provider>
}