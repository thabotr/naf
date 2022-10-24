import TrackPlayer, {Event, RepeatMode} from 'react-native-track-player';

export const PlaybackService = async function() {
    await TrackPlayer.setRepeatMode(RepeatMode.Off);
    TrackPlayer.addEventListener(Event.RemotePlay, ()=> TrackPlayer.play());
    TrackPlayer.addEventListener(Event.RemotePause, ()=> TrackPlayer.pause());
};