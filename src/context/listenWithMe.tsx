import {createContext, useState, ReactNode} from 'react';
import TrackPlayer, { Track , State as PlayState, useTrackPlayerEvents, Event as PlayerEvent} from 'react-native-track-player';
import { Colors } from '../services/FileManager';
import { useTheme } from './theme';

type LWMColors = {primary: string, secondary: string};

export type ListenWithMeContextType = {
  currentTrack?: Track,
  listeningWith: string,
  playState: PlayState,
  playUserTrack: (handle: string, track: Track)=>void;
  stopPlayer: ()=>void;
  updateCurrentTrack: (t: Track)=>void;
  colors: LWMColors;
  saveColors: (cs: Colors)=>void;
}

export const ListenWithMeContext = createContext<ListenWithMeContextType|null>(null);

export function ListenWithMeContextProvider({children}: {children: ReactNode}){
  const [listeningWith, setUser] = useState('');
  const [currentTrack, setCurrentTrack] = useState<Track|undefined>();
  const [playState, setPlayState] = useState<PlayState>(PlayState.None);
  const {theme} = useTheme();
  const [colors, setColors] = useState<LWMColors>(()=>{
    return {
    primary: theme.color.primary,
    secondary: theme.color.secondary,
  }})

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

  const saveColors = (cs: Colors)=>{
    if( theme.dark){
      setColors(colors => {
        return {
        primary: cs.darkPrimary ?? colors.primary,
        secondary: cs.darkSecondary ?? colors.secondary,
      }});
    }else {
      setColors(colors => {
        return {
        primary: cs.lightPrimary ?? colors.primary,
        secondary: cs.lightSecondary ?? colors.secondary,
      }});
    }
  }

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
      colors: colors,
      stopPlayer: stopPlayer,
      playUserTrack: playUserTrack,
      updateCurrentTrack: updateCurrentTrack,
      saveColors: saveColors,
    }}>
    {children}
  </ListenWithMeContext.Provider>
}