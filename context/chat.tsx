import React from 'react';
import {Chat} from '../types/chat';
import {Message, MessagePK} from '../types/message';
import {User} from '../types/user';

export type ChatContextType = {
  chats: Chat[];
  saveChats: (chats: Chat[]) => void;
  chattingWith?: User;
  chatWith: (user: User) => void;
  updateChatMessages: (messages: Message[]) => void;
  addChatMessages: (messages: Message[]) => void;
  deleteChatMessages: (idsOfMessages: MessagePK[]) => void;
  getActiveChat: () => Chat | undefined;
};

export const ChatContext = React.createContext<ChatContextType | null>(null);

export function ChatContextProvider({children}: {children: React.ReactNode}) {
  const [chats, setChats] = React.useState<Chat[]>([]);
  const [chattingWith, setchattingWith] = React.useState<User | undefined>();
  const saveChats = (cs: Chat[]) => setChats(cs);

  const chatWith = (h: User) => setchattingWith(h);

  const updateChatMessages = (messages: Message[]) => {
    const chatIndex = chats.findIndex(
      c => c.user.handle === chattingWith?.handle,
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
      setChats([
        ...chats.slice(0, chatIndex),
        {...activeChat, messages: updatedMessages},
        ...chats.slice(chatIndex + 1),
      ]);
    }
  };
  const addChatMessages = (messages: Message[]) => {
    const chatIndex = chats.findIndex(
      c => c.user.handle === chattingWith?.handle,
    );
    if (chatIndex >= 0) {
      const activeChat = chats[chatIndex];
      setChats([
        ...chats.slice(0, chatIndex),
        {...activeChat, messages: activeChat.messages.concat(messages)},
        ...chats.slice(chatIndex + 1),
      ]);
    }
  };
  const deleteChatMessages = (pksOfMessages: MessagePK[]) => {
    const chatIndex = chats.findIndex(
      c => c.user.handle === chattingWith?.handle,
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
      setChats([
        ...chats.slice(0, chatIndex),
        {...activeChat, messages: updatedMessages},
        ...chats.slice(chatIndex + 1),
      ]);
    }
  };
  const getActiveChat = () => {
    return chats.find(c => c.user.handle === chattingWith?.handle);
  };

  return (
    <ChatContext.Provider
      value={{
        chats: chats,
        saveChats: saveChats,
        chattingWith: chattingWith,
        chatWith: chatWith,
        updateChatMessages: updateChatMessages,
        addChatMessages: addChatMessages,
        deleteChatMessages: deleteChatMessages,
        getActiveChat: getActiveChat,
      }}>
      {children}
    </ChatContext.Provider>
  );
}
