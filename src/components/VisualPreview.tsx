import {Card} from 'react-native-paper';
import {FileType} from '../types/message';
import { CardCover } from './CardCover';
import {Show} from './Helpers/Show';
import {vidIconOverlay} from './Helpers/VidIconOverlay';

const VisualPreview = ({mFile}: {mFile: FileType}) => {
  return (
    <Card
      style={{
        borderRadius: 0,
        flex: 1,
        height: 80, 
        margin: 1, 
        flexGrow: 1
      }}
    >
      <Show
      component={
        <CardCover style={{flex: 1, height: 80, margin: 1}} source={mFile.uri} viewable/>
      }
      If={mFile.type.split('/')[0] === 'image'}
      ElseShow={
        <>
          <CardCover style={{height: '100%', opacity: 0.8}} source={mFile.uri} viewable/>
          {vidIconOverlay(32)}
        </>
      }
      />
    </Card>
  );
};

export {VisualPreview};
