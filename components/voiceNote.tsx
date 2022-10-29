import React from 'react';
import {View} from 'react-native';
import {ProgressBar, IconButton, Paragraph, Card} from 'react-native-paper';

import { MessageEditorContext } from '../context/messageEditor';
import { ThemeContext } from '../context/theme';
import { MessageEditorContextType } from '../types/MessageEditor';
import { ThemeContextType } from '../types/theme';
import { HorizontalView, OnlyShow } from './helper';

function zeroPad(num: number):string { return num < 10 ? `0${num}` : `${num}`};

export function verboseDuration(seconds: number): string {
    seconds = Math.floor(seconds);
    const minSecs = `${zeroPad(Math.floor(seconds/60)%60)}:${zeroPad(seconds%60)}`;
    return seconds/3600 < 1 ? minSecs : `${zeroPad(Math.floor(seconds/3600))}:${minSecs}`;
}

const enum PlayState {
    PAUSED,
    PLAYING,
    STOPPED
}

export function VoiceNoteCard({uri, user}:{uri: string, user?: boolean}) {
    const [playState, setPlayState] = React.useState<PlayState>(PlayState.STOPPED);
    const {theme} = React.useContext(ThemeContext) as ThemeContextType;
    const {vrState, audioRecorderPlayer, saveVRState} = React.useContext(MessageEditorContext) as MessageEditorContextType;
    const [playerValues, setPlayerValues] = React.useState({positionSec: 0, durationSec: 0});

    const onResumePlay =async () => {
        const msg = await audioRecorderPlayer.resumePlayer();
        setPlayState(PlayState.PLAYING);
        console.log(msg);
    }

    const onStartPlay = async () => {
        const msg = await audioRecorderPlayer.startPlayer(uri);
        console.log(msg);
        audioRecorderPlayer.addPlayBackListener((e) => {
            if( e.currentPosition === e.duration)
                onStopPlay();

            setPlayerValues({
                positionSec: e.currentPosition/1_000,
                durationSec: e.duration/1_000,
            })
          return;
        });
        setPlayState(PlayState.PLAYING);
      };
      
      const onPausePlay = async () => {
        const msg = await audioRecorderPlayer.pausePlayer();
        console.log(msg);
        setPlayState(PlayState.PAUSED);
      };
      
      const onStopPlay = async () => {
        console.log('onStopPlay');
        audioRecorderPlayer.stopPlayer();
        audioRecorderPlayer.removePlayBackListener();
        setPlayState(PlayState.STOPPED);
        setPlayerValues({
            ...playerValues,
            positionSec: 0,
        })
      };

    const progress = playerValues.durationSec === 0 ? 0 : playerValues.positionSec / playerValues.durationSec;

    return (
    <Card style={{margin: 3, padding: 5, backgroundColor: user ? theme.color.userSecondary : theme.color.friendSecondary}}>
        <HorizontalView>
            <View style={{flex: 1}}>
                <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Paragraph>{verboseDuration(playerValues.positionSec)}</Paragraph>
                    <Paragraph>{verboseDuration(playerValues.durationSec)}</Paragraph>
                </View>
                <View style={{flex: 1, justifyContent: 'center'}}>
                    <ProgressBar color={theme.color.primary} progress={progress}/>
                </View>
            </View>
            <IconButton
                onPress={()=>{
                    switch(playState){
                        case PlayState.PLAYING:
                            onPausePlay();
                            break;
                        case PlayState.PAUSED:
                            onResumePlay();
                            break;
                        default:
                            onStartPlay();
                    }
                }}
                icon={ playState === PlayState.PLAYING ? "pause" : "play"}
            />
            <OnlyShow If={playState !== PlayState.STOPPED}>
                <IconButton
                    onPress={onStopPlay}
                    icon="stop"
                />
            </OnlyShow>
        </HorizontalView>
    </Card>
    );
}