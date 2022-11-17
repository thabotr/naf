import { Card } from "react-native-paper";
import { getFilePath } from "../file";
import { openFile } from "../fileViewer";
import { FileManagerHelper } from "../services/FileManagerHelper";
import { FileType } from "../types/message";
import { vidIconOverlay } from "./Helpers/VidIconOverlay";

const VidPreviewCard = ({
  iconSize = 64,
  source,
}: {
  iconSize?: number;
  source: FileType;
}) => {
  const openVid = async () => {
    if (source.uri.includes('http')) {
      const ext = FileManagerHelper.ExtForMimetypes[source.type];
      const path = await getFilePath(source.uri, ext);
      path && openFile(path);
    } else openFile(source.uri);
  };
  return (
    <Card onPress={openVid} style={{flexGrow: 1, margin: 1}}>
      <Card.Cover style={{opacity: 0.9}} source={source} />
      {vidIconOverlay(iconSize)}
    </Card>
  );
};

export {VidPreviewCard};