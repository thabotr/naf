import React from 'react';
import {StyleSheet} from 'react-native';
import {Chip, Paragraph} from 'react-native-paper';
import {useMessageComposer} from '../../context/messageEditor';
import {useTheme} from '../../context/theme';
import {useLoggedInUser} from '../../context/user';
import {FileType, Message, VoiceNoteType} from '../../types/message';
import {LRFilter} from '../../utils/lrFilter';
import {FilePreviewCard} from './FilePreviewCard';
import {HorizontalView} from '../Helpers/HorizontalView';
import {OnlyShow} from '../Helpers/OnlyShow';
import {VisualPreview} from './VisualPreview';
import {ViewAllFilesDialog} from './ViewAllFilesDialog';
import {VoiceRecordingsPreview} from './VoiceRecordingsPreview';

function AttachmentsPreview({
  msg,
  composing,
}: {
  msg: Message;
  composing?: boolean;
}) {
  const {theme} = useTheme();
  const {user} = useLoggedInUser();
  const {saveComposeMessage, message: composedMsg} = useMessageComposer();
  const [expandedPreview, setExpandedPreview] = React.useState(false);
  const sender = user?.handle === msg.from;
  const {truthy: visuals, falsey: nonVisuals} = LRFilter(
    msg.files,
    f => f.type.split('/')[0] === 'image' || f.type.split('/')[0] === 'video',
  );

  const styles = StyleSheet.create({
    chip: {
      borderRadius: 0,
      margin: 2,
      backgroundColor: sender
        ? theme.color.userSecondary
        : theme.color.friendSecondary,
    },
    paragraph: {
      color: theme.color.textPrimary,
      textShadowColor: theme.color.textSecondary,
    },
  });

  const previewAllFiles = () => {
    setExpandedPreview(true);
  };

  const onExpandedViewDismiss = (files: FileType[]) => {
    if (composing) {
      saveComposeMessage({
        ...composedMsg,
        files: files,
      });
    }
    setExpandedPreview(false);
  };

  const onDeleteRecording = (vr: VoiceNoteType) => {
    saveComposeMessage({
      ...composedMsg,
      voiceRecordings: composedMsg.voiceRecordings.filter(
        mvc => mvc.uri !== vr.uri,
      ),
    });
  };

  return (
    <>
      <ViewAllFilesDialog
        msg={msg}
        visible={expandedPreview}
        composing={composing}
        onDismiss={onExpandedViewDismiss}
      />
      <VoiceRecordingsPreview
        message={msg}
        onDeleteRecording={composing ? onDeleteRecording : undefined}
      />
      <HorizontalView>
        {visuals.slice(0, 4).map(vz => (
          <VisualPreview key={vz.uri} mFile={vz} />
        ))}
      </HorizontalView>
      <HorizontalView>
        {nonVisuals.slice(0, 2).map(f => (
          <FilePreviewCard key={f.uri} file={f} user={sender} />
        ))}
      </HorizontalView>
      <OnlyShow If={nonVisuals.slice(2).length + visuals.slice(4).length > 0}>
        <Chip
          onPress={previewAllFiles}
          style={styles.chip}
          icon="file-multiple">
          <Paragraph style={styles.paragraph}>
            Preview all {msg.files.length} attachaments
          </Paragraph>
        </Chip>
      </OnlyShow>
    </>
  );
}

export {AttachmentsPreview};
