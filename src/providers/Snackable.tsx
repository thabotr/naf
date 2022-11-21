import {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {validateContext} from './validateContext';

type MsgActionType = {
  message: string;
  actionName: string;
  action: () => void;
};

interface SnackableContextType {
  msgAction: MsgActionType | undefined;
  showMsgAction: (msgAction: MsgActionType | undefined) => void;
}

const SnackableContext = createContext<SnackableContextType | undefined>(
  undefined,
);

function SnackableContextProvider({children}: {children: ReactNode}) {
  const [msgAction, setMsgAction] = useState<MsgActionType | undefined>(
    undefined,
  );

  useEffect(() => {
    msgAction &&
      setTimeout(() => {
        setMsgAction(undefined);
      }, 3000);
  }, [msgAction]);

  const showMsgAction = (msgAction: MsgActionType|undefined) => {
    setMsgAction(msgAction);
  };

  const providerValue = {
    msgAction: msgAction,
    showMsgAction: showMsgAction,
  };

  return (
    <SnackableContext.Provider value={providerValue}>
      {children}
    </SnackableContext.Provider>
  );
}

const useSnackable = (): SnackableContextType => {
  const context = useContext(SnackableContext);
  return validateContext(context, 'useSnackable', 'SnackableContextProvider');
};

export {SnackableContextProvider, useSnackable};
