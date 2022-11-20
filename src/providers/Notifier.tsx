import {createContext, ReactNode, useContext, useState} from 'react';
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
