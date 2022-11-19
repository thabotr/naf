import {useState, createContext, useEffect, useContext, ReactNode} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {User} from '../types/user';
import {Chat} from '../types/chat';
import {ThemeSetting} from '../types/settings';

type Props = {
  children: ReactNode;
};

export type SettingsType = {
  theme: ThemeSetting;
};

enum AppStateConstants {
  SETTINGS = 'settings',
  USER = 'loggedInUser',
  CHATS = 'chats',
}

export type AppStateContextType = {
  loggedInUser?: User;
  settings: SettingsType;
  chats: Chat[];
  saveAppLoggedInUser: (user: User) => void;
  saveAppSettings: (settings: SettingsType) => void;
  saveAppChats: (chats: Chat[]) => void;
};
const logError = (ac: AppStateConstants, e: any) =>
  console.log('failed to save', ac, e);

const AppStateContext = createContext<AppStateContextType | null>(null);

const AppStateProvider = ({children}: Props) => {
  const [loggedInUser, setLoggedInUser] = useState<User | undefined>();
  const [settings, setSettings] = useState<SettingsType>({
    theme: 'system_default',
  });
  const [chats, setChats] = useState<Chat[]>([]);

  const saveAppLoggedInUser = (u: User) => {
    const ascUser = AppStateConstants.USER;
    AsyncStorage.setItem(ascUser, JSON.stringify(u)).catch(e =>
      logError(ascUser, e),
    );
  };

  const saveAppSettings = (s: SettingsType) => {
    const ascSettings = AppStateConstants.SETTINGS;
    AsyncStorage.setItem(ascSettings, JSON.stringify(s)).catch(e =>
      logError(ascSettings, e),
    );
  };

  const saveAppChats = (cs: Chat[]) => {
    const ascChats = AppStateConstants.CHATS;
    AsyncStorage.setItem(ascChats, JSON.stringify(cs)).catch(e =>
      logError(ascChats, e),
    );
  };

  useEffect(() => {
    AsyncStorage.multiGet(['loggedInUser', 'settings', 'chats'])
      .then(res => {
        res.forEach(keyValuePair => {
          switch (keyValuePair[0]) {
            case AppStateConstants.USER:
              keyValuePair[1] && setLoggedInUser(JSON.parse(keyValuePair[1]));
              break;
            case AppStateConstants.SETTINGS:
              keyValuePair[1] && setSettings(JSON.parse(keyValuePair[1]));
              break;
            case AppStateConstants.CHATS:
              keyValuePair[1] && setChats(JSON.parse(keyValuePair[1]));
              break;
            default:
          }
        });
      })
      .catch(e =>
        console.log('something went wrong whilst getting app data', e),
      );
  }, []);

  const providerValue = {
    loggedInUser: loggedInUser,
    chats: chats,
    settings: settings,
    saveAppChats: saveAppChats,
    saveAppLoggedInUser: saveAppLoggedInUser,
    saveAppSettings: saveAppSettings,
  };

  return (
    <AppStateContext.Provider value={providerValue}>
      {children}
    </AppStateContext.Provider>
  );
};

const useAppState = (): AppStateContextType => {
  const context = useContext(AppStateContext);
  if (!context)
    throw new Error('Encapsulate useAppState with AppStateProvider');
  return context;
};

export {AppStateProvider, useAppState};
