import {IconButton, List, Paragraph, TextInput} from 'react-native-paper';
import {StyleSheet, View, Pressable} from 'react-native';
import {useTheme} from '../../context/theme';
import {useLoggedInUser} from '../../context/user';
import {HorizontalView} from '../Helpers/HorizontalView';
import {Image} from '../Image';
import {Show} from '../Helpers/Show';

const WaitingForYouList = () => {
  const {user} = useLoggedInUser();
  const {theme} = useTheme();
  return (
    <List.Accordion
      style={{backgroundColor: theme.color.secondary}}
      title="Waiting for you @">
      <View>
        <HorizontalView>
          <IconButton
            icon="delete"
            style={styles.squareButton}
            onPress={() => {}}
          />
          <List.Accordion
            style={{
              width: 400,
              padding: 0,
              backgroundColor: theme.color.secondary,
            }}
            title={'Paris | Johannesburg | Doha'}>
            <List.Item
              left={_ => (
                <Image
                  source={user?.avatarURI}
                  style={{width: 50, height: 50}}
                  viewable
                />
              )}
              style={{width: '100%'}}
              titleStyle={{
                color: theme.color.textPrimary,
                shadowColor: theme.color.textSecondary,
              }}
              title={user?.handle}
              description={`${user?.name} ${user?.surname} [${user?.initials}]`}
              right={_ => (
                <>
                  <IconButton
                    icon="cancel"
                    color={theme.color.textPrimary}
                    style={styles.squareButton}
                    onPress={() => {}}
                  />
                  <IconButton
                    icon="account-plus"
                    color={theme.color.textPrimary}
                    style={styles.squareButton}
                    onPress={() => {}}
                  />
                </>
              )}
            />
          </List.Accordion>
        </HorizontalView>
        <Pressable>
          <HorizontalView
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 5,
            }}>
            <Show
              component={
                <>
                  <IconButton icon="plus" style={{margin: 0, padding: 0}} />
                  <Paragraph
                    style={{
                      color: theme.color.textPrimary,
                      shadowColor: theme.color.textSecondary,
                    }}>
                    find me @
                  </Paragraph>
                </>
              }
              If={!true}
              ElseShow={
                <>
                  <IconButton
                    icon="delete"
                    style={styles.squareButton}
                    onPress={() => {}}
                  />
                  <HorizontalView style={{width: '83%', paddingVertical: 2}}>
                    <TextInput
                      label={'first place'}
                      value="paris"
                      style={styles.placeText}
                    />
                    <TextInput
                      label={'second place'}
                      value="johannesburg"
                      style={styles.placeText}
                    />
                    <TextInput
                      label={'third place'}
                      value="doha"
                      style={styles.placeText}
                    />
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
        </Pressable>
      </View>
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

export {WaitingForYouList};
