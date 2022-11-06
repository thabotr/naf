import React from 'react';
import { User } from '../types/user';

export type UserContextType = {
  user?: User,
  loginAs: (u: User)=>void,
}

export const UserContext = React.createContext<UserContextType|null>(null);

// {
//   handle: '->oneDrigo',
//   name: 'Rodrigo',
//   surname: 'Carlos',
//   avatarURI: 'https://img.icons8.com/emoji/96/000000/man-health-worker.png',
//   landscapeURI: 'https://picsum.photos/777',
//   listenWithMeURI: 'https://up.fakazaweb.com/wp-content/uploads/2022/09/AKA_ft_Nasty_C_-_Lemons_Lemonade__Fakaza.Me.com.mp3',
//   initials: 'RC'
// }

export function UserContextProvider({children}:{children: React.ReactNode}){
  const [user, setUser] = React.useState<User>();

  const loginAs = (u: User) => {
    setUser(u);
  }
  return <UserContext.Provider value={{user: user, loginAs: loginAs}}>
    {children}
  </UserContext.Provider>
}