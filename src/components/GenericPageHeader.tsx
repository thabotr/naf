import {NativeStackHeaderProps} from '@react-navigation/native-stack';
import {Appbar} from 'react-native-paper';
import {useTheme} from '../context/theme';
import {OnlyShow} from './Helpers/OnlyShow';

function GenericHeader({
  name,
  props,
}: {
  name: string;
  props: NativeStackHeaderProps;
}) {
  const {theme} = useTheme();
  return (
    <Appbar.Header style={{backgroundColor: theme.color.primary}}>
      <OnlyShow If={!!props.back}>
        <Appbar.BackAction
          color={theme.color.textPrimary}
          style={{borderRadius: 0}}
          onPress={() => {
            props.navigation.goBack();
          }}
        />
      </OnlyShow>
      <Appbar.Content title={name} />
    </Appbar.Header>
  );
}

export {GenericHeader};
