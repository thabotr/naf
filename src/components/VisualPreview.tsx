import { Card } from "react-native-paper";
import { openFile } from "../fileViewer";
import { FileType } from "../types/message";
import { Show } from "./Helpers/Show";
import { vidIconOverlay } from "./Helpers/VidIconOverlay";
import { Image } from "./image";

const VisualPreview = ({mFile}: {mFile: FileType}) => {
  return (
    <Card
      onPress={() => openFile(mFile.uri)}
      elevation={0}
      style={{borderRadius: 0, flex: 1, height: 80, margin: 1, flexGrow: 1}}>
      <Show
        component={
          <Image style={{flex: 1, height: 80, margin: 1}} url={mFile.uri} />
        }
        If={mFile.type.split('/')[0] === 'image'}
        ElseShow={
          <>
            <Image style={{height: '100%', opacity: 0.8}} url={mFile.uri} />
            {vidIconOverlay(32)}
          </>
        }
      />
    </Card>
  );
};

export {VisualPreview};