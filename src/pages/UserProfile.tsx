import {NativeStackHeaderProps} from '@react-navigation/native-stack';
import {useState} from 'react';
import {View, StyleSheet, ScrollView, ToastAndroid} from 'react-native';
import {IconButton, Paragraph, TouchableRipple} from 'react-native-paper';
import {Image} from '../components/Image';
import {OnlyShow} from '../components/Helpers/OnlyShow';
import {OverlayedView} from '../components/Helpers/OverlayedView';
import {HorizontalView} from '../components/Helpers/HorizontalView';
import {ProfileHeader} from '../components/ProfileHeader';
import {useTheme} from '../context/theme';
import {useLoggedInUser} from '../context/user';
import {WaitingForYouList} from '../components/UserProfile/WaitingForYouList';
import {WaitingForThemList} from '../components/UserProfile/WaitingForThemList';

const ProfilePreview = () => {
  const {user, logOut} = useLoggedInUser();
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
            flex: 1,
            backgroundColor: theme.color.secondary,
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
