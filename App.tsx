/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import {useEffect} from 'react';
import {Provider} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';

import {ThemeProvider} from './src/context/theme';
import {LoggedInUserProvider} from './src/context/user';
import {StackNavigator} from './src/components/StackNavigator';
import {ChatsProvider} from './src/context/chat';
import {AppStateProvider} from './src/providers/AppStateProvider';
import {
  AudioRecorderPlayerProvider,
  useAudioRecorderPlayer,
} from './src/providers/AudioRecorderPlayer';
import {FileManager} from './src/services/FileManager';
import { UserThemeContextProvider } from './src/providers/UserTheme';
import { NotifierContextProvider } from './src/providers/Notifier';
import { Snackbar } from './src/components/Snackbar';
import { SnackableContextProvider } from './src/providers/Snackable';

type Props = {
  children: React.ReactNode;
};

function SuperContextProvider({children}: Props) {
  return (
    <ThemeProvider>
      <LoggedInUserProvider>
        <AudioRecorderPlayerProvider>
          <ChatsProvider>
              <NavigationContainer>
                <NotifierContextProvider>
                  <Provider>{children}</Provider>
                </NotifierContextProvider>
              </NavigationContainer>
          </ChatsProvider>
        </AudioRecorderPlayerProvider>
      </LoggedInUserProvider>
    </ThemeProvider>
  );
}

function AppSetup() {
  const {initAudioRecorderPlayer} = useAudioRecorderPlayer();

  useEffect(() => {
    const initFilePaths = FileManager.InitFilePaths();
    initAudioRecorderPlayer();

    initFilePaths.then(b => {
      if (!b) console.error('failed to create file structure');
    })
    .catch(e => console.error('failed to create file structure', e));
  }, []);

  return (
    <StackNavigator />
  );
}

function App() {
  return (
    <UserThemeContextProvider>
    <AppStateProvider>
      <SuperContextProvider>
        <AppSetup/>
        <SnackableContextProvider>
          <Snackbar/>
        </SnackableContextProvider>
      </SuperContextProvider>
    </AppStateProvider>
    </UserThemeContextProvider>
  );
}

export default App;
