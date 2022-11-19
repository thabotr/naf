import {useState, ReactNode, createContext, useContext} from 'react';
import {User} from '../types/user';

export type LoggedInUserContextType = {
  user: User;
  loginAs: (u: User) => void;
};

const LoggedInUserContext = createContext<LoggedInUserContextType | null>(
  null,
);

type Props = {
  children: ReactNode;
};

const LoggedInUserProvider = ({children}: Props) => {
  const [user, setUser] = useState<User>({
    avatarURI: '',
    handle: '',
    initials: '',
    landscapeURI: '',
    listenWithMeURI: '',
    name: '',
    surname: '',
  });

  const loginAs = (u: User) => {
    setUser(u);
  };

  const providerValue = {
    user: user,
    loginAs: loginAs,
  };

  return (
    <LoggedInUserContext.Provider value={providerValue}>
      {children}
    </LoggedInUserContext.Provider>
  );
};

const useLoggedInUser = (): LoggedInUserContextType => {
  const context = useContext(LoggedInUserContext);
  if (!context)
    throw new Error('Encapsulate useLoggedInUser with LoggedInUserProvider');
  return context;
};

export {LoggedInUserProvider, useLoggedInUser};
