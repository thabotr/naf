import {useState, ReactNode, createContext, useContext} from 'react';
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
  waitingForThem: [
    {
      createdAt: new Date().getTime() / 1000 + 3600,
      expiresAt: new Date().getTime() / 1000 + 3600 * 13,
      handleForAwaited: '->mickeyDons',
      locationAliasA: 'spain',
      locationAliasB: 'uruguay',
      locationAliasC: 'brazil',
    },
  ],
  waitingForYou: [
    {
      at: {
        locationAliasA: 'spain',
        locationAliasB: 'uruguay',
        locationAliasC: 'brazil',
        createdAt: new Date().getTime() / 1000 - 3600,
        expiresAt: new Date().getTime() / 1000 + 3600 * 13,
      },
      waiters: [],
    },
    {
      at: {
        locationAliasA: 'italy',
        locationAliasB: 'morocco',
        locationAliasC: 'sudan',
        createdAt: new Date().getTime() / 1000 - 36000,
        expiresAt: new Date().getTime() / 1000,
      },
      waiters: [
        {
          arrivedAt: new Date().getTime() / 1000,
          user: {
            name: 'spenser',
            avatarURI: 'https://picsum.photos/317',
            handle: '->susPens',
            initials: 'SD',
            surname: 'D',
            landscapeURI: 'https://picsum.photos/2172',
            listenWithMeURI:
              'https://up.fakazaweb.com/wp-content/uploads/2022/09/AKA_ft_Nasty_C_-_Lemons_Lemonade__Fakaza.Me.com.mp3',
          },
        },
        {
          arrivedAt: new Date().getTime() / 1000,
          user: {
            name: 'don',
            avatarURI: 'https://picsum.photos/117',
            handle: '->vinny',
            initials: 'SD',
            surname: 'torretor',
            landscapeURI: 'https://picsum.photos/1172',
            listenWithMeURI:
              'https://up.fakazaweb.com/wp-content/uploads/2022/09/AKA_ft_Nasty_C_-_Lemons_Lemonade__Fakaza.Me.com.mp3',
          },
        },
      ],
    },
  ],
};

const LoggedInUserProvider = ({children}: Props) => {
  const [user, setUser] = useState<User>(emptyUser);
  const [userProfile, setUserProfile] = useState<Profile>(emptyProfile);

  const loginAs = (u: User) => {
    setUser(u);
  };

  const logOut = () => {
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
