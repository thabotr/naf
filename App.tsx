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
import {useLoggedInUser, LoggedInUserProvider} from './src/context/user';
import {StackNavigator} from './src/components/StackNavigator';
import {ChatsProvider} from './src/context/chat';
import {Login} from './src/pages/Login';
import {AppStateProvider} from './src/providers/AppStateProvider';
import {
  AudioRecorderPlayerProvider,
  useAudioRecorderPlayer,
} from './src/providers/AudioRecorderPlayer';
import {FileManager} from './src/services/FileManager';
import {Show} from './src/components/Helpers/Show';

type Props = {
  children: React.ReactNode;
};

function RegisterPlayerRecorder() {
  const {initAudioRecorderPlayer} = useAudioRecorderPlayer();
  useEffect(() => {
    initAudioRecorderPlayer();
  }, []);
  return <></>;
}

function SuperContextProvider({children}: Props) {
  return (
    <ThemeProvider>
      <LoggedInUserProvider>
        <AudioRecorderPlayerProvider>
          <RegisterPlayerRecorder />
          <ChatsProvider>
              <NavigationContainer>
                <Provider>{children}</Provider>
              </NavigationContainer>
          </ChatsProvider>
        </AudioRecorderPlayerProvider>
      </LoggedInUserProvider>
    </ThemeProvider>
  );
}

function PageLoginElseHome() {
  useEffect(() => {
    FileManager.InitFilePaths()
      .then(b => {
        if (!b) console.error('failed to create file structure');
      })
      .catch(e => console.error('failed to create file structure', e));
  }, []);
  const {user} = useLoggedInUser();
  return (
    <Show
      component={<Login />}
      If={!user}
      ElseShow={
        <>
          <StackNavigator />
        </>
      }
    />
  );
}

function App() {
  return (
    <AppStateProvider>
      <SuperContextProvider>
        <PageLoginElseHome />
      </SuperContextProvider>
    </AppStateProvider>
  );
}

export default App;
