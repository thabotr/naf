import React, {useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Login, LoginErrorType} from '../pages/Login/Login';
import {RemoteLoginRepository} from '../pages/Login/repository/remote';
import {Profile} from '../types/user';
import {ThemeProvider} from './providers/theme';
import Home from '../pages/Home/Home';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {Chat} from '../types/chat';
import {RemoteChatRepository} from '../pages/Chat/repository/remote';
import {Preferences} from '../pages/Preferences/Preferences';
import MyProfile from '../pages/MyProfile/MyProfile';
import ChatPage from '../pages/Chat/Chat';
import ChatProfile from '../pages/ChatProfile/ChatProfile';
import {RemoteChatProfileRepository} from '../pages/ChatProfile/repository/remote';

const remoteRepo = new RemoteLoginRepository();
const remoteChatRepo = new RemoteChatRepository();
const remoteChatProfileRepo = new RemoteChatProfileRepository();
const NavigationStack = createNativeStackNavigator();

export default function Router() {
  const [loggedInUser, setLoggedInUser] = useState<Profile | undefined>(
    undefined,
  );
  const [chats, setChats] = useState<Chat[]>([]);
  const [openChat, setOpenChat] = useState<Chat | undefined>(undefined);
  const [loginError, setLoginError] = useState<LoginErrorType>(undefined);
  const [userCredentials, setUserCredentials] = useState({
    handle: '',
    token: '',
  });

  function onPressLogin(credentials: {token: string; handle: string}) {
    remoteRepo
      .getUserProfile(credentials.token, credentials.handle)
      .then(profileResult => {
        if (!profileResult) {
          return;
        }
        setLoggedInUser(profileResult);
        setLoginError(undefined);
        remoteChatRepo
          .getChats(credentials.token, credentials.handle)
          .then(remoteChats => {
            if (remoteChats === null) {
              return;
            }
            setChats(remoteChats);
          });
      })
      .catch(e => {
        setUserCredentials(credentials);
        setLoginError(e.message);
      });
  }

  if (!loggedInUser) {
    return (
      <ThemeProvider>
        <Login
          onPressLoginBtn={onPressLogin}
          userCredentials={userCredentials}
          loginError={loginError}
        />
      </ThemeProvider>
    );
  }

  const HomeScreen = () => {
    const navigation: any = useNavigation();
    return (
      <MemoedHome
        chats={chats}
        onOpenPreferences={() => navigation.navigate('Preferences')}
        onOpenMyProfile={() => navigation.navigate('My Profile')}
        onOpenChat={chat => {
          setOpenChat(chat);
          navigation.navigate('Chat');
        }}
      />
    );
  };

  const PreferencesScreen = () => {
    const navigation: any = useNavigation();
    return <Preferences onBackToHome={() => navigation.navigate('Home')} />;
  };
  const MyProfileScreen = () => {
    const navigation: any = useNavigation();
    return (
      <MyProfile
        onLogout={() => setLoggedInUser(undefined)}
        onBackToHome={() => navigation.navigate('Home')}
      />
    );
  };
  const ChatScreen = () => {
    const navigation: any = useNavigation();
    return (
      <ChatPage
        chat={openChat}
        onBackToHome={() => navigation.navigate('Home')}
        onOpenChatProfile={() => navigation.navigate('Chat Profile')}
      />
    );
  };
  const ChatProfileScreen = () => {
    const navigation: any = useNavigation();
    const [chatProfileError, setChatProfileError] =
      useState<LoginErrorType>(undefined);

    function onDisconnect() {
      if (!loggedInUser || !openChat) {
        return;
      }
      remoteChatProfileRepo
        .deleteConnection(
          loggedInUser.token,
          loggedInUser.handle,
          openChat.user.handle,
        )
        .then(connectionDeleted => {
          if (connectionDeleted) {
            setChats(oldChats =>
              oldChats.filter(
                oldChat => oldChat.user.handle !== openChat.user.handle,
              ),
            );
            navigation.navigate('Home');
          }
        })
        .catch(e => setChatProfileError(e.message));
    }

    return (
      <ChatProfile
        chat={openChat}
        error={chatProfileError}
        onGoBack={() => navigation.navigate('Chat')}
        onDisconnect={onDisconnect}
      />
    );
  };

  return (
    <ThemeProvider>
      <NavigationContainer>
        <NavigationStack.Navigator
          screenOptions={{
            headerShown: false,
          }}>
          <NavigationStack.Screen name="Home" component={HomeScreen} />
          <NavigationStack.Screen
            name="My Profile"
            component={MyProfileScreen}
          />
          <NavigationStack.Screen
            name="Preferences"
            component={PreferencesScreen}
          />
          <NavigationStack.Screen name="Chat" component={ChatScreen} />
          <NavigationStack.Screen
            name="Chat Profile"
            component={ChatProfileScreen}
          />
        </NavigationStack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}

const MemoedHome = React.memo(Home);
