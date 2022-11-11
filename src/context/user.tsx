import React from 'react';
import { User } from '../types/user';

export type LoggedInUserContextType = {
  user?: User,
  loginAs: (u: User)=>void,
}

const LoggedInUserContext = React.createContext<LoggedInUserContextType | null>(null);

type Props = {
  children: React.ReactNode,
}

const LoggedInUserProvider = ({children}: Props)=>{
  const [user, setUser] = React.useState<User>();

  const loginAs = (u: User) => {
    setUser(u);
  }

  const providerValue = {
    user: user, 
    loginAs: loginAs
  }

  return <LoggedInUserContext.Provider value={providerValue}>
    {children}
  </LoggedInUserContext.Provider>
}

const useLoggedInUser = (): LoggedInUserContextType => {
  const context = React.useContext(LoggedInUserContext);
  if(!context)
    throw new Error("Encapsulate useLoggedInUser with LoggedInUserProvider");
  return context;
}

export {LoggedInUserProvider, useLoggedInUser};