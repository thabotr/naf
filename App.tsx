/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {Messages, MessagesHeader} from './pages/messages';
import {Home, HomeHeader} from './pages/home';
import {ImageViewProvider} from './context/images';
import { ThemeContext, ThemeContextProvider } from './context/theme';
import { ThemeContextType } from './types/theme';
import { Provider } from 'react-native-paper';

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
      <Provider>
        <ThemeContextProvider>
        <ImageViewProvider>
            <NavigationContainer>
              <N/>
            </NavigationContainer>
        </ImageViewProvider>
        </ThemeContextProvider>
    </Provider>
    );
};

export default App;
