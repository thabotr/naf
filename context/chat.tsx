import React from 'react';
import { MessageThread } from '../types/message';
import { Chat } from '../types/chat';
import { Message } from './messageEditor';
import { User } from '../types/user';

export type ChatContextType = {
  chats: Chat[],
  saveChats: (cs: Chat[])=>void,
  conversingWith?: User,
  converseWith: (user: User)=>void,
}

export const ChatContext = React.createContext<ChatContextType|null>(null);

export function ChatContextProvider({children}:{children: React.ReactNode}){
  const [chats, setChats] = React.useState<Chat[]>([]);
  const [conversingWith, setConversingWith] = React.useState<User|undefined>();
  const saveChats = (cs: Chat[])=> setChats(cs);

  const converseWith = (h: User) => setConversingWith(h);

  return <ChatContext.Provider
    value={{
      chats: chats,
      saveChats: saveChats,
      conversingWith: conversingWith,
      converseWith: converseWith,
    }}
  >
    {children}
  </ChatContext.Provider>
}