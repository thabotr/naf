import React from 'react';
import {StyleSheet} from 'react-native';
import {IconButton} from 'react-native-paper';
import {useTheme} from '../../context/theme';
import {Message, VoiceNoteType} from '../../types/message';
import {HorizontalView} from '../Helpers/HorizontalView';
import {OnlyShow} from '../Helpers/OnlyShow';
import {VoiceNoteCard} from './VoiceNoteCard';

function VoiceRecordingsPreview({
  message,
  onDeleteRecording,
}: {
  message: Message;
  onDeleteRecording?: (r: VoiceNoteType) => void;
}) {
  const {theme} = useTheme();
  const styles = StyleSheet.create({
    center: {alignItems: 'center'},
    flex: {flex: 1},
    squareButton: {
      backgroundColor: theme.color.secondary,
      borderRadius: 0,
    },
  });
  return (
    <>
      {message.voiceRecordings.map(r => (
        <HorizontalView style={styles.center} key={r.uri}>
          <VoiceNoteCard
            playId={`${message.from}-${message.to}-${message.id}-${r.uri}`}
            style={styles.flex}
            file={r}
            fromYou
          />
          <OnlyShow If={!!onDeleteRecording}>
            <IconButton
              style={styles.squareButton}
              icon="delete"
              onPress={() => onDeleteRecording?.(r)}
            />
          </OnlyShow>
        </HorizontalView>
      ))}
    </>
  );
}

export {VoiceRecordingsPreview};
