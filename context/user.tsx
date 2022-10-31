import React from 'react';

export type UserContextType = {
  userId: string,
}

export const UserContext = React.createContext<UserContextType|null>(null);

export function UserContextProvider({children}:{children: React.ReactNode}){
  const [userId, setUserId] = React.useState("user1");
  return <UserContext.Provider value={{userId: userId}}>
    {children}
  </UserContext.Provider>
}