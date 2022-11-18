import {View} from 'react-native';
import {Card, IconButton} from 'react-native-paper';
import {FileType} from '../types/message';
import {CardCover} from './CardCover';
import {OverlayedView} from './Helpers/OverlayedView';
import {Show} from './Helpers/Show';

const VisualPreview = ({mFile}: {mFile: FileType}) => {
  return (
    <Card
      style={{
        borderRadius: 0,
        flex: 1,
        height: 120,
        margin: 1,
        flexGrow: 1,
      }}>
      <Show
        component={
          <CardCover style={{flex: 1, margin: 1}} source={mFile.uri} viewable />
        }
        If={mFile.type.split('/')[0] === 'image'}
        ElseShow={
          <>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
              }}>
              <IconButton size={32} icon="play-circle-outline" />
            </View>
            <OverlayedView>
              <CardCover
                style={{height: '100%', width: '100%', opacity: 0.6}}
                source={mFile}
                viewable
              />
            </OverlayedView>
          </>
        }
      />
    </Card>
  );
};

export {VisualPreview};
