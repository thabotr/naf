import React from 'react';
import {ToastAndroid, View} from 'react-native';
import {Card, Paragraph, IconButton, Chip} from 'react-native-paper';

import {useTheme} from '../context/theme';
import {Message, FileType} from '../types/message';
import {VoiceNoteCard} from './VoiceNoteCard';
import {useMessageComposer} from '../context/messageEditor';
import {useLoggedInUser} from '../context/user';
import {verboseTime} from '../helper';
import {useChats} from '../context/chat';
import {HorizontalView} from './Helpers/HorizontalView';
import {ImagePreviewCard} from './ImagePreviewCard';
import {VidPreviewCard} from './VidPreviewCard';
import {ExpandableParagraph} from './ExpandableParagraph';
import {FilePreviewCard} from './FilePreviewCard';
import {MessageFilesPreview} from './MessageFilesPreview';
import {Show} from './Helpers/Show';
import {OverlayedView} from './Helpers/OverlayedView';
import {OnlyShow} from './Helpers/OnlyShow';

export enum DeliveryStatus {
  ERROR,
  UNSEEN,
  SEEN,
  NONE,
}

export const MessageCard = ({msg}: {msg: Message}) => {
  const {user} = useLoggedInUser();
  const {deleteChatMessages, addChatMessages} = useChats();
  const {theme} = useTheme();
  const {saveComposeMessage, setComposeOn, showTextInputOn} =
    useMessageComposer();
  const [previewingFiles, setPreviewingFiles] = React.useState(false);

  const sender = user?.handle === msg.from;

  const visuals = msg.files.filter(
    f => f.type.split('/')[0] === 'image' || f.type.split('/')[0] === 'video',
  );
  const otherFiles = msg.files.filter(
    f => f.type.split('/')[0] !== 'image' && f.type.split('/')[0] !== 'video',
  );

  const renderVisualFiles = () => {
    return (
      <HorizontalView>
        {visuals.slice(0, 4).map((vz: FileType, i: number) => (
          <Show
            key={vz.uri}
            component={<ImagePreviewCard source={vz} />}
            If={vz.type.split('/')[0] === 'image'}
            ElseShow={<VidPreviewCard iconSize={64} source={vz} />}
          />
        ))}
      </HorizontalView>
    );
  };

  const renderOtherFiles = () => {
    return (
      <>
        <HorizontalView>
          {otherFiles.slice(0, 2).map(f => (
            <FilePreviewCard key={f.uri} file={f} user={sender} />
          ))}
        </HorizontalView>
        <OnlyShow If={otherFiles.slice(2).length + visuals.slice(4).length > 0}>
          <Chip
            onPress={() => setPreviewingFiles(true)}
            style={{
              borderRadius: 0,
              margin: 2,
              backgroundColor: sender
                ? theme.color.userSecondary
                : theme.color.friendSecondary,
            }}
            icon="file-multiple">
            <Paragraph
              style={{
                color: theme.color.textPrimary,
                textShadowColor: theme.color.textSecondary,
              }}>
              Preview all {otherFiles.slice(2).length + visuals.slice(4).length}{' '}
              attachaments
            </Paragraph>
          </Chip>
        </OnlyShow>
      </>
    );
  };

  const senderOrFriendColor = sender
    ? theme.color.userPrimary
    : theme.color.friendPrimary;

  const deleteThisMessage = () => {
    deleteChatMessages([{toHandle: msg.to, fromHandle: msg.from, id: msg.id}]);
  };
  const deliveryStatuses = new Map<
    DeliveryStatus,
    {icon: string; message: string}
  >([
    [
      DeliveryStatus.ERROR,
      {icon: 'message-alert', message: 'message delivery failed'},
    ],
    [DeliveryStatus.SEEN, {icon: 'eye', message: 'message viewed'}],
    [DeliveryStatus.UNSEEN, {icon: 'eye-off', message: 'message delivered'}],
    [DeliveryStatus.NONE, {icon: 'circle-small', message: 'message status'}],
  ]);

  const displayMessageStatus = () => {
    ToastAndroid.show(
      deliveryStatuses.get(msg.status ?? DeliveryStatus.NONE)?.message ?? '',
      3000,
    );
  };

  const draftOverlay = () => {
    return (
      <OnlyShow If={msg.draft}>
        <OverlayedView
          style={{
            backgroundColor: theme.color.userSecondary,
            margin: 3,
            borderRadius: 3,
            opacity: 0.8,
          }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              backgroundColor: theme.color.primary,
            }}>
            <IconButton
              size={30}
              style={{
                backgroundColor: theme.color.userPrimary,
                borderRadius: 0,
                margin: 0,
              }}
              icon="delete"
              onPress={deleteThisMessage}
            />
            <IconButton
              size={30}
              style={{
                backgroundColor: theme.color.userPrimary,
                borderRadius: 0,
                margin: 0,
              }}
              icon="pencil"
              onPress={() => {
                saveComposeMessage(msg);
                deleteThisMessage();
                setComposeOn(true);
                showTextInputOn(true);
              }}
            />
            <IconButton
              size={30}
              style={{
                backgroundColor: theme.color.userPrimary,
                borderRadius: 0,
                margin: 0,
              }}
              icon="send"
              onPress={() => {
                // TODO sync with remote
                const timestamp = new Date().getTime();
                addChatMessages([
                  {
                    ...msg,
                    id: timestamp.toString(),
                    timestamp: timestamp / 1_000,
                    draft: undefined,
                  },
                ]);
                deleteThisMessage();
              }}
            />
          </View>
        </OverlayedView>
      </OnlyShow>
    );
  };

  return (
    <>
      <OnlyShow If={previewingFiles}>
        <MessageFilesPreview
          msg={msg}
          onDismiss={() => setPreviewingFiles(false)}
        />
      </OnlyShow>
      <OnlyShow If={!!msg.text || !!msg.files.length}>
        <Card
          mode="outlined"
          style={{backgroundColor: senderOrFriendColor, margin: 2}}>
          <View style={{padding: 7}}>
            <OnlyShow If={!!msg.text}>
              <ExpandableParagraph text={msg.text ?? ''} />
            </OnlyShow>
            {msg.voiceRecordings.map(vr => (
              <VoiceNoteCard
                playId={`${msg.from}-${msg.to}-${msg.id}-${vr.uri}`}
                key={vr.uri}
                file={vr}
                user={sender}
              />
            ))}
            {renderVisualFiles()}
            {renderOtherFiles()}

            <HorizontalView>
              <OnlyShow If={sender && !!msg.status}>
                <IconButton
                  size={15}
                  onPress={() => {}}
                  onLongPress={displayMessageStatus}
                  icon={
                    deliveryStatuses.get(msg.status ?? DeliveryStatus.NONE)
                      ?.icon ?? 'circle-small'
                  }
                  style={{padding: 0, margin: 0, borderRadius: 0}}
                />
              </OnlyShow>
              <LiveTimeStamp timestamp={msg.timestamp} sender={sender} />
            </HorizontalView>
            {draftOverlay()}
          </View>
        </Card>
      </OnlyShow>
    </>
  );
};

const LiveTimeStamp = ({
  timestamp,
  sender,
}: {
  timestamp?: number;
  sender?: boolean;
}) => {
  const {theme} = useTheme();
  // TODO update time stamp live
  return (
    <OnlyShow If={!!timestamp}>
      <Paragraph
        style={{
          alignSelf: 'flex-start',
          paddingHorizontal: 10,
          color: theme.color.textPrimary,
          textShadowColor: theme.color.textSecondary,
          backgroundColor: sender
            ? theme.color.userSecondary
            : theme.color.friendSecondary,
          borderRadius: 5,
          marginTop: 2,
          opacity: 0.5,
        }}>
        {verboseTime(timestamp)}
      </Paragraph>
    </OnlyShow>
  );
};
