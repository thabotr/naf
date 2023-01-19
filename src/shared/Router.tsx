import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Credentials, Login, LoginErrorType} from '../pages/Login/Login';
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
import {Message} from '../pages/Chat/types/Message';
import {RemoteRepository} from './repository/remote';
import Registration from '../pages/Registration/Registration';
import Publisher, {Subscription} from '../shared/utils/publisher';
import {AppRegistry} from 'react-native';

const remoteChatProfileRepo = new RemoteChatProfileRepository();
const remoteChatRepo = new RemoteChatRepository();
const NavigationStack = createNativeStackNavigator();

function addMsgsToChats(messages: Message[], chats: Chat[]): Chat[] {
  const chatsWithNewMsgs = [...chats];
  chatsWithNewMsgs.forEach(chat => {
    const newMessagesForChat = messages.filter(
      msg =>
        msg.fromHandle === chat.user.handle ||
        msg.toHandle === chat.user.handle,
    );
    chat.messages = chat.messages.concat(newMessagesForChat);
  });
  return chatsWithNewMsgs;
}

function getLatestTimestamp(messages: Message[]): Date | undefined {
  return messages
    .map(msg => msg.timestamp)
    .sort((date1, date2) => date1.getTime() - date2.getTime())
    .pop();
}

function enrichWithRequiredFields(chat: Chat): Chat {
  chat.messages ??= [];
  chat.messageThreads ??= [];
  chat.lastModified ??= new Date(1997, 1, 1);
  return chat;
}

export default function Router(): JSX.Element {
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
  const [registering, setRegistering] = useState(false);
  const [registrationError, setRegistrationError] =
    useState<LoginErrorType>(undefined);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    if (loggedInUser) {
      const credentials = JSON.stringify({
        handle: loggedInUser.handle,
        token: loggedInUser.token,
      });
      AppRegistry.startHeadlessTask(171, 'naf-notifier', credentials);
    }
  }, [loggedInUser]);

  useEffect(() => {
    if (!loggedInUser) {
      return;
    }
    const getMsgs: Subscription = {
      id: 'getMessages',
      callback: () => {
        let messagesSince;
        RemoteRepository.getMessages(loggedInUser, messagesSince)
          .then(messages => {
            const latestMsgTimestamp = getLatestTimestamp(messages);
            messagesSince = latestMsgTimestamp;
            latestMsgTimestamp &&
              Publisher.publish('MESSAGE_SINCE', latestMsgTimestamp);
            setChats(currChats => addMsgsToChats(messages, currChats));
          })
          .finally(() => Publisher.publish('START_NOTIFICATION_LISTENER'));
      },
    };
    const unsubFromGetMsgs = Publisher.subscribe('NEW_MESSAGE', getMsgs);
    return () => {
      unsubFromGetMsgs();
    };
  }, [loggedInUser]);

  function onPressLogin(credentials: {token: string; handle: string}) {
    RemoteRepository.setCredentials(credentials.token, credentials.handle);
    RemoteRepository.getUserProfile(credentials)
      .then(profileResult => {
        console.log('logged in as ', profileResult);
        setLoggedInUser(profileResult);
        setLoginError(undefined);
        remoteChatRepo.getChats().then(remoteChats => {
          if (remoteChats === null) {
            return;
          }
          remoteChats.forEach(enrichWithRequiredFields);
          setChats(remoteChats);
          RemoteRepository.getMessages(profileResult)
            .then(messages => {
              const latestMsgTimestamp = getLatestTimestamp(messages);
              latestMsgTimestamp &&
                Publisher.publish('MESSAGE_SINCE', latestMsgTimestamp);
              setChats(currentChats => addMsgsToChats(messages, currentChats));
            })
            .catch(e => console.log('Login->getMessages', e));
        });
      })
      .catch(e => {
        setUserCredentials(credentials);
        setLoginError(e.message);
      });
  }

  function onRegister(credentials: Credentials) {
    RemoteRepository.createProfile(credentials)
      .then(registeredCredentials => {
        setRegistered(true);
        setRegistering(false);
        setUserCredentials(registeredCredentials);
        setLoginError(undefined);
      })
      .catch(e => {
        setRegistrationError(e.message);
      });
  }

  if (registering) {
    return (
      <ThemeProvider>
        <Registration
          credentials={userCredentials}
          onBackToLogin={() => setRegistering(false)}
          onRegister={onRegister}
          registrationError={registrationError}
        />
      </ThemeProvider>
    );
  }

  if (!loggedInUser) {
    return (
      <ThemeProvider>
        <Login
          onToRegistration={() => setRegistering(true)}
          onPressLoginBtn={onPressLogin}
          userCredentials={userCredentials}
          loginError={loginError}
          registered={registered}
        />
      </ThemeProvider>
    );
  }

  const HomeScreen = () => {
    const navigation: {
      navigate: (path: string) => void;
    } = useNavigation();
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
    const navigation: {
      navigate: (path: string) => void;
    } = useNavigation();
    return <Preferences onBackToHome={() => navigation.navigate('Home')} />;
  };
  const MyProfileScreen = () => {
    const navigation: {
      navigate: (path: string) => void;
    } = useNavigation();
    return (
      <MyProfile
        onLogout={() => setLoggedInUser(undefined)}
        onBackToHome={() => navigation.navigate('Home')}
      />
    );
  };
  const ChatScreen = () => {
    const navigation: {
      navigate: (path: string) => void;
    } = useNavigation();
    if (!openChat) {
      return null;
    }

    const sendMessage = (message: Partial<Message>) => {
      const fullMessage: Message = {
        text: message.text ?? '',
        toHandle: openChat.user.handle,
        timestamp: new Date(),
        fromHandle: loggedInUser.handle,
      };
      remoteChatRepo
        .postMessage(fullMessage)
        .then(sentMessage =>
          setOpenChat(
            oldChat =>
              oldChat && {
                ...oldChat,
                messages: (oldChat.messages ?? []).concat([sentMessage]),
              },
          ),
        )
        .catch(e => console.log(e));
    };
    return (
      <ChatPage
        chat={openChat}
        onBackToHome={() => navigation.navigate('Home')}
        onOpenChatProfile={() => navigation.navigate('Chat Profile')}
        onSendMessage={sendMessage}
        messages={openChat.messages}
      />
    );
  };
  const ChatProfileScreen = () => {
    const navigation: {
      navigate: (path: string) => void;
    } = useNavigation();
    const [chatProfileError, setChatProfileError] =
      useState<LoginErrorType>(undefined);

    function onDisconnect() {
      if (!loggedInUser || !openChat) {
        return;
      }
      remoteChatProfileRepo
        .deleteConnection(openChat.user.handle)
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

    if (!openChat) {
      return <></>;
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
