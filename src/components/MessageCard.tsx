import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Card} from 'react-native-paper';

import {useTheme} from '../shared/providers/theme';
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
  const {userProfile} = useLoggedInUser();
  const {theme} = useTheme();
  const fromYou = userProfile.handle === msg.from;
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
            <OnlyShow If={userProfile.handle !== msg.from}>
              <DeliveryStatus msg={msg} />
            </OnlyShow>
            <LiveTimeStamp timestamp={msg.id} sender={fromYou} />
          </HorizontalView>
          <DraftMessageActionsOverlay msg={msg} />
        </View>
      </Card>
    </OnlyShow>
  );
};
