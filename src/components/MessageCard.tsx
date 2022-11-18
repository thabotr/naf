import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Card} from 'react-native-paper';

import {useTheme} from '../context/theme';
import {Message} from '../types/message';
import {useLoggedInUser} from '../context/user';
import {HorizontalView} from './Helpers/HorizontalView';
import {ExpandableParagraph} from './MessageCard/ExpandableParagraph';
import {OnlyShow} from './Helpers/OnlyShow';
import {DraftMessageActionsOverlay} from './MessageCard/DraftMessageActionsOverlay';
import {AttachmentsPreview} from './MessageCard/AttachmentsPreview';
import {DeliveryStatus} from './MessageCard/DeliveryStatus';
import {LiveTimeStamp} from './MessageCard/LiveTimeStamp';

export const MessageCard = ({msg}: {msg: Message}) => {
  const {user} = useLoggedInUser();
  const {theme} = useTheme();
  const fromYou = user?.handle === msg.from;
  const styles = StyleSheet.create({
    messageContainer: {
      backgroundColor: fromYou
        ? theme.color.userPrimary
        : theme.color.friendPrimary,
      margin: 2,
    },
    messageBody: {padding: 7},
  });

  return (
    <OnlyShow
      If={!!msg.text || !!msg.files.length || !!msg.voiceRecordings.length}>
      <Card mode="outlined" style={styles.messageContainer}>
        <View style={styles.messageBody}>
          <ExpandableParagraph text={msg.text} />
          <AttachmentsPreview msg={msg} />
          <HorizontalView>
            <DeliveryStatus msg={msg} />
            <LiveTimeStamp timestamp={msg.timestamp} sender={fromYou} />
          </HorizontalView>
          <DraftMessageActionsOverlay msg={msg} />
        </View>
      </Card>
    </OnlyShow>
  );
};
