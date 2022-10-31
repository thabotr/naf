/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { Provider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ToastManager from 'toastify-react-native';

import {Messages, MessagesHeader} from './pages/messages';
import {Home, HomeHeader} from './pages/home';
import {ImageViewProvider} from './context/images';
import { ThemeContext, ThemeContextProvider, ThemeContextType } from './context/theme';
import { UserContextProvider } from './context/user';

const Stack = createNativeStackNavigator();

function N(){
  const {theme} = React.useContext(ThemeContext) as ThemeContextType;

  return <Stack.Navigator
  initialRouteName="Home"
  screenOptions={{
      headerStyle: { backgroundColor: theme.color.primary}
  }}
>
  <Stack.Screen
      name="Chat"
      component={Messages}
      options={{
              headerTitle: (props) => <MessagesHeader/>
          }}
  />
  <Stack.Screen
      name="Home"
      component={Home}
      options={{
              headerTitle: (props) => <HomeHeader/>
          }}
  />
</Stack.Navigator>
}

function App() {
    return (
        <ThemeContextProvider>
          <UserContextProvider>
            <ImageViewProvider>
                <NavigationContainer>
                <Provider>
                  <N/>
                  <ToastManager duration={5_000} style={{width: '100%', borderRadius: 9}}/>
                </Provider>
                </NavigationContainer>
            </ImageViewProvider>
          </UserContextProvider>
        </ThemeContextProvider>
    );
};

export default App;
