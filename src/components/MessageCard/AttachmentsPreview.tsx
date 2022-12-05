import React, {useState} from 'react';
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
  const {userProfile} = useLoggedInUser();
  const {saveComposeMsg} = useMessageComposer();
  const [expandedPreview, setExpandedPreview] = useState(false);
  const sender = userProfile.handle === msg.from;
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
      color: theme.color.textPrimary,
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
      saveComposeMsg(newmsg => {
        if (newmsg) {
          return {
            ...newmsg,
            files: files,
          };
        }
      });
    }
    setExpandedPreview(false);
  };

  const onDeleteRecording = (vr: VoiceNoteType) => {
    saveComposeMsg(newmsg => {
      if (newmsg) {
        return {
          ...newmsg,
          voiceRecordings: msg.voiceRecordings.filter(v => v.uri !== vr.uri),
        };
      }
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
      <OnlyShow If={msg.files.length > 0}>
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
