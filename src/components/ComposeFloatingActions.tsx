import React from 'react';

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

const ComposeFloatingActions = () => {
  const {theme} = useTheme();
  const [expanded, setExpanded] = React.useState(false);
  const {composing, setComposeOn, showTextInputOn} = useMessageComposer();
  const {recorderPlayerState} = useAudioRecorderPlayer();

  const pencilClicked = () => {
    setComposeOn(true);
    showTextInputOn(true);
  };

  const recordingOrPaused =
    recorderPlayerState === RecordPlayState.RECORDING ||
    recorderPlayerState === RecordPlayState.RECORDING_PAUSED;

  return (
    <OnlyShow If={!composing && !recordingOrPaused}>
      <HorizontalView
        style={{
          padding: 0,
          elevation: 2,
          borderRadius: 3,
          position: 'absolute',
          right: 10,
          bottom: 50,
          backgroundColor: theme.color.userPrimary,
        }}>
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
    </OnlyShow>
  );
};

export {ComposeFloatingActions};
