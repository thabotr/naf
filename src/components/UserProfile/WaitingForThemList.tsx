import {
  Button,
  IconButton,
  List,
  Paragraph,
  TextInput,
} from 'react-native-paper';
import {StyleSheet, ScrollView} from 'react-native';
import {useTheme} from '../../context/theme';
import {useLoggedInUser} from '../../context/user';
import {HorizontalView} from '../Helpers/HorizontalView';
import {Show} from '../Helpers/Show';
import {verboseTime} from '../../helper';
import {WaitingForThemType} from '../../types/user';
import {useState} from 'react';
import {deduplicatedConcat} from '../../utils/deduplicatedConcat';

const emptyWFT = {
  createdAt: 0,
  expiresAt: 0,
  handleForAwaited: '',
  locationAliasA: '',
  locationAliasB: '',
  locationAliasC: '',
};

const WaitingForThemList = () => {
  const {userProfile, updateProfile} = useLoggedInUser();
  const {theme} = useTheme();
  const [adding, setAdding] = useState(false);
  const [wftData, setWftData] = useState<WaitingForThemType>(emptyWFT);

  const deleteWFT = (wft: WaitingForThemType) => {
    // TODO send remote delete
    updateProfile(p => {
      return {
        ...p,
        waitingForThem: p.waitingForThem.filter(
          w =>
            !(
              w.handleForAwaited === wft.handleForAwaited &&
              w.locationAliasA === wft.locationAliasA &&
              w.locationAliasB === wft.locationAliasB &&
              w.locationAliasC === wft.locationAliasC
            ),
        ),
      };
    });
  };
  const setUser = (handle: string) => {
    setWftData(wftData => {
      return {
        ...wftData,
        handleForAwaited: handle,
      };
    });
  };

  const discardWFT = () => {
    setAdding(false);
    setWftData(emptyWFT);
  };

  const setLocation = (location: 'A' | 'B' | 'C', value: string) => {
    const v = value.trim();
    setWftData(wftData => {
      switch (location) {
        case 'A':
          return {
            ...wftData,
            locationAliasA: v,
          };
        case 'B':
          return {
            ...wftData,
            locationAliasB: v,
          };
        default:
          return {
            ...wftData,
            locationAliasC: v,
          };
      }
    });
  };

  const saveWFT = () => {
    //TODO send to remote
    const timestamp = new Date().getTime() / 1000;
    updateProfile(p => {
      return {
        ...p,
        waitingForThem: deduplicatedConcat(
          p.waitingForThem,
          [
            {
              ...wftData,
              createdAt: timestamp,
              expiresAt: timestamp + 60 * 60 * 24,
            },
          ],
          (w1, w2) =>
            w1.handleForAwaited === w2.handleForAwaited &&
            w1.locationAliasA === w2.locationAliasA &&
            w1.locationAliasB === w2.locationAliasB &&
            w1.locationAliasC === w2.locationAliasC,
        ),
      };
    });
    discardWFT();
  };

  const allFieldsFilled =
    !!wftData.handleForAwaited &&
    !!wftData.locationAliasA &&
    !!wftData.locationAliasB &&
    !!wftData.locationAliasC;

  const styles = StyleSheet.create({
    title: {
      fontWeight: 'bold',
      color: theme.color.textPrimary,
      shadowColor: theme.color.textSecondary,
    },
    description: {
      color: theme.color.textSecondary,
      shadowColor: theme.color.textPrimary,
    },
    squareButton: {
      borderRadius: 0,
      color: theme.color.textPrimary,
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

  return (
    <List.Accordion
      style={{backgroundColor: theme.color.secondary}}
      title="Waiting for them"
      titleStyle={styles.title}  
    >
      {userProfile.waitingForThem.map(wft => (
        <List.Item
          style={{
            margin: 0,
            padding: 0,
            backgroundColor: theme.color.secondary,
            marginHorizontal: '5%',
          }}
          title={`waiting for ${wft.handleForAwaited} @ ${wft.locationAliasA} | ${wft.locationAliasB} | ${wft.locationAliasC}`}
          description={`created @ ${verboseTime(
            wft.createdAt,
          )}\nexpires @ ${new Date(
            wft.expiresAt,
          ).toLocaleTimeString()}, ${new Date(
            wft.expiresAt,
          ).toDateString()}`}
          left={_ => (
            <IconButton
              icon="delete"
              color={theme.color.textPrimary}
              style={[
                styles.squareButton,
                styles.minimalButton,
                {alignSelf: 'center'},
              ]}
              onPress={() => deleteWFT(wft)}
            />
          )}
          titleStyle={styles.title}
          descriptionStyle={styles.description}
          key={`${wft.handleForAwaited}-${wft.locationAliasA}-${wft.locationAliasB}-${wft.locationAliasC}`}
        />
      ))}
      <HorizontalView
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 5,
          backgroundColor: theme.color.secondary,
        }}>
        <Show
          component={
            <Button
              icon="plus"
              onPress={() => setAdding(true)}
              color={theme.color.textPrimary}
              uppercase={false}
              style={{
                backgroundColor: theme.color.secondary,
              }}>
              Wait for someone
            </Button>
          }
          If={!adding}
          ElseShow={
            <>
              <IconButton
                icon="delete"
                style={styles.squareButton}
                onPress={discardWFT}
              />
              <HorizontalView style={{width: '83%', paddingVertical: 2}}>
                <ScrollView horizontal fadingEdgeLength={10}>
                  <TextInput
                    label={'wait for...'}
                    style={{width: 150}}
                    onEndEditing={e => {
                      setUser(e.nativeEvent.text);
                    }}
                  />
                  <Paragraph
                    style={{
                      alignSelf: 'center',
                      color: theme.color.textPrimary,
                      shadowColor: theme.color.textSecondary,
                    }}>
                    @
                  </Paragraph>
                  <TextInput
                    label={'first place'}
                    onEndEditing={e => setLocation('A', e.nativeEvent.text)}
                    style={{width: 150, marginHorizontal: 1}}
                  />
                  <TextInput
                    label={'second place'}
                    onEndEditing={e => setLocation('B', e.nativeEvent.text)}
                    style={{width: 150, marginHorizontal: 1}}
                  />
                  <TextInput
                    label={'third place'}
                    onEndEditing={e => setLocation('C', e.nativeEvent.text)}
                    style={{width: 150, marginHorizontal: 1}}
                  />
                </ScrollView>
              </HorizontalView>
              <IconButton
                icon="content-save"
                disabled={!allFieldsFilled}
                style={styles.squareButton}
                onPress={saveWFT}
              />
            </>
          }
        />
      </HorizontalView>
    </List.Accordion>
  );
};

export {WaitingForThemList};
