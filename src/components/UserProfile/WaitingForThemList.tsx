import {IconButton, List, Paragraph, TextInput} from 'react-native-paper';
import {StyleSheet, ScrollView} from 'react-native';
import {useTheme} from '../../context/theme';
import {useLoggedInUser} from '../../context/user';
import {HorizontalView} from '../Helpers/HorizontalView';
import {Show} from '../Helpers/Show';

const WaitingForThemList = () => {
  const {user} = useLoggedInUser();
  const {theme} = useTheme();
  return (
    <List.Accordion
      style={{backgroundColor: theme.color.secondary}}
      title="Waiting for them @">
      <List.Item
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: theme.color.secondary,
          marginHorizontal: '5%',
        }}
        title={user?.handle}
        description={'@ Paris | Johannesburg | Doha'}
        left={_ => (
          <IconButton
            icon="delete"
            style={[
              styles.squareButton,
              styles.minimalButton,
              {alignSelf: 'center'},
            ]}
            onPress={() => {}}
          />
        )}
      />
      <HorizontalView
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 5,
          backgroundColor: theme.color.secondary,
        }}>
        <Show
          component={
            <>
              <IconButton icon="plus" style={styles.minimalButton} />
              <Paragraph
                style={{
                  color: theme.color.textPrimary,
                  shadowColor: theme.color.textSecondary,
                }}>
                Wait for someone
              </Paragraph>
            </>
          }
          If={true}
          ElseShow={
            <>
              <IconButton
                icon="delete"
                style={styles.squareButton}
                onPress={() => {}}
              />
              <HorizontalView style={{width: '83%', paddingVertical: 2}}>
                <TextInput label={'wait for...'} style={{width: 150}} />
                <Paragraph
                  style={{
                    alignSelf: 'center',
                    color: theme.color.textPrimary,
                    shadowColor: theme.color.textSecondary,
                  }}>
                  @
                </Paragraph>
                <ScrollView horizontal>
                  <TextInput
                    label={'first place'}
                    value="paris"
                    style={{width: 150, marginHorizontal: 1}}
                  />
                  <TextInput
                    label={'second place'}
                    value="johannesburg"
                    style={{width: 150, marginHorizontal: 1}}
                  />
                  <TextInput
                    label={'third place'}
                    value="doha"
                    style={{width: 150, marginHorizontal: 1}}
                  />
                </ScrollView>
              </HorizontalView>
              <IconButton
                icon="content-save"
                style={styles.squareButton}
                onPress={() => {}}
              />
            </>
          }
        />
      </HorizontalView>
    </List.Accordion>
  );
};

const styles = StyleSheet.create({
  squareButton: {
    borderRadius: 0,
  },
  minimalButton: {
    margin: 0,
    padding: 0,
  },
  placeText: {
    width: '33%',
    marginHorizontal: 1,
  },
});

export {WaitingForThemList};
