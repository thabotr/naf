import {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {useChats} from '../context/chat';
import {useLoggedInUser} from '../context/user';
import {Message} from '../types/message';
import {User} from '../types/user';
import {deduplicatedConcat} from '../utils/deduplicatedConcat';
import {validateContext} from './validateContext';

interface IncomingMessageType {
  intelocutor: User;
  message: Message;
}
interface NofierContextType {
  incomingMessages: IncomingMessageType[];
  noteIncomingMsg: (incomingMessage: IncomingMessageType) => void;
  acknowledgeIncomingMsg: (incomingMessage: IncomingMessageType) => void;
}

const NotifierContext = createContext<NofierContextType | undefined>(undefined);

function NotifierContextProvider({children}: {children: ReactNode}) {
  const [incomingMessages, setIncomingMessages] = useState<
    IncomingMessageType[]
  >([]);

  const [spinner, setSpinner] = useState(true);
  const {userProfile, updateProfile} = useLoggedInUser();
  const {lastModified, saveChats, chats} = useChats();

  // useEffect(() => {
  //   setTimeout(() => setSpinner(v => !v), 500);
  //   Remote.getProfile(
  //     userProfile.credentials.token,
  //     userProfile.credentials.handle,
  //     userProfile.lastModified,
  //   ).then(profile => {
  //     profile && updateProfile(_ => profile);
  //   });
  //   Remote.getChats(
  //     userProfile.credentials.token,
  //     userProfile.credentials.handle,
  //     lastModified,
  //   ).then(chats => chats && saveChats(chats));
  // }, []);

  useEffect(() => {
    const unreadMsgs = chats
      .flatMap(c =>
        c.messages.map(m => {
          return {intelocutor: c.user, message: m};
        }),
      )
      .filter(incMsg => incMsg.message.unread);
    unreadMsgs.forEach(m => noteIncomingMsg(m));
  }, [chats]);

  const noteIncomingMsg = (incMsg: IncomingMessageType) => {
    setIncomingMessages(msgs =>
      deduplicatedConcat(
        msgs,
        [incMsg],
        (m1, m2) =>
          m1.intelocutor.handle === m2.intelocutor.handle &&
          m1.message.id === m2.message.id,
      ),
    );
  };

  const acknowledgeIncomingMsg = (incMsg: IncomingMessageType) => {
    setIncomingMessages(msgs =>
      msgs.filter(
        msg =>
          !(
            msg.intelocutor.handle === incMsg.intelocutor.handle &&
            msg.message.id === incMsg.message.id
          ),
      ),
    );
  };

  const providerValue = {
    noteIncomingMsg: noteIncomingMsg,
    incomingMessages: incomingMessages,
    acknowledgeIncomingMsg: acknowledgeIncomingMsg,
  };

  return (
    <NotifierContext.Provider value={providerValue}>
      {children}
    </NotifierContext.Provider>
  );
}

function useNotifier(): NofierContextType {
  const context = useContext(NotifierContext);
  return validateContext(context, 'useNotifier', 'NotifierContextProvider');
}

export {useNotifier, NotifierContextProvider, type IncomingMessageType};
