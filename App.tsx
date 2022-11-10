/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { Provider} from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';

import {ImageViewProvider} from './context/images';
import { ThemeProvider } from './context/theme';
import {useLoggedInUser, LoggedInUserProvider } from './context/user';
import { ToastySnackbarManager } from './components/snackbar';
import { StackNavigator } from './components/stackNavigator';
import { ChatsProvider } from './context/chat';
import { Show } from './components/helper';
import { Login } from './pages/login';
import RNFetchBlob from 'rn-fetch-blob';

const SetupFileStructure = async()=>{
  try{
    await RNFetchBlob.fs.mkdir(`${RNFetchBlob.fs.dirs.CacheDir}/images`)
  }catch(e) {
    if(!`${e}`.includes('already exists')) return e;
  }

  try{
    await RNFetchBlob.fs.mkdir(`${RNFetchBlob.fs.dirs.CacheDir}/sounds`);
  }catch(e){
    if(!`${e}`.includes('already exists')) return e;
  }

  try{
    await RNFetchBlob.fs.mkdir(`${RNFetchBlob.fs.dirs.CacheDir}/files`);
  }catch(e){
    if(!`${e}`.includes('already exists')) return e;
  }

  return null;
}

type Props = {
  children: React.ReactNode;
}

function SuperContextProvider({children}: Props){
  return (
    <ThemeProvider>
      <LoggedInUserProvider>
        <ChatsProvider>    
            <ImageViewProvider>
              <NavigationContainer>
                <Provider>
                  {children}
                </Provider>
              </NavigationContainer>
            </ImageViewProvider>
        </ChatsProvider>
      </LoggedInUserProvider>
    </ThemeProvider>
  );
}

function App() {
    function PageLoginElseHome(){
      React.useEffect(()=>{
        SetupFileStructure().catch( e => {
          if(e !== null) console.error('file structure setup error: ' + e); 
        });
      }, [])
      const {user} = useLoggedInUser();
      return <Show
      component={<Login/>}
      If={!user}
      ElseShow={
        <>
          <StackNavigator/>
          <ToastySnackbarManager/>
        </>
      }
      />
    }

    return (
      <SuperContextProvider>
        <PageLoginElseHome/>
      </SuperContextProvider>
    );
};

export default App;