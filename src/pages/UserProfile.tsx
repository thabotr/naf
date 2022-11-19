import {NativeStackHeaderProps} from '@react-navigation/native-stack';
import {useState} from 'react';
import {Pressable, View, StyleSheet, ScrollView} from 'react-native';
import {
  Button,
  IconButton,
  List,
  Paragraph,
  TextInput,
  TouchableRipple,
} from 'react-native-paper';
import {Image} from '../components/Image';
import {OnlyShow} from '../components/Helpers/OnlyShow';
import {OverlayedView} from '../components/Helpers/OverlayedView';
import {Show} from '../components/Helpers/Show';
import {HorizontalView} from '../components/Helpers/HorizontalView';
import {ProfileHeader} from '../components/ProfileHeader';
import {useTheme} from '../context/theme';
import {useLoggedInUser} from '../context/user';

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

const ProfilePreview = () => {
  const {user} = useLoggedInUser();
  const {theme} = useTheme();
  const [editing, setEditing] = useState(false);
  return (
    <>
      <View>
        <Image
          source={user?.landscapeURI}
          style={{width: '100%', opacity: editing ? 0.6 : 1}}
          viewable={!editing}
        />
        <OnlyShow If={editing}>
          <OverlayedView>
            <HorizontalView>
              <IconButton
                icon="restore"
                disabled //TODO enable if updated
                onPress={() => {}}
                style={[
                  {backgroundColor: theme.color.primary},
                  styles.squareButton,
                  styles.minimalButton,
                ]}
              />
              <IconButton
                icon="camera"
                onPress={() => {}}
                style={[
                  {backgroundColor: theme.color.primary},
                  styles.squareButton,
                  styles.minimalButton,
                ]}
              />
            </HorizontalView>
          </OverlayedView>
        </OnlyShow>
      </View>
      <HorizontalView
        style={{
          width: '100%',
          alignItems: 'center',
          padding: 10,
          backgroundColor: theme.color.secondary,
        }}>
        <View>
          <Image
            source={user?.avatarURI}
            style={{width: 120, height: 120, opacity: editing ? 0.6 : 1}}
            viewable={!editing}
          />
          <OnlyShow If={editing}>
            <OverlayedView>
              <HorizontalView>
                <IconButton
                  icon="restore"
                  disabled //TODO enable if updated
                  onPress={() => {}}
                  style={[
                    {backgroundColor: theme.color.primary},
                    styles.squareButton,
                    styles.minimalButton,
                  ]}
                />
                <IconButton
                  icon="camera"
                  onPress={() => {}}
                  style={[
                    {backgroundColor: theme.color.primary},
                    styles.squareButton,
                    styles.minimalButton,
                  ]}
                />
              </HorizontalView>
            </OverlayedView>
          </OnlyShow>
        </View>
        <View
          style={{
            backgroundColor: theme.color.secondary,
            width: 340,
            padding: 10,
          }}>
          <Paragraph
            style={{
              fontWeight: 'bold',
              color: theme.color.textPrimary,
              shadowColor: theme.color.textSecondary,
            }}>
            {user?.handle}
          </Paragraph>
          <Paragraph
            style={{
              color: theme.color.textPrimary,
              shadowColor: theme.color.textSecondary,
            }}>
            {user?.name} {user?.surname} [{user?.initials}]
          </Paragraph>
        </View>
      </HorizontalView>
      <TouchableRipple onPress={() => setEditing(editing => !editing)}>
        <HorizontalView
          style={{alignItems: 'center', justifyContent: 'center'}}>
          <IconButton icon={editing ? 'content-save' : 'pen'} />
          <Paragraph
            style={{
              color: theme.color.textPrimary,
              shadowColor: theme.color.textSecondary,
            }}>
            {editing ? 'Save profile' : 'Edit profile'}
          </Paragraph>
        </HorizontalView>
      </TouchableRipple>
    </>
  );
};

function UserProfileHeader(props: NativeStackHeaderProps) {
  const {user} = useLoggedInUser();
  if (user) return <ProfileHeader user={user} props={props} />;
  return <></>;
}

function UserProfile() {
  const {theme} = useTheme();
  return (
    <ScrollView
      style={{backgroundColor: theme.color.secondary, height: '100%'}}>
      <ProfilePreview />
      <WaitingForYouList />
      <WaitingForThemList />
    </ScrollView>
  );
}

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

export {UserProfile, UserProfileHeader};
