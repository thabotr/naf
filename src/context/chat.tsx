import React from 'react';
import {Chat} from '../types/chat';
import {Message, MessagePK} from '../types/message';

export type ChatsContextType = {
  chats: Chat[];
  saveChats: (chats: Chat[]) => void;
  activeChat: ()=>Chat | undefined;
  saveActiveChat: (chat: Chat) => void;
  updateChatMessages: (messages: Message[]) => void;
  addChatMessages: (messages: Message[]) => void;
  deleteChatMessages: (idsOfMessages: MessagePK[]) => void;
};

type Props = {
  children: React.ReactNode;
}

const ChatsContext = React.createContext<ChatsContextType | null>(null);

const ChatsProvider = ({children}: Props) => {
  const [chats, setChats] = React.useState<Chat[]>([]);
  const [activeChatHandle, setActiveChatHandle] = React.useState<string | undefined>();

  const activeChat = (): Chat | undefined => {
    return chats.find(c => c.user.handle === activeChatHandle);
  }
  const saveChats = (cs: Chat[]): void => {
    setChats(cs);
  }
  const saveActiveChat = (chat?: Chat): void => {
    setActiveChatHandle(chat?.user.handle);
  }
  const updateChatMessages = (messages: Message[]): void => {
    setChats( chats => {
      const chatIndex = chats.findIndex(
        c => c.user.handle === activeChat()?.user.handle
      );
      if (chatIndex >= 0) {
        const activeChat = chats[chatIndex];
        const updatedMessages = activeChat.messages.map(m => {
          const updatedM = messages.find(
            mToUpdate =>
              m.id === mToUpdate.id &&
              m.from === mToUpdate.from &&
              m.to === mToUpdate.to,
          );
          if (updatedM) return updatedM;
          else return m;
        });
        return [
          ...chats.slice(0, chatIndex),
          {...activeChat, messages: updatedMessages},
          ...chats.slice(chatIndex + 1),
        ];
      }
      return chats;
    });
  };
  const addChatMessages = (messages: Message[]): void => {
    setChats(chats => {
      const chatIndex = chats.findIndex(
        c => c.user.handle === activeChat()?.user.handle
      );
      if (chatIndex >= 0) {
        const activeChat = chats[chatIndex];
        return [
          ...chats.slice(0, chatIndex),
          {...activeChat, messages: activeChat.messages.concat(messages)},
          ...chats.slice(chatIndex + 1),
        ];
      }
      return chats;
    });
  };
  const deleteChatMessages = (pksOfMessages: MessagePK[]): void => {
    setChats(chats => {
      const chatIndex = chats.findIndex(
        c => c.user.handle === activeChat()?.user.handle
      );
      if (chatIndex >= 0) {
        const activeChat = chats[chatIndex];
        const updatedMessages = activeChat.messages.filter(
          m =>
            !pksOfMessages.find(pkOfM => {
              const mPK: MessagePK = {
                fromHandle: m.from,
                id: m.id,
                toHandle: m.to,
              };
              return (
                pkOfM.id === mPK.id &&
                pkOfM.fromHandle === mPK.fromHandle &&
                pkOfM.toHandle === mPK.toHandle
              );
            }),
        );
        return [
          ...chats.slice(0, chatIndex),
          {...activeChat, messages: updatedMessages},
          ...chats.slice(chatIndex + 1),
        ]
      }
      return chats;
    });
  };

  const providerValue = {
    chats: chats,
    saveChats: saveChats,
    activeChat: activeChat,
    saveActiveChat: saveActiveChat,
    updateChatMessages: updateChatMessages,
    addChatMessages: addChatMessages,
    deleteChatMessages: deleteChatMessages,
  }

  return (
    <ChatsContext.Provider value={providerValue}>
      {children}
    </ChatsContext.Provider>
  );
}

const useChats = (): ChatsContextType => {
  const context = React.useContext(ChatsContext);
  if(!context){
    throw Error('Use useChats in ChatsProvider');
  }
  return context;
}

export {ChatsProvider, useChats};