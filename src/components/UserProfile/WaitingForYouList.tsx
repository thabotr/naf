/* eslint-disable prettier/prettier */
/* eslint-disable require-await */
import React, {useState} from 'react';
import {Button, List, TextInput} from 'react-native-paper';
import {StyleSheet, View, Pressable} from 'react-native';
import {useTheme} from '../../shared/providers/theme';
import {useLoggedInUser} from '../../context/user';
import {HorizontalView} from '../Helpers/HorizontalView';
import {Image} from '../Image';
import {Show} from '../Helpers/Show';
import {WaitAtType} from '../../types/user';
import {verboseTime} from '../../helper';
import {deduplicatedConcat} from '../../utils/deduplicatedConcat';
import {useChats} from '../../context/chat';
import {Remote} from '../../services/Remote';
import {getColorsForUser} from '../../utils/getUserColors';
import {useColorsForUsers} from '../../providers/UserTheme';
import {MutexContextProvider} from '../../providers/MutexProvider';
import {deepCopy} from '../../utils/deepCopy';
import {AsyncIconButton} from './AsyncIconButton';

const emptyWFY: WaitAtType = {
  createdAt: 0,
  expiresAt: 0,
  locationAliasA: '',
  locationAliasB: '',
  locationAliasC: '',
};

const WaitingForYouList = () => {
  const {userProfile, updateProfile} = useLoggedInUser();
  const {updateChats} = useChats();
  const {theme} = useTheme();
  const [addingWFM, setAddingWFM] = useState(false);
  const [wAtData, setWAtData] = useState(emptyWFY);
  const {saveUserColors} = useColorsForUsers();

  const removeWFYWaiter = (at: string, waiterHandle: string) => {
    updateProfile(p => {
      delete p.waitingForYou[at].waiters[waiterHandle];
      return deepCopy(p);
    });
  };

  const dismissWaitingUser = async (at: string, waiterHandle: string) => {
    const deleted = await Remote.deleteWaitForYouUser(
      userProfile.token,
      userProfile.handle,
      at,
      waiterHandle,
    );
    if (deleted) {
      removeWFYWaiter(at, waiterHandle);
    } else {
      throw new Error('failed to dismiss waiting user');
    }
  };
  const connectWWaitingUser = async (at: string, waiterHandle: string) => {
    const chat = await Remote.acceptConnection(
      userProfile.token,
      userProfile.handle,
      at,
      waiterHandle,
    );
    if (chat) {
      updateChats(chats =>
        deduplicatedConcat(
          chats,
          [chat],
          (c1, c2) => c1.user.handle === c2.user.handle,
        ),
      );
      getColorsForUser(chat.user).then(
        colors => colors && saveUserColors(chat.user.handle, colors),
      );
      removeWFYWaiter(at, waiterHandle);
      return;
    } else {
      throw new Error('no chat found');
    }
  };

  const deleteWFY = async (at: string) => {
    const res = await Remote.deleteWaitForYou(
      userProfile.token,
      userProfile.handle,
      at,
    );
    if (res) {
      updateProfile(p => {
        delete p.waitingForYou[at];
        return deepCopy(p);
      });
    } else {
      throw new Error('failed to delete wait for you');
    }
  };
  const discardWFY = async () => {
    setWAtData(emptyWFY);
    setAddingWFM(false);
  };
  const saveWFY = async () => {
    const at = [
      wAtData.locationAliasA,
      wAtData.locationAliasB,
      wAtData.locationAliasC,
    ].join('|');
    const wfy = await Remote.addWaitForYou(
      userProfile.token,
      userProfile.handle,
      at,
    );
    if (wfy) {
      updateProfile(p => {
        p.waitingForYou[at] = wfy[at];
        return deepCopy(p);
      });
      discardWFY();
    } else {
      throw new Error('failed to save wfy');
    }
  };
  const setLocation = (location: 'A' | 'B' | 'C', value: string) => {
    const v = value.trim();
    setWAtData(newwAtData => {
      switch (location) {
        case 'A':
          return {
            ...newwAtData,
            locationAliasA: v,
          };
        case 'B':
          return {
            ...newwAtData,
            locationAliasB: v,
          };
        default:
          return {
            ...newwAtData,
            locationAliasC: v,
          };
      }
    });
  };

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
      color: theme.color.textPrimary,
    },
    placeText: {
      width: '33%',
      marginHorizontal: 1,
      color: theme.color.textPrimary,
    },
    listAccord: {backgroundColor: theme.color.secondary},
    atListAccord: {
      width: 400,
      padding: 0,
      backgroundColor: theme.color.secondary,
    },
    wAvatar: {width: 50, height: 50, alignSelf: 'center'},
    addWFM: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 10,
    },
    inputs: {flex: 1, paddingVertical: 2},
    flex: {flex: 1},
  });

  const allFieldsFilled =
    !!wAtData.locationAliasA &&
    !!wAtData.locationAliasB &&
    !!wAtData.locationAliasC;

  return (
    <List.Accordion
      style={styles.listAccord}
      title="Waiting for you"
      titleStyle={styles.title}>
      <View>
        {Object.entries(userProfile.waitingForYou).map(([at, wfy]) => (
          <HorizontalView key={at}>
            <MutexContextProvider>
              <AsyncIconButton
                icon="delete"
                style={styles.squareButton}
                onPress={() => deleteWFY(at)}
              />
              <List.Accordion
                style={styles.atListAccord}
                title={`@ ${at}`}
                description={`created ${verboseTime(
                  wfy.createdAt,
                )}\nexpires @ ${new Date(
                  wfy.expiresAt,
                ).toLocaleTimeString()}, ${new Date(
                  wfy.expiresAt,
                ).toDateString()}`}
                titleStyle={styles.title}
                descriptionStyle={styles.description}>
                {wfy.waiters &&
                  Object.entries(wfy.waiters).map(([waiterHandle, w]) => (
                    <List.Item
                      left={_ => (
                        <Image
                          source={w.avatarURI}
                          style={styles.wAvatar}
                          viewable
                        />
                      )}
                      key={waiterHandle}
                      title={waiterHandle}
                      description={`arrived ${verboseTime(
                        w.arrivedAt,
                      )}\nwill leave @ 
                      ${new Date(w.leavesAt).toLocaleTimeString()}, ${new Date(
                      w.leavesAt,
                    ).toDateString()}
                      `}
                      titleStyle={styles.title}
                      descriptionStyle={styles.description}
                      right={_ => (
                        <>
                          <AsyncIconButton
                            icon="cancel"
                            color={theme.color.textPrimary}
                            style={styles.squareButton}
                            onPress={() => dismissWaitingUser(at, waiterHandle)}
                          />
                          <AsyncIconButton
                            icon="account-plus"
                            style={styles.squareButton}
                            color={'green'}
                            onPress={() =>
                              connectWWaitingUser(at, waiterHandle)
                            }
                          />
                        </>
                      )}
                    />
                  ))}
              </List.Accordion>
            </MutexContextProvider>
          </HorizontalView>
        ))}
        <Pressable>
          <HorizontalView style={styles.addWFM}>
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
                <MutexContextProvider>
                  <AsyncIconButton
                    icon="delete"
                    style={styles.squareButton}
                    onPress={discardWFY}
                  />
                  <HorizontalView style={styles.inputs}>
                    <TextInput
                      dense
                      label={'first place'}
                      onEndEditing={e => setLocation('A', e.nativeEvent.text)}
                      style={styles.flex}
                    />
                    <TextInput
                      dense
                      label={'second place'}
                      onEndEditing={e => setLocation('B', e.nativeEvent.text)}
                      style={styles.flex}
                    />
                    <TextInput
                      dense
                      label={'third place'}
                      onEndEditing={e => setLocation('C', e.nativeEvent.text)}
                      style={styles.flex}
                    />
                  </HorizontalView>
                  <AsyncIconButton
                    icon="content-save"
                    onPress={saveWFY}
                    disabled={!allFieldsFilled}
                    style={styles.squareButton}
                  />
                </MutexContextProvider>
              }
            />
          </HorizontalView>
        </Pressable>
      </View>
    </List.Accordion>
  );
};
export {WaitingForYouList};
