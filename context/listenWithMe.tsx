import React from 'react';
import TrackPlayer, { Track , State as PlayState, useTrackPlayerEvents, Event as PlayerEvent} from 'react-native-track-player';

export type ListenWithMeContextType = {
  currentTrack?: Track,
  listeningWith: string,
  playState: PlayState,
  playUserTrack: (handle: string, track: Track)=>void;
  stopPlayer: ()=>void;
  updateCurrentTrack: (t: Track)=>void;
}

export const ListenWithMeContext = React.createContext<ListenWithMeContextType|null>(null);

export function ListenWithMeContextProvider({children}: {children: React.ReactNode}){
  const [listeningWith, setUser] = React.useState('');
  const [currentTrack, setCurrentTrack] = React.useState<Track|undefined>();
  const [playState, setPlayState] = React.useState<PlayState>(PlayState.None);

  useTrackPlayerEvents([PlayerEvent.PlaybackState, PlayerEvent.PlaybackTrackChanged], async (event) => {
    switch(event.type){
      case PlayerEvent.PlaybackState:
        setPlayState(event.state);
        break;
      case PlayerEvent.PlaybackTrackChanged:
        const tInd = await TrackPlayer.getCurrentTrack();
        if( tInd !== null){
          const track = await TrackPlayer.getTrack(tInd);
          if( track !== null)
            setCurrentTrack(track);
        }
        break;
    }
  });

  const updateCurrentTrack = (t?: Track) => {
    setCurrentTrack(t);
  }

  const playUserTrack = async (user: string, t: Track) => {
    if( listeningWith === user){
      if(playState !== PlayState.Paused){
        const tracks = await TrackPlayer.getQueue();
        const trackInd = tracks.findIndex(t_=> t_.url === t.url);
        if( trackInd === -1){
          await TrackPlayer.add(t);
        }else {
          await TrackPlayer.skip(trackInd);
        }
      }
    }else {
      await TrackPlayer.reset();
      await TrackPlayer.add(t);
      setUser(user);
    }
    await TrackPlayer.play();
    setCurrentTrack(t);
  }

  const stopPlayer = async () => {
    await TrackPlayer.reset();
    setUser('');
    setCurrentTrack(undefined);
  }

  return <ListenWithMeContext.Provider value={{
      listeningWith: listeningWith,
      currentTrack: currentTrack,
      playState: playState,
      stopPlayer: stopPlayer,
      playUserTrack: playUserTrack,
      updateCurrentTrack: updateCurrentTrack,
    }}>
    {children}
  </ListenWithMeContext.Provider>
}