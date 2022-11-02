/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { Appbar, Provider} from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator} from '@react-navigation/native-stack';
import ToastManager from 'toastify-react-native';

import {Messages} from './pages/messages';
import {Home} from './pages/home';
import {ImageViewProvider} from './context/images';
import { ThemeContext, ThemeContextProvider, ThemeContextType } from './context/theme';
import { UserContext, UserContextProvider, UserContextType } from './context/user';
import { MessagesContext, MessagesContextProvider, MessagesContextType } from './context/messages';
import { Image, OnlyShow } from './components/helper';

const Stack = createNativeStackNavigator();

function NavigationWrapper(){
  const {theme} = React.useContext(ThemeContext) as ThemeContextType;
  const {user} = React.useContext(UserContext) as UserContextType;
  const {chat} = React.useContext(MessagesContext) as MessagesContextType;

  return <Stack.Navigator
    initialRouteName="Home"
    screenOptions={{
        header: props => {
          const navBarUser = props.route.name === "Home" ? user : chat?.user ?? {
            avatarURI: '', handle: '', landscapeURI: '', listenWithMeURI: '', name: '', surname: ''
          }
        
          return <Appbar.Header>
              <OnlyShow If={!!props.back}>
                <Appbar.BackAction onPress={()=>{
                  props.navigation.goBack();
                }}/>
              </OnlyShow>
              <Appbar.Content title={navBarUser.handle} subtitle={`${navBarUser.name} ${navBarUser.surname}`}/>
              <Image style={{ height: '100%', borderRadius: 0, width: 50, marginRight: 10}} source={{uri: navBarUser.avatarURI}}/>
            </Appbar.Header>
      },
      headerStyle: { backgroundColor: theme.color.primary}
    }}
  >
    <Stack.Screen
        name="Chat"
        component={Messages}
    />
    <Stack.Screen
        name="Home"
        component={Home}
    />
  </Stack.Navigator>
}

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
        <NavigationWrapper/>
        <ToastManager duration={5_000} style={{width: '100%', borderRadius: 9}}/>
      </SuperContextProvider>
    );
};

export default App;
