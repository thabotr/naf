import React from 'react';
import {ImageStyle} from 'react-native';
import {ActivityIndicator, Card} from 'react-native-paper';
import {openFile} from '../fileViewer';
import {FileManager} from '../services/FileManager';
import {OnlyShow} from './Helpers/OnlyShow';
import {OverlayedView} from './Helpers/OverlayedView';

enum IMState {
  FETCHING,
  LOADING,
  ERROR,
  SUCCESS,
}

type Props = {
  source?: string;
  style?: ImageStyle;
  onURI?: (uri: string) => void;
  viewable?: boolean;
  onPress?: () => void;
};

function CardCover({source, style, onURI, viewable, onPress}: Props) {
  const [imgState, setImgState] = React.useState(IMState.FETCHING);
  const [imgSource, setImgSource] = React.useState<string | undefined>(
    undefined,
  );

  React.useEffect(() => {
    if (source) {
      FileManager.getFileURI(source, 'image/jpg')
        .then(uri => {
          if (uri) {
            setImgSource(uri);
            onURI?.(uri);
          }
        })
        .catch(_ => setImgState(IMState.ERROR));
    } else {
      setImgState(IMState.SUCCESS);
    }
  }, []);

  return (
    <Card
      style={style}
      onPress={() => {
        viewable && imgSource && openFile(imgSource);
        onPress?.();
      }}>
      <Card.Cover
        source={{uri: imgSource}}
        style={style}
        onError={_ => setImgState(IMState.ERROR)}
        onLoad={_ => setImgState(IMState.SUCCESS)}
        onLoadStart={() => setImgState(IMState.LOADING)}
      />
      <OverlayedView>
        <OnlyShow
          If={imgState === IMState.LOADING || imgState === IMState.FETCHING}>
          <ActivityIndicator animating />
        </OnlyShow>
      </OverlayedView>
    </Card>
  );
}

export {CardCover};
