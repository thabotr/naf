import React from 'react';
import {View} from 'react-native';
import {ProgressBar, IconButton, Paragraph, Card} from 'react-native-paper';

import { MessageEditorContext, MessageEditorContextType } from '../context/messageEditor';
import {useTheme} from '../context/theme';
import { getFilePath } from '../src/file';
import { verboseDuration, verboseSize } from '../src/helper';
import { mimeTypeToExtension } from '../types/file';
import { VoiceNoteType } from '../types/message';
import { HorizontalView, OnlyShow } from './helper';

const enum PlayState {
    PAUSED,
    PLAYING,
    STOPPED
}

export function VoiceNoteCard({file, user, style}:{file: VoiceNoteType, user?: boolean, style?:{[key:string]:any}}) {
    const [playState, setPlayState] = React.useState<PlayState>(PlayState.STOPPED);
    const {theme} = useTheme();
    const {audioRecorderPlayer} = React.useContext(MessageEditorContext) as MessageEditorContextType;
    const [playerValues, setPlayerValues] = React.useState({positionSec: 0, durationSec: file.duration});
    const [uri, setURI] = React.useState(file.uri);

    React.useEffect(()=>{
        const ext = mimeTypeToExtension[file.type];
        if(file.uri.includes('http'))
            getFilePath(file.uri, ext)
            .then(path => path && setURI(path))
            .catch(e => console.log('found err', e, 'whilst getting voice note file path'));
    }, [])

    const onResumePlay =async () => {
        const msg = await audioRecorderPlayer.resumePlayer();
        setPlayState(PlayState.PLAYING);
    }

    const onStartPlay = async () => {
        const msg = await audioRecorderPlayer.startPlayer(uri);
        audioRecorderPlayer.addPlayBackListener((e) => {
            if( e.currentPosition === e.duration)
                onStopPlay();

            setPlayerValues({
                positionSec: e.currentPosition/1000,
                durationSec: e.duration/1000,
            })
          return;
        });
        setPlayState(PlayState.PLAYING);
      };
      
      const onPausePlay = async () => {
        const msg = await audioRecorderPlayer.pausePlayer();
        setPlayState(PlayState.PAUSED);
      };
      
      const onStopPlay = async () => {
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
    <Card style={{ ...style,margin: 3, padding: 5, backgroundColor: user ? theme.color.userSecondary : theme.color.friendSecondary}}>
        <HorizontalView>
            <View style={{flex: 1}}>
                <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Paragraph style={{color: theme.color.textPrimary, textShadowColor: theme.color.textSecondary}}>{verboseDuration(playerValues.positionSec)}</Paragraph>
                    <Paragraph style={{color: theme.color.textPrimary, textShadowColor: theme.color.textSecondary}}>{verboseSize(file.size)}</Paragraph>
                    <Paragraph style={{color: theme.color.textPrimary, textShadowColor: theme.color.textSecondary}}>{verboseDuration(playerValues.durationSec)}</Paragraph>
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