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
import { ThemeContextProvider } from './context/theme';
import { UserContextProvider } from './context/user';
import { MessagesContextProvider } from './context/messages';
import { ToastySnackbarManager } from './components/snackbar';
import { StackNavigator } from './components/stackNavigator';

function SuperContextProvider({children}:{children: React.ReactNode}){
  return (
    <ThemeContextProvider>
          <UserContextProvider>
          <MessagesContextProvider>
            <ImageViewProvider>
                <NavigationContainer>
                <Provider>
                  {children}
                </Provider>
                </NavigationContainer>
            </ImageViewProvider>
            </MessagesContextProvider>
          </UserContextProvider>
        </ThemeContextProvider>
  );
}

function App() {
    return (
      <SuperContextProvider>
        <StackNavigator/>
        <ToastySnackbarManager/>
      </SuperContextProvider>
    );
};

export default App;
