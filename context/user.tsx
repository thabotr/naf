import React from 'react';
import { User } from '../types/user';

export type UserContextType = {
  user?: User,
  loginAs: (u: User)=>void,
}

export const UserContext = React.createContext<UserContextType|null>(null);

export function UserContextProvider({children}:{children: React.ReactNode}){
  const [user, setUser] = React.useState<User>();

  const loginAs = (u: User) => {
    setUser(u);
  }
  return <UserContext.Provider value={{user: user, loginAs: loginAs}}>
    {children}
  </UserContext.Provider>
}