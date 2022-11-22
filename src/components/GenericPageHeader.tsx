import {NativeStackHeaderProps} from '@react-navigation/native-stack';
import {Appbar} from 'react-native-paper';
import {StyleSheet} from 'react-native';
import {useTheme} from '../context/theme';
import {OnlyShow} from './Helpers/OnlyShow';

function GenericHeader({
  name,
  props,
  bgColor
}: {
  name: string;
  props: NativeStackHeaderProps;
  bgColor?: string,
}) {
  const {theme} = useTheme();
  const styles = StyleSheet.create({
    header: {
      backgroundColor: bgColor ?? theme.color.primary,
    }
  })
  return (
    <Appbar.Header style={styles.header}>
      <OnlyShow If={!!props.back}>
        <Appbar.BackAction
          color={theme.color.textPrimary}
          style={{borderRadius: 0}}
          onPress={() => {
            props.navigation.goBack();
          }}
        />
      </OnlyShow>
      <Appbar.Content color={theme.color.textPrimary} title={name} />
    </Appbar.Header>
  );
}

export {GenericHeader};
