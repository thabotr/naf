import AsyncStorage from '@react-native-async-storage/async-storage';
import {useState, ReactNode, createContext, useContext} from 'react';
import {validateContext} from '../providers/validateContext';
import {Profile} from '../types/user';

export type LoggedInUserContextType = {
  userProfile: Profile;
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
  ...emptyUser,
  waitingForThem: {},
  waitingForYou: {},
  lastmodified: 0,
  token: '',
  connections: {},
};

const LoggedInUserProvider = ({children}: Props) => {
  const [userProfile, setUserProfile] = useState<Profile>(emptyProfile);

  const logOut = () => {
    AsyncStorage.multiRemove(['profile', 'settings']);
    setUserProfile(emptyProfile);
  };

  const updateProfile = (mutator: (profile: Profile) => Profile) => {
    setUserProfile(p => mutator(p));
  };

  const useProfile = (p: Profile) => {
    setUserProfile(p);
  };

  const providerValue = {
    userProfile: userProfile,
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
