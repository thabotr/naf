import React, {useState} from 'react';

import {useTheme} from '../context/theme';
import {useMessageComposer} from '../context/messageEditor';
import {
  RecordPlayState,
  useAudioRecorderPlayer,
} from '../providers/AudioRecorderPlayer';
import {ExtendedComposeFABs} from './ComposeFloatingActions/ExtendedComposeFABs';
import {ComposeFAB} from './ComposeFloatingActions/ComposeFAB';
import {HorizontalView} from './Helpers/HorizontalView';
import {OnlyShow} from './Helpers/OnlyShow';
import {Show} from './Helpers/Show';
import {useLoggedInUser} from '../context/user';
import {useChats} from '../context/chat';
import {MutexContextProvider} from '../providers/MutexProvider';
import {StyleSheet} from 'react-native';

const ComposeFloatingActions = () => {
  const {theme} = useTheme();
  const {userProfile} = useLoggedInUser();
  const interlocutor = useChats().activeChat()?.user;
  const [expanded, setExpanded] = useState(false);
  const {saveComposeMsg, composeMsg} = useMessageComposer();
  const {recorderPlayerState} = useAudioRecorderPlayer();

  if (!interlocutor) {
    return <></>;
  }

  const pencilClicked = () => {
    saveComposeMsg(msg => {
      if (!msg) {
        return {
          from: userProfile.handle,
          to: interlocutor.handle,
          id: new Date().getTime(),
          files: [],
          voiceRecordings: [],
        };
      } else {
        return msg;
      }
    });
  };

  const recordingOrPaused =
    recorderPlayerState === RecordPlayState.RECORDING ||
    recorderPlayerState === RecordPlayState.RECORDING_PAUSED;

  const styles = StyleSheet.create({
    floating: {
      padding: 0,
      elevation: 2,
      borderRadius: 3,
      position: 'absolute',
      right: 10,
      bottom: 50,
      backgroundColor: theme.color.userPrimary,
    },
  });

  return (
    <OnlyShow If={!composeMsg && !recordingOrPaused}>
      <MutexContextProvider>
        <HorizontalView style={styles.floating}>
          <Show
            component={
              <ComposeFAB
                onLongPress={() => setExpanded(true)}
                onPress={pencilClicked}
              />
            }
            If={!expanded}
            ElseShow={<ExtendedComposeFABs onBack={() => setExpanded(false)} />}
          />
        </HorizontalView>
      </MutexContextProvider>
    </OnlyShow>
  );
};

export {ComposeFloatingActions};
