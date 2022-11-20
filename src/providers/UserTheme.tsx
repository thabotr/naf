import {createContext, ReactNode, useContext, useState} from 'react';
import {Colors} from '../services/FileManager';
import {validateContext} from './validateContext';

export interface ColorPerUserField {
  avatar: Colors;
  landscape: Colors;
}

type HandleToColors = Map<string, ColorPerUserField>;

interface UserColorsContextType {
  colorsForUsers: HandleToColors;
  saveUserColors: (userHandle: string, userColors: ColorPerUserField) => void;
  getUserColors: (userHandle: string) => ColorPerUserField | undefined;
}

const UserThemeContext = createContext<UserColorsContextType | undefined>(
  undefined,
);

interface Props {
  children: ReactNode;
}

function UserThemeContextProvider({children}: Props) {
  const [colorsForUsers, setColorsForUsers] = useState<HandleToColors>(
    new Map(),
  );

  const saveUserColors = (
    userHandle: string,
    userColors: ColorPerUserField,
  ) => {
    setColorsForUsers(state => {
      return state.set(userHandle, userColors);
    });
  };

  const getUserColors = (userHandle: string): ColorPerUserField | undefined => {
    return colorsForUsers.get(userHandle);
  };

  const providerValue = {
    colorsForUsers: colorsForUsers,
    saveUserColors: saveUserColors,
    getUserColors: getUserColors,
  };

  return (
    <UserThemeContext.Provider value={providerValue}>
      {children}
    </UserThemeContext.Provider>
  );
}

function useColorsForUsers(): UserColorsContextType {
  const context = useContext(UserThemeContext);
  return validateContext(
    context,
    'useColorsForUsers',
    'UserThemeContextProvider',
  );
}

export {UserThemeContextProvider, useColorsForUsers};
