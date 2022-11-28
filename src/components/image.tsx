import {useState, useEffect} from 'react';
import {ImageStyle, TouchableOpacity, View} from 'react-native';
import {ActivityIndicator, Card} from 'react-native-paper';
import {useLoggedInUser} from '../context/user';
import {openFile} from '../fileViewer';
import {FileManager} from '../services/FileManager';
import {FileType} from '../types/message';
import {OnlyShow} from './Helpers/OnlyShow';
import {OverlayedView} from './Helpers/OverlayedView';

enum IMState {
  FETCHING,
  LOADING,
  ERROR,
  SUCCESS,
}

type Props = {
  source?: string | FileType;
  style?: ImageStyle;
  onURI?: (uri: string) => void;
  viewable?: boolean;
  onPress?: () => void;
  alt?: React.ReactNode;
};

function Image({source, style, onURI, viewable, onPress, alt}: Props) {
  const [imgState, setImgState] = useState(IMState.FETCHING);
  const [imgSource, setImgSource] = useState<string | undefined>(undefined);
  const {userProfile} = useLoggedInUser();

  useEffect(() => {
    const link = typeof source === 'string' ? source : source?.uri;
    const mimeType = typeof source === 'string' ? 'image/jpeg' : source?.type;
    if (link) {
      FileManager.getFileURI(link, mimeType ?? 'image/jpg', {
        token: userProfile.token,
        handle: userProfile.handle,
        // interlocutor_handle: 
      })
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
  }, [source]);

  if (imgState === IMState.ERROR && alt) {
    return <>{alt}</>;
  }

  const content = () => (
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

  if (viewable || onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={style}
        onPress={() => {
          viewable && imgSource && openFile(imgSource);
          onPress?.();
        }}>
        {content()}
      </TouchableOpacity>
    );
  }

  return <View style={style}>{content()}</View>;
}

export {Image};
