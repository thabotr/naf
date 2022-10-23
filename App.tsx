/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import { Provider, Paragraph} from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {Messages, MessagesHeader} from './pages/messages';
import {Home, HomeHeader} from './pages/home';
import {ImageViewProvider} from './context/images';

const Stack = createNativeStackNavigator();

const App: () => Node = () => {
    return (
    <ImageViewProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerStyle: { backgroundColor: '#373737'}
            }}
          >
            <Stack.Screen
                name="Chat"
                component={Messages}
                options={{
                        headerTitle: (props) => <MessagesHeader {...props}/>
                    }}
            />
            <Stack.Screen
                name="Home"
                component={Home}
                options={{
                        headerTitle: (props) => <HomeHeader {...props}/>
                    }}
            />
          </Stack.Navigator>
        </NavigationContainer>
    </ImageViewProvider>
    );
};

export default App;
