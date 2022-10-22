/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import { Provider} from 'react-native-paper';
import Lorem from 'react-native-lorem-ipsum';

import {Messages} from './pages/messages';

const App: () => Node = () => {
    return <Messages/>
};

export default App;
