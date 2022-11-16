import React from 'react';
import {ImageStyle} from 'react-native';
import {ActivityIndicator, Card} from 'react-native-paper';
import {FileManager} from '../services/FileManager';
import {OnlyShow, OverlayedView} from './helper';
import {IMState} from './image';

export type Props = {
  source?: string;
  style?: ImageStyle;
  onURI?: (uri: string)=>void;
};

function CardCover({source, style, onURI}: Props) {
  const [imgState, setImgState] = React.useState(IMState.FETCHING);
  const [imgSource, setImgSource] = React.useState<string | undefined>(
    undefined,
  );

  React.useEffect(() => {
    if (source) {
      FileManager.getFileURI(source)
        .then(uri => {
          if(uri){
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
    <>
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
    </>
  );
}

export {CardCover};
