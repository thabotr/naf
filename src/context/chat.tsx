import React, {useContext, createContext, useState, useEffect} from 'react';
import {validateContext} from '../providers/validateContext';
import {Chat} from '../types/chat';
import {Message, MessagePK} from '../types/message';

export type ChatsContextType = {
  lastModified?: number;
  chats: Chat[];
  saveChats: (chats: Chat[]) => void;
  activeChat: () => Chat;
  saveActiveChat: (chat: Chat) => void;
  addChatMessages: (messages: Message[]) => void;
  deleteChatMessages: (idsOfMessages: MessagePK[]) => void;
  updateChats: (mutator: (chats: Chat[]) => Chat[]) => void;
};

type Props = {
  children: React.ReactNode;
};

const ChatsContext = createContext<ChatsContextType | undefined>(undefined);

const ChatsProvider = ({children}: Props) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatHandle, setActiveChatHandle] = useState<
    string | undefined
  >();
  const [lastModified, setLastModified] = useState<number | undefined>(
    undefined,
  );

  useEffect(() => {
    setLastModified(
      chats
        .map(c => c.lastModified)
        .sort()
        .reverse()
        .find(_ => true),
    );
  }, [chats]);

  const activeChat = (): Chat => {
    const chat = chats.find(c => c.user.handle === activeChatHandle);
    if (!chat) {
      throw new Error('no active chat');
    }
    return chat;
  };
  const saveChats = (cs: Chat[]): void => {
    setChats(cs);
  };
  const saveActiveChat = (chat?: Chat): void => {
    setActiveChatHandle(chat?.user.handle);
  };
  const addChatMessages = (messages: Message[]): void => {
    setChats(nchats => {
      const chatIndex = nchats.findIndex(
        c => c.user.handle === activeChat()?.user.handle,
      );
      if (chatIndex >= 0) {
        const currChat = nchats[chatIndex];
        return [
          ...nchats.slice(0, chatIndex),
          {...currChat, messages: currChat.messages.concat(messages)},
          ...nchats.slice(chatIndex + 1),
        ];
      }
      return chats;
    });
  };
  const deleteChatMessages = (pksOfMessages: MessagePK[]): void => {
    setChats(nchats => {
      const chatIndex = nchats.findIndex(
        c => c.user.handle === activeChat()?.user.handle,
      );
      if (chatIndex >= 0) {
        const currChat = chats[chatIndex];
        const updatedMessages = currChat.messages.filter(
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
          ...nchats.slice(0, chatIndex),
          {...currChat, messages: updatedMessages},
          ...nchats.slice(chatIndex + 1),
        ];
      }
      return nchats;
    });
  };

  const updateChats = (mutator: (cs: Chat[]) => Chat[]) => {
    setChats(newchats => mutator(newchats));
  };

  const providerValue = {
    chats: chats,
    saveChats: saveChats,
    activeChat: activeChat,
    saveActiveChat: saveActiveChat,
    addChatMessages: addChatMessages,
    deleteChatMessages: deleteChatMessages,
    updateChats: updateChats,
    lastModified: lastModified,
  };

  return (
    <ChatsContext.Provider value={providerValue}>
      {children}
    </ChatsContext.Provider>
  );
};

const useChats = (): ChatsContextType => {
  const context = useContext(ChatsContext);
  return validateContext(context, 'useChats', 'ChatsProvider');
};

export {ChatsProvider, useChats};
