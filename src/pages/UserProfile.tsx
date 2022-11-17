import {NativeStackHeaderProps} from '@react-navigation/native-stack';
import React from 'react';
import {Pressable, View, StyleSheet, ScrollView} from 'react-native';
import {
  Button,
  IconButton,
  List,
  Paragraph,
  TextInput,
} from 'react-native-paper';
import {CardCover} from '../components/CardCover';
import {OnlyShow} from '../components/Helpers/OnlyShow';
import {OverlayedView} from '../components/Helpers/OverlayedView';
import {Show} from '../components/Helpers/Show';
import {HorizontalView} from '../components/HorizontalView';
import {ProfileHeader} from '../components/ProfileHeader';
import {useTheme} from '../context/theme';
import {useLoggedInUser} from '../context/user';

const WaitingForYouList = () => {
  const {user} = useLoggedInUser();
  return (
    <List.Accordion title="Waiting for you @">
      <View>
        <HorizontalView>
          <IconButton
            icon="delete"
            style={styles.squareButton}
            onPress={() => {}}
          />
          <List.Accordion
            style={{width: 430, borderWidth: 1, padding: 0}}
            title={'Paris | Johannesburg | Doha'}>
            <List.Item
              left={_ => (
                <CardCover
                  source={user?.avatarURI}
                  style={{width: 50, height: 50}}
                />
              )}
              style={{width: '100%'}}
              title={user?.handle}
              description={`${user?.name} ${user?.surname} [${user?.initials}]`}
              right={_ => (
                <>
                  <IconButton
                    icon="cancel"
                    style={styles.squareButton}
                    onPress={() => {}}
                  />
                  <IconButton
                    icon="account-plus"
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
              borderWidth: 1,
              paddingHorizontal: 5,
            }}>
            <Show
              component={
                <>
                  <IconButton icon="plus" style={{margin: 0, padding: 0}} />
                  <Paragraph>find me @</Paragraph>
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
  return (
    <List.Accordion title="Waiting for them @">
      <List.Item
        style={{borderWidth: 1, margin: 0, padding: 0}}
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
          borderWidth: 1,
          paddingHorizontal: 5,
        }}>
        <Show
          component={
            <>
              <IconButton icon="plus" style={styles.minimalButton} />
              <Paragraph>Wait for someone</Paragraph>
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
                <Paragraph style={{alignSelf: 'center'}}>@</Paragraph>
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
  const [editing, setEditing] = React.useState(false);
  return (
    <>
      <View>
        <CardCover
          source={user?.landscapeURI}
          style={{width: '100%', opacity: editing ? 0.6 : 1}}
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
          <CardCover
            source={user?.avatarURI}
            style={{width: 120, height: 120, opacity: editing ? 0.6 : 1}}
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
          <Paragraph style={{fontWeight: 'bold'}}>{user?.handle}</Paragraph>
          <Paragraph>
            {user?.name} {user?.surname} [{user?.initials}]
          </Paragraph>
        </View>
      </HorizontalView>
      <HorizontalView style={{alignItems: 'center', justifyContent: 'center'}}>
        <IconButton icon={editing ? 'content-save' : 'pen'} />
        <Paragraph>{editing ? 'Save profile' : 'Edit profile'}</Paragraph>
        <OverlayedView>
          <Button
            style={{width: '100%'}}
            onPress={() => setEditing(editing => !editing)}>
            {' '}
          </Button>
        </OverlayedView>
      </HorizontalView>
    </>
  );
};

function UserProfileHeader(props: NativeStackHeaderProps) {
  const {user} = useLoggedInUser();
  if (user) return <ProfileHeader user={user} props={props} />;
  return <></>;
}

function UserProfile() {
  return (
    <View>
      <ProfilePreview />
      <WaitingForYouList />
      <WaitingForThemList />
    </View>
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
