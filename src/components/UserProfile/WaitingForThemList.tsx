import {Button, List, Paragraph, TextInput} from 'react-native-paper';
import {StyleSheet, ScrollView} from 'react-native';
import {useTheme} from '../../context/theme';
import {useLoggedInUser} from '../../context/user';
import {HorizontalView} from '../Helpers/HorizontalView';
import {Show} from '../Helpers/Show';
import {verboseTime} from '../../helper';
import {WaitingForThemType} from '../../types/user';
import {useState} from 'react';
import {MutexContextProvider} from '../../providers/MutexProvider';
import {AsyncIconButton} from './AsyncIconButton';
import {Remote} from '../../services/Remote';
import {deepCopy} from '../../utils/deepCopy';

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

  const deleteWFT = async (userHandle: string) => {
    const deleted = await Remote.deleteWaitForThem(
      userProfile.token,
      userProfile.handle,
      userHandle,
    );
    if (deleted) {
      updateProfile(p => {
        delete userProfile.waitingForThem[userHandle];
        return deepCopy(p);
      });
    } else {
      throw new Error('failed to delete WFT');
    }
  };

  const setUser = (handle: string) => {
    setWftData(wftData => {
      return {
        ...wftData,
        handleForAwaited: handle,
      };
    });
  };

  const discardWFT = async () => {
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

  const saveWFT = async () => {
    const at = [
      wftData.locationAliasA,
      wftData.locationAliasB,
      wftData.locationAliasC,
    ].join('|');
    const wft = await Remote.addWaitForThem(
      userProfile.token,
      userProfile.handle,
      at,
      wftData.handleForAwaited,
    );
    if (wft) {
      updateProfile(p => {
        p.waitingForThem[wftData.handleForAwaited] =
          wft[wftData.handleForAwaited];
        return deepCopy(p);
      });
      discardWFT();
    } else {
      throw new Error('failed to add WFT');
    }
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
    <MutexContextProvider>
      <List.Accordion
        style={{backgroundColor: theme.color.secondary}}
        title="Waiting for them"
        titleStyle={styles.title}>
        {Object.entries(userProfile.waitingForThem).map(([userHandle, wft]) => (
          <List.Item
            style={{
              margin: 0,
              padding: 0,
              backgroundColor: theme.color.secondary,
              marginHorizontal: '5%',
            }}
            title={`waiting for ${userHandle} @ ${wft.at}`}
            description={`created @ ${verboseTime(
              wft.createdAt,
            )}\nexpires @ ${new Date(
              wft.expiresAt,
            ).toLocaleTimeString()}, ${new Date(wft.expiresAt).toDateString()}`}
            left={_ => (
              <AsyncIconButton
                icon="delete"
                style={[
                  styles.squareButton,
                  styles.minimalButton,
                  {alignSelf: 'center'},
                ]}
                onPress={() => deleteWFT(userHandle)}
              />
            )}
            titleStyle={styles.title}
            descriptionStyle={styles.description}
            key={userHandle}
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
              <MutexContextProvider>
                <AsyncIconButton
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
                      dense
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
                      dense
                    />
                    <TextInput
                      label={'second place'}
                      onEndEditing={e => setLocation('B', e.nativeEvent.text)}
                      style={{width: 150, marginHorizontal: 1}}
                      dense
                    />
                    <TextInput
                      label={'third place'}
                      onEndEditing={e => setLocation('C', e.nativeEvent.text)}
                      style={{width: 150, marginHorizontal: 1}}
                      dense
                    />
                  </ScrollView>
                </HorizontalView>
                <AsyncIconButton
                  icon="content-save"
                  disabled={!allFieldsFilled}
                  style={styles.squareButton}
                  onPress={saveWFT}
                />
              </MutexContextProvider>
            }
          />
        </HorizontalView>
      </List.Accordion>
    </MutexContextProvider>
  );
};

export {WaitingForThemList};
