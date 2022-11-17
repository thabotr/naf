import { ViewStyle } from "react-native";
import { Card } from "react-native-paper";
import { getFilePath } from "../file";
import { openFile } from "../fileViewer";
import { FileManagerHelper } from "../services/FileManagerHelper";
import { FileType } from "../types/message";

const ImagePreviewCard = ({source, style}: {source: FileType, style?: ViewStyle}) => {
  const openImage = async () => {
    if (source.uri.includes('http')) {
      const ext = FileManagerHelper.ExtForMimetypes[source.type];
      const path = await getFilePath(source.uri, ext);
      path && openFile(path);
    } else openFile(source.uri);
  };
  return (
    <Card onPress={openImage} style={{margin: 1, flexGrow: 1,...style}}>
      <Card.Cover source={source} />
    </Card>
  );
};

export {ImagePreviewCard};