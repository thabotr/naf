import {useState} from 'react';

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
import { useLoggedInUser } from '../context/user';
import { useChats } from '../context/chat';

const ComposeFloatingActions = () => {
  const {theme} = useTheme();
  const {user} = useLoggedInUser();
  const interlocutor = useChats().activeChat()?.user;
  const [expanded, setExpanded] = useState(false);
  const {saveComposeMsg, composeMsg} = useMessageComposer();
  const {recorderPlayerState} = useAudioRecorderPlayer();

  if(!user || !interlocutor){
    return <></>;
  }

  const pencilClicked = () => {
    saveComposeMsg(msg=>{
      if(!msg){
        return {
          from: user.handle,
          to: interlocutor.handle,
          id: new Date().getTime(),
          files: [],
          voiceRecordings: [],
        }
      }else{
        return msg;
      }
    })
  };

  const recordingOrPaused =
    recorderPlayerState === RecordPlayState.RECORDING ||
    recorderPlayerState === RecordPlayState.RECORDING_PAUSED;

  return (
    <OnlyShow If={!composeMsg && !recordingOrPaused}>
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
