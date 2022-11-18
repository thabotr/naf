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
  return (
    <>
      {message.voiceRecordings.map(r => (
        <HorizontalView style={{alignItems: 'center'}} key={r.uri}>
          <VoiceNoteCard
            playId={`${message.from}-${message.to}-${message.id}-${r.uri}`}
            style={{flex: 1}}
            file={r}
            fromYou
          />
          <OnlyShow If={!!onDeleteRecording}>
            <IconButton
              style={{
                backgroundColor: theme.color.secondary,
                borderRadius: 0,
              }}
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
