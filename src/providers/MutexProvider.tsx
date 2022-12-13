import React, {createContext, ReactNode, useContext, useState} from 'react';
import {validateContext} from '../shared/utils/validateContext';

interface MutexContextType {
  slots: number;
  saveSlots: (num: number) => void;
}

const MutexContext = createContext<MutexContextType | undefined>(undefined);

const MutexContextProvider = ({children}: {children: ReactNode}) => {
  const [slots, setSlots] = useState(1);

  const saveSlots = (num: number) => {
    setSlots(num);
  };

  return (
    <MutexContext.Provider
      value={{
        slots: slots,
        saveSlots: saveSlots,
      }}>
      {children}
    </MutexContext.Provider>
  );
};

const useMutex = (): MutexContextType => {
  const context = useContext(MutexContext);
  return validateContext(context, 'useMutex', 'MutexContextProvider');
};

export {useMutex, MutexContextProvider};
