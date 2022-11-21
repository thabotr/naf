import {useState, ReactNode, createContext, useContext} from 'react';
import { useAppState } from '../providers/AppStateProvider';
import {validateContext} from '../providers/validateContext';
import {Profile, User} from '../types/user';

export type LoggedInUserContextType = {
  user: User;
  userProfile: Profile;
  loginAs: (user: User) => void;
  logOut: () => void;
  useProfile: (profile: Profile) => void;
  updateProfile: (mutator: (profile: Profile) => Profile) => void;
};

const LoggedInUserContext = createContext<LoggedInUserContextType | undefined>(
  undefined,
);

type Props = {
  children: ReactNode;
};

const emptyUser = {
  avatarURI: '',
  handle: '',
  initials: '',
  landscapeURI: '',
  listenWithMeURI: '',
  name: '',
  surname: '',
};

const emptyProfile: Profile = {
  user: emptyUser,
  waitingForThem: [],
  waitingForYou: [],
};

const LoggedInUserProvider = ({children}: Props) => {
  const [user, setUser] = useState<User>(emptyUser);
  const [userProfile, setUserProfile] = useState<Profile>(emptyProfile);
  const {clearAppState} = useAppState();

  const loginAs = (u: User) => {
    setUser(u);
  };

  const logOut = () => {
    clearAppState();
    setUser(emptyUser);
  };

  const updateProfile = (mutator: (profile: Profile) => Profile) => {
    setUserProfile(p => mutator(p));
  };

  const useProfile = (p: Profile) => {
    setUserProfile(p);
  };

  const providerValue = {
    user: user,
    userProfile: userProfile,
    loginAs: loginAs,
    logOut: logOut,
    useProfile: useProfile,
    updateProfile: updateProfile,
  };

  return (
    <LoggedInUserContext.Provider value={providerValue}>
      {children}
    </LoggedInUserContext.Provider>
  );
};

const useLoggedInUser = (): LoggedInUserContextType => {
  const context = useContext(LoggedInUserContext);
  return validateContext(context, 'useLoggedInUser', 'LoggedInUserProvider');
};

export {LoggedInUserProvider, useLoggedInUser};
