import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Card, IconButton} from 'react-native-paper';
import {FileType} from '../../types/message';
import {Image} from '../Image';
import {OverlayedView} from '../Helpers/OverlayedView';
import {Show} from '../Helpers/Show';
import {useTheme} from '../../shared/providers/theme';

const VisualPreview = ({mFile}: {mFile: FileType}) => {
  const {theme} = useTheme();
  const styles = StyleSheet.create({
    container: {
      borderRadius: 0,
      flex: 1,
      height: 120,
      margin: 1,
      flexGrow: 1,
      backgroundColor: theme.color.secondary,
    },
    image: {flex: 1, margin: 1, backgroundColor: theme.color.secondary},
    vidIconContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      backgroundColor: theme.color.secondary,
    },
    vidThumbnail: {height: '100%', width: '100%', opacity: 0.6},
  });
  return (
    <Card style={styles.container}>
      <Show
        component={<Image style={styles.image} source={mFile.uri} viewable />}
        If={mFile.type.split('/')[0] === 'image'}
        ElseShow={
          <>
            <View style={styles.vidIconContainer}>
              <IconButton size={32} icon="play-circle-outline" />
            </View>
            <OverlayedView>
              <Image style={styles.vidThumbnail} source={mFile} viewable />
            </OverlayedView>
          </>
        }
      />
    </Card>
  );
};

export {VisualPreview};
