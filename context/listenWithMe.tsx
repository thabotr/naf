import React from 'react';

export type ListenWithMeContextType = {
  listeningWith: string,
  saveListeningWith: (userHandle: string)=>void;
}

export const ListenWithMeContext = React.createContext<ListenWithMeContextType|null>(null);

export function ListenWithMeContextProvider({children}: {children: React.ReactNode}){
  const [listeningWith, setUser] = React.useState('');
  const saveListeningWith = (u: string)=> {
    setUser(u);
  }

  return <ListenWithMeContext.Provider value={{listeningWith: listeningWith, saveListeningWith: saveListeningWith}}>
    {children}
  </ListenWithMeContext.Provider>
}