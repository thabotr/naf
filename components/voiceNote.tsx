import React from 'react';
import {View} from 'react-native';
import {ProgressBar, IconButton, Paragraph, Card} from 'react-native-paper';
import TrackPlayer, {useProgress, usePlaybackState, State, Track} from 'react-native-track-player';
import { ThemeContext } from '../context/theme';
import { ThemeContextType } from '../types/theme';

function zeroPad(num: number):string { return num < 10 ? `0${num}` : `${num}`};

function humanAudioLength(seconds: number): string {
    seconds = Math.floor(seconds);
    const minSecs = `${zeroPad(Math.floor(seconds/60)%60)}:${zeroPad(seconds%60)}`;
    return seconds/3600 < 1 ? minSecs : `${zeroPad(Math.floor(seconds/3600))}:${minSecs}`;
}

export function VoiceNoteCard({track, user=true}:{track: Track, user?: boolean}) {
    const playBackState = usePlaybackState();
    const { position, buffered, duration } = useProgress(1_000);
    const isPlaying = playBackState  === State.Playing;
    const {theme} = React.useContext(ThemeContext) as ThemeContextType;

    const play = async () => {
        const tracks = await TrackPlayer.getQueue();
        const currTrack = await TrackPlayer.getCurrentTrack();
        const i = tracks.findIndex(t=>t.url === track.url);
        if( i === -1) {
            await TrackPlayer.add(track, tracks.length);
            await TrackPlayer.seekTo(tracks.length);
        }else if((currTrack ?? -1 !== i) || await TrackPlayer.getState() === State.Stopped) {
            await TrackPlayer.skip(i);
        }
        await TrackPlayer.play();
    }

    return (
    <Card style={{margin: 5, backgroundColor: user ? theme.color.userSecondary : theme.color.friendSecondary}}>
        <Card.Content>
        <View style={{display: 'flex', flexDirection: 'row'}}>
            <View style={{flex: 1}}>
                <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Paragraph>{humanAudioLength(position)}</Paragraph>
                    <Paragraph>{humanAudioLength(duration)}</Paragraph>
                </View>
                <View style={{flex: 1, justifyContent: 'center'}}>
                    {/* Buffered progress */}
                    <ProgressBar color={theme.color.primary} style={{opacity: 0.2}} progress={duration === 0 ? 0 : buffered/duration}/>
                    <View style={{
                       justifyContent: 'center',
                       position: 'absolute',
                       top: 0,
                       left: 0,
                       right: 0,
                       bottom: 0
                    }}>
                        {/* Playback progress */}
                        <ProgressBar color={theme.color.primary} progress={duration === 0 ? 0 : position/duration}/>
                    </View>
                </View>
            </View>
            <IconButton
                onPress={async ()=> isPlaying ? await TrackPlayer.pause() : await play()}
                icon={ !isPlaying ? "play" : "pause"}
            />
        </View>
        </Card.Content>
    </Card>
    );
}