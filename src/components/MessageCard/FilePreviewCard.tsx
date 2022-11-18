import {StyleSheet} from 'react-native';
import {Card, List, Paragraph} from 'react-native-paper';
import {useTheme} from '../../context/theme';
import {getFilePath} from '../../file';
import {openFile} from '../../fileViewer';
import {verboseSize} from '../../helper';
import {FileManagerHelper} from '../../services/FileManagerHelper';
import {FileType} from '../../types/message';

const fileType: {[key: string]: string} = {
  'audio/mpeg': 'file-music',
  'application/zip': 'folder-zip',
  'application/pdf': 'file-pdf-box',
};

const FilePreviewCard = ({
  file,
  user = true,
}: {
  file: FileType;
  user?: boolean;
}) => {
  const {theme} = useTheme();

  const openThisFile = async () => {
    if (file.uri.includes('http')) {
      const ext = FileManagerHelper.ExtForMimetypes[file.type];
      const path = await getFilePath(file.uri, ext);
      path && openFile(path);
    } else openFile(file.uri);
  };

  const styles = StyleSheet.create({
    paragraph: {
      color: theme.color.textPrimary,
      textShadowColor: theme.color.textSecondary,
    },
    minimalList: {margin: 0, padding: 0},
    container: {
      flex: 1,
      margin: 1,
      backgroundColor: user
        ? theme.color.userSecondary
        : theme.color.friendSecondary,
    },
  });

  return (
    <Card onPress={openThisFile} style={styles.container}>
      <List.Item
        style={styles.minimalList}
        title={
          <Paragraph style={styles.paragraph}>{`${verboseSize(file.size)} [${
            file.type.split('/')[file.type.split('/').length - 1]
          }]`}</Paragraph>
        }
        description={
          <Paragraph
            style={styles.paragraph}
            numberOfLines={1}>{`${file.name}`}</Paragraph>
        }
        left={props => (
          <List.Icon {...props} icon={fileType[file.type] ?? 'file'} />
        )}
      />
    </Card>
  );
};

export {FilePreviewCard};
