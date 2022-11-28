import {NativeStackHeaderProps} from '@react-navigation/native-stack';
import {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView, ToastAndroid} from 'react-native';
import {Button, IconButton, Paragraph, TextInput} from 'react-native-paper';
import {Image} from '../components/Image';
import {OnlyShow} from '../components/Helpers/OnlyShow';
import {OverlayedView} from '../components/Helpers/OverlayedView';
import {HorizontalView} from '../components/Helpers/HorizontalView';
import {useTheme} from '../context/theme';
import {useLoggedInUser} from '../context/user';
import {WaitingForYouList} from '../components/UserProfile/WaitingForYouList';
import {WaitingForThemList} from '../components/UserProfile/WaitingForThemList';
import {FileManager} from '../services/FileManager';
import {Show} from '../components/Helpers/Show';
import {GenericHeader} from '../components/GenericPageHeader';
import {getColorsForUser} from '../utils/getUserColors';

const EditableProfilePreview = () => {
  const {userProfile, logOut, updateProfile} = useLoggedInUser();
  const {theme} = useTheme();
  const [editing, setEditing] = useState(false);
  const loggedInUser = userProfile;
  const [user, setUser] = useState(() => loggedInUser);

  const restoreProfile = (
    field: 'avatar' | 'landscape' | 'name' | 'surname' | undefined,
  ) => {
    setUser(u => {
      switch (field) {
        case 'avatar':
          return {
            ...u,
            avatarURI: loggedInUser.avatarURI,
          };
        case 'landscape':
          return {
            ...u,
            landscapeURI: loggedInUser.landscapeURI,
          };
        case 'name':
          return {
            ...u,
            name: loggedInUser.name,
          };
        case 'surname':
          return {
            ...u,
            surname: loggedInUser.surname,
          };
        default:
          setEditing(false);
          return loggedInUser;
      }
    });
  };

  const saveProfile = () => {
    // send profile update to remote
    updateProfile(p => {
      return {
        ...p,
        user: user,
      };
    });
    setEditing(false);
  };

  const pickImage = (field: 'avatar' | 'landscape') => {
    FileManager.getCameraMedia('photo').then(file => {
      file &&
        setUser(u => {
          switch (field) {
            case 'avatar':
              return {
                ...u,
                avatarURI: file.uri,
              };
            case 'landscape':
              return {
                ...u,
                landscapeURI: file.uri,
              };
          }
        });
    });
  };

  function RestoreButton({
    field,
  }: {
    field: 'avatar' | 'landscape' | 'name' | 'surname';
  }) {
    const loggedInUserValue = (() => {
      switch (field) {
        case 'landscape':
          return loggedInUser.landscapeURI;
        case 'avatar':
          return loggedInUser.avatarURI;
        case 'name':
          return loggedInUser.name;
        case 'surname':
          return loggedInUser.surname;
      }
    })();
    const userValue = (() => {
      switch (field) {
        case 'landscape':
          return user.landscapeURI;
        case 'avatar':
          return user.avatarURI;
        case 'name':
          return user.name;
        case 'surname':
          return user.surname;
      }
    })();
    return (
      <IconButton
        icon="restore"
        disabled={userValue === loggedInUserValue}
        onPress={() => restoreProfile(field)}
        style={[
          {backgroundColor: theme.color.primary, alignSelf: 'center'},
          styles.squareButton,
          styles.minimalButton,
        ]}
      />
    );
  }

  const updateProfileNames = (field: 'name' | 'surname', value: string) => {
    setUser(u => {
      switch (field) {
        case 'name':
          return {
            ...u,
            name: value,
          };
        case 'surname':
          return {
            ...u,
            surname: value,
          };
      }
    });
  };

  return (
    <>
      <View>
        <Image
          source={user.landscapeURI}
          style={{width: '100%', opacity: editing ? 0.6 : 1}}
          viewable={!editing}
        />
        <OnlyShow If={editing}>
          <OverlayedView>
            <HorizontalView>
              <RestoreButton field="landscape" />
              <IconButton
                icon="camera"
                onPress={() => pickImage('landscape')}
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
            source={user.avatarURI}
            style={{width: 120, height: 120, opacity: editing ? 0.6 : 1}}
            viewable={!editing}
          />
          <OnlyShow If={editing}>
            <OverlayedView>
              <HorizontalView>
                <RestoreButton field="avatar" />
                <IconButton
                  icon="camera"
                  onPress={() => pickImage('avatar')}
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
            flex: 1,
            flexDirection: editing ? 'row' : 'column',
            backgroundColor: theme.color.secondary,
            padding: 10,
          }}>
          <Show
            component={
              <Paragraph
                style={{
                  color: theme.color.textPrimary,
                  shadowColor: theme.color.textSecondary,
                }}>
                {user.name} {user.surname} [{user.initials}]
              </Paragraph>
            }
            If={!editing}
            ElseShow={
              <View style={{flex: 1}}>
                <RestoreButton field="name" />
                <TextInput
                  label="new name"
                  defaultValue={user.name}
                  onEndEditing={e =>
                    updateProfileNames('name', e.nativeEvent.text)
                  }
                />
              </View>
            }
          />
          <Show
            component={
              <Paragraph
                style={{
                  fontWeight: 'bold',
                  color: theme.color.textPrimary,
                  shadowColor: theme.color.textSecondary,
                }}>
                {user.handle}
              </Paragraph>
            }
            If={!editing}
            ElseShow={
              <View style={{flex: 1}}>
                <RestoreButton field="surname" />
                <TextInput
                  label="new surname"
                  defaultValue={user.surname}
                  onEndEditing={e =>
                    updateProfileNames('surname', e.nativeEvent.text)
                  }
                />
              </View>
            }
          />
        </View>
        <IconButton
          icon="logout"
          disabled={editing}
          color="red"
          onPress={() => {
            ToastAndroid.show('hold to logout', 3_000);
          }}
          onLongPress={logOut}
          style={[styles.squareButton, {margin: 10}]}
        />
      </HorizontalView>
      <OnlyShow If={editing}>
        <Button
          icon={'restore'}
          color={theme.color.textPrimary}
          uppercase={false}
          onPress={() => restoreProfile(undefined)}>
          Discard changes
        </Button>
      </OnlyShow>
      <Button
        icon={editing ? 'content-save' : 'pen'}
        color={theme.color.textPrimary}
        uppercase={false}
        onPress={editing ? saveProfile : () => setEditing(true)}>
        {editing ? 'Save profile' : 'Edit profile'}
      </Button>
    </>
  );
};

function UserProfileHeader(props: NativeStackHeaderProps) {
  const {userProfile} = useLoggedInUser();
  const {theme} = useTheme();
  const [color, setColor] = useState<string | undefined>(undefined);
  useEffect(() => {
    getColorsForUser(userProfile).then(
      colors =>
        colors &&
        setColor(
          theme.dark
            ? colors.landscape.darkPrimary
            : colors.landscape.lightPrimary,
        ),
    );
  }, []);
  return <GenericHeader name="Your profile" props={props} bgColor={color} />;
}

function UserProfile() {
  const {theme} = useTheme();
  return (
    <ScrollView
      style={{backgroundColor: theme.color.secondary, height: '100%'}}>
      <EditableProfilePreview />
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
