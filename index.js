/**
 * @format
 */

import {AppRegistry} from 'react-native';
import TrackPlayer, {AppKilledPlaybackBehavior, Capability} from 'react-native-track-player';

import App from './App';
import {name as appName} from './app.json';
import {PlaybackService} from './src/services';

// Set up the player
TrackPlayer.setupPlayer({
    android: {
        appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
    },
    capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.Stop,
    ],
    compactCapabilities: [
        Capability.Pause,
        Capability.Stop,
    ]
}).catch(e => console.error("Error on trackplayer setup "+e));

AppRegistry.registerComponent(appName, () => App);
TrackPlayer.registerPlaybackService(() => PlaybackService);