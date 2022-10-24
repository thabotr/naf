/**
 * @format
 */

import {AppRegistry} from 'react-native';
import TrackPlayer, {AppKilledPlaybackBehavior} from 'react-native-track-player';

import App from './App';
import {name as appName} from './app.json';
import {PlaybackService} from './src/services';

// Set up the player
TrackPlayer.setupPlayer().then(()=> {
    TrackPlayer.registerPlaybackService(() => PlaybackService);
    TrackPlayer.updateOptions({
        android: {
            appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
        }
    });
});

AppRegistry.registerComponent(appName, () => App);