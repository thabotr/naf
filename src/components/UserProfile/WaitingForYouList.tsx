import {
  Button,
  IconButton,
  List,
  Paragraph,
  TextInput,
} from 'react-native-paper';
import {StyleSheet, View, Pressable} from 'react-native';
import {useTheme} from '../../context/theme';
import {useLoggedInUser} from '../../context/user';
import {HorizontalView} from '../Helpers/HorizontalView';
import {Image} from '../Image';
import {Show} from '../Helpers/Show';
import {
  User,
  WaitAtType,
  WaiterType,
  WaitingForYouType,
} from '../../types/user';
import {verboseDuration, verboseTime} from '../../helper';
import {useState} from 'react';
import {deduplicatedConcat} from '../../utils/deduplicatedConcat';

const emptyWFY: WaitAtType = {
  createdAt: 0,
  expiresAt: 0,
  locationAliasA: '',
  locationAliasB: '',
  locationAliasC: '',
};

const WaitingForYouList = () => {
  const {userProfile, updateProfile} = useLoggedInUser();
  const {theme} = useTheme();
  const [addingWFM, setAddingWFM] = useState(false);
  const [wAtData, setWAtData] = useState(emptyWFY);

  const dismissWaitingUser = (wfy: WaitingForYouType, wt: WaiterType) => {};
  const connectWWaitingUser = (wfy: WaitingForYouType, wt: WaiterType) => {};
  const deleteWFY = (wfy: WaitingForYouType) => {
    updateProfile(p => {
      return {
        ...p,
        waitingForYou: p.waitingForYou.filter(
          ewfy =>
            !(
              ewfy.at.locationAliasA === wfy.at.locationAliasA &&
              ewfy.at.locationAliasB === wfy.at.locationAliasB &&
              ewfy.at.locationAliasC === wfy.at.locationAliasC
            ),
        ),
      };
    });
  };
  const discardWFT = () => {
    setWAtData(emptyWFY);
    setAddingWFM(false);
  };
  const saveWFY = () => {
    //TODO send remote
    const timestamp = new Date().getTime() / 1000;
    updateProfile(p => {
      return {
        ...p,
        waitingForYou: deduplicatedConcat(
          p.waitingForYou,
          [
            {
              at: {
                ...wAtData,
                createdAt: timestamp,
                expiresAt: timestamp + 60 * 60 * 24,
              },
              waiters: [],
            },
          ],
          (w1, w2) =>
            w1.at.locationAliasA === w2.at.locationAliasA &&
            w1.at.locationAliasB === w2.at.locationAliasB &&
            w1.at.locationAliasC === w2.at.locationAliasC,
        ),
      };
    });
    discardWFT();
  };
  const setLocation = (location: 'A' | 'B' | 'C', value: string) => {
    const v = value.trim();
    setWAtData(wAtData => {
      switch (location) {
        case 'A':
          return {
            ...wAtData,
            locationAliasA: v,
          };
        case 'B':
          return {
            ...wAtData,
            locationAliasB: v,
          };
        default:
          return {
            ...wAtData,
            locationAliasC: v,
          };
      }
    });
  };

  const allFieldsFilled =
    !!wAtData.locationAliasA &&
    !!wAtData.locationAliasB &&
    !!wAtData.locationAliasC;

  return (
    <List.Accordion
      style={{backgroundColor: theme.color.secondary}}
      title="Waiting for you">
      <View>
        {userProfile.waitingForYou.map(wfy => (
          <HorizontalView
            key={`${wfy.at.locationAliasA}-${wfy.at.locationAliasB}-${wfy.at.locationAliasC}`}>
            <IconButton
              icon="delete"
              style={styles.squareButton}
              onPress={() => deleteWFY(wfy)}
            />
            <List.Accordion
              style={{
                width: 400,
                padding: 0,
                backgroundColor: theme.color.secondary,
              }}
              title={`@ ${wfy.at.locationAliasA} | ${wfy.at.locationAliasB} | ${wfy.at.locationAliasC}`}
              titleStyle={{fontWeight: 'bold'}}
              description={`created ${verboseTime(
                wfy.at.createdAt,
              )}\nexpires @ ${new Date(
                wfy.at.expiresAt * 1000,
              ).toLocaleTimeString()}, ${new Date(
                wfy.at.expiresAt * 1000,
              ).toDateString()}`}>
              {wfy.waiters.map(w => (
                <List.Item
                  left={_ => (
                    <Image
                      source={w.user.avatarURI}
                      style={{width: 50, height: 50}}
                      viewable
                    />
                  )}
                  key={w.user.handle}
                  style={{width: '100%'}}
                  titleStyle={{
                    color: theme.color.textPrimary,
                    shadowColor: theme.color.textSecondary,
                  }}
                  title={w.user.handle}
                  description={`${w.user.name} ${w.user.surname} [${
                    w.user.initials
                  }] arrived @ ${verboseTime(w.arrivedAt)}`}
                  right={_ => (
                    <>
                      <IconButton
                        icon="cancel"
                        color={theme.color.textPrimary}
                        style={styles.squareButton}
                        onPress={() => dismissWaitingUser(wfy, w)}
                      />
                      <IconButton
                        icon="account-plus"
                        color={theme.color.textPrimary}
                        style={styles.squareButton}
                        onPress={() => connectWWaitingUser(wfy, w)}
                      />
                    </>
                  )}
                />
              ))}
            </List.Accordion>
          </HorizontalView>
        ))}
        <Pressable>
          <HorizontalView
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 10,
            }}>
            <Show
              component={
                <Button
                  icon="plus"
                  onPress={() => setAddingWFM(true)}
                  color={theme.color.textPrimary}
                  uppercase={false}
                  style={{
                    backgroundColor: theme.color.secondary,
                  }}>
                  find me @
                </Button>
              }
              If={!addingWFM}
              ElseShow={
                <>
                  <IconButton
                    icon="delete"
                    style={styles.squareButton}
                    onPress={discardWFT}
                  />
                  <HorizontalView style={{flex: 1, paddingVertical: 2}}>
                    <TextInput
                      label={'first place'}
                      onEndEditing={e => setLocation('A', e.nativeEvent.text)}
                      style={{flex: 1}}
                    />
                    <TextInput
                      label={'second place'}
                      onEndEditing={e => setLocation('B', e.nativeEvent.text)}
                      style={{flex: 1}}
                    />
                    <TextInput
                      label={'third place'}
                      onEndEditing={e => setLocation('C', e.nativeEvent.text)}
                      style={{flex: 1}}
                    />
                  </HorizontalView>
                  <IconButton
                    icon="content-save"
                    onPress={saveWFY}
                    disabled={!allFieldsFilled}
                    style={styles.squareButton}
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
