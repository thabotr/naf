/* eslint-disable require-await */
import React, {useState} from 'react';
import {Button, List, Paragraph, TextInput} from 'react-native-paper';
import {StyleSheet, ScrollView} from 'react-native';
import {useTheme} from '../../shared/providers/theme';
import {useLoggedInUser} from '../../context/user';
import {HorizontalView} from '../Helpers/HorizontalView';
import {Show} from '../Helpers/Show';
import {verboseTime} from '../../helper';
import {WaitingForThemType} from '../../types/user';
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
    setWftData(newwftData => {
      return {
        ...newwftData,
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
    setWftData(newwftData => {
      switch (location) {
        case 'A':
          return {
            ...newwftData,
            locationAliasA: v,
          };
        case 'B':
          return {
            ...newwftData,
            locationAliasB: v,
          };
        default:
          return {
            ...newwftData,
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
    list: {
      margin: 0,
      padding: 0,
      backgroundColor: theme.color.secondary,
      marginHorizontal: '5%',
    },
    center: {alignSelf: 'center'},
    waitForThem: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 5,
      backgroundColor: theme.color.secondary,
    },
    waitFor: {width: '83%', paddingVertical: 2},
    waitForTxtInput: {width: 150},
    atSymbol: {
      alignSelf: 'center',
      color: theme.color.textPrimary,
      shadowColor: theme.color.textSecondary,
    },
    atInput: {width: 150, marginHorizontal: 1},
  });

  return (
    <MutexContextProvider>
      <List.Accordion
        style={{backgroundColor: theme.color.secondary}}
        title="Waiting for them"
        titleStyle={styles.title}>
        {Object.entries(userProfile.waitingForThem).map(([userHandle, wft]) => (
          <List.Item
            style={styles.list}
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
                  styles.center,
                ]}
                onPress={() => deleteWFT(userHandle)}
              />
            )}
            titleStyle={styles.title}
            descriptionStyle={styles.description}
            key={userHandle}
          />
        ))}
        <HorizontalView style={styles.waitForThem}>
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
                <HorizontalView style={styles.waitFor}>
                  <ScrollView horizontal fadingEdgeLength={10}>
                    <TextInput
                      label={'wait for...'}
                      style={styles.waitForTxtInput}
                      onEndEditing={e => {
                        setUser(e.nativeEvent.text);
                      }}
                      dense
                    />
                    <Paragraph style={styles.atSymbol}>@</Paragraph>
                    <TextInput
                      label={'first place'}
                      onEndEditing={e => setLocation('A', e.nativeEvent.text)}
                      style={styles.atInput}
                      dense
                    />
                    <TextInput
                      label={'second place'}
                      onEndEditing={e => setLocation('B', e.nativeEvent.text)}
                      style={styles.atInput}
                      dense
                    />
                    <TextInput
                      label={'third place'}
                      onEndEditing={e => setLocation('C', e.nativeEvent.text)}
                      style={styles.atInput}
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
