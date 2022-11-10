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

import {ImageViewProvider} from './context/images';
import {ThemeProvider} from './context/theme';
import {useLoggedInUser, LoggedInUserProvider} from './context/user';
import {ToastySnackbarManager} from './components/snackbar';
import {StackNavigator} from './components/stackNavigator';
import {ChatsProvider} from './context/chat';
import {Show} from './components/helper';
import {Login} from './pages/login';
import RNFetchBlob from 'rn-fetch-blob';
import {AppStateProvider} from './providers/AppStateProvider';
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

function SuperContextProvider({children}: Props) {
  return (
    <ThemeProvider>
      <LoggedInUserProvider>
        <ChatsProvider>
          <ImageViewProvider>
            <NavigationContainer>
              <Provider>{children}</Provider>
            </NavigationContainer>
          </ImageViewProvider>
        </ChatsProvider>
      </LoggedInUserProvider>
    </ThemeProvider>
  );
}

function PageLoginElseHome() {
  React.useEffect(() => {
    SetupFileStructure().catch(e => {
      if (e !== null) console.error('file structure setup error: ' + e);
    });
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
