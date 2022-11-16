/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {Provider} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';

import {ImageViewProvider} from './src/context/images';
import {ThemeProvider} from './src/context/theme';
import {useLoggedInUser, LoggedInUserProvider} from './src/context/user';
import {ToastySnackbarManager} from './src/components/snackbar';
import {StackNavigator} from './src/components/stackNavigator';
import {ChatsProvider} from './src/context/chat';
import {Show} from './src/components/helper';
import {Login} from './src/pages/login';
import RNFetchBlob from 'rn-fetch-blob';
import {AppStateProvider} from './src/providers/AppStateProvider';
import { AudioRecorderPlayerProvider, useAudioRecorderPlayer } from './src/providers/AudioRecorderPlayer';
import { FileManager } from './src/services/FileManager';
// import {AppStateProvider} from './providers/AppStateProvider';

const SetupFileStructure = async () => {
  try {
    await RNFetchBlob.fs.mkdir(`${RNFetchBlob.fs.dirs.CacheDir}/images`);
  } catch (e) {
    if (!`${e}`.includes('already exists')) return e;
  }

  try {
    await RNFetchBlob.fs.mkdir(`${RNFetchBlob.fs.dirs.CacheDir}/sounds`);
  } catch (e) {
    if (!`${e}`.includes('already exists')) return e;
  }

  try {
    await RNFetchBlob.fs.mkdir(`${RNFetchBlob.fs.dirs.CacheDir}/files`);
  } catch (e) {
    if (!`${e}`.includes('already exists')) return e;
  }

  return null;
};

type Props = {
  children: React.ReactNode;
};

function RegisterPlayerRecorder(){
  const {initAudioRecorderPlayer} = useAudioRecorderPlayer();
  React.useEffect(()=>{
    initAudioRecorderPlayer();
  },[]);
  return <></>
}

function SuperContextProvider({children}: Props) {
  return (
    <ThemeProvider>
      <LoggedInUserProvider>
        <AudioRecorderPlayerProvider>
          <RegisterPlayerRecorder/>
          <ChatsProvider>
            <ImageViewProvider>
              <NavigationContainer>
                <Provider>{children}</Provider>
              </NavigationContainer>
            </ImageViewProvider>
          </ChatsProvider>
        </AudioRecorderPlayerProvider>
      </LoggedInUserProvider>
    </ThemeProvider>
  );
}

function PageLoginElseHome() {
  React.useEffect(() => {
    FileManager.InitFilePaths()
    .then(b=>{
      if(!b) console.error('failed to create file structure');
    }).catch(e=>console.error('failed to create file structure', e));
    // SetupFileStructure().catch(e => {
    //   if (e !== null) console.error('file structure setup error: ' + e);
    // });
  }, []);
  const {user} = useLoggedInUser();
  return (
    <Show
      component={<Login />}
      If={!user}
      ElseShow={
        <>
          <StackNavigator />
          <ToastySnackbarManager />
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
