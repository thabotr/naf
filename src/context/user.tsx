import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState, ReactNode, createContext, useContext} from 'react';
import {validateContext} from '../providers/validateContext';
import {Profile} from '../types/user';

export type LoggedInUserContextType = {
  userProfile: Profile;
  logOut: () => void;
  saveProfile: (profile: Profile) => void;
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
  lastModified: -1,
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

  const saveProfile = (p: Profile) => {
    p.connections ??= {};
    p.waitingForThem ??= {};
    p.waitingForYou ??= {};
    setUserProfile(p);
  };

  const providerValue = {
    userProfile: userProfile,
    logOut: logOut,
    saveProfile: saveProfile,
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
