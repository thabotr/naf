import {
  Permission,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
} from 'react-native';

class PermissionsManager {
  static requestPermissions(perms: Permission[]) {
    if (Platform.OS === 'android') {
      PermissionsAndroid.requestMultiple(perms)
        .then(grants => {
          const permsGranted = perms.every(
            rp => grants[rp] === PermissionsAndroid.RESULTS.GRANTED,
          );
          if (permsGranted) {
            ToastAndroid.showWithGravity(
              'Permissions granted',
              5000,
              ToastAndroid.TOP,
            );
          } else {
            ToastAndroid.showWithGravity(
              'Permissions required',
              5000,
              ToastAndroid.TOP,
            );
          }
        })
        .catch(e => {
          console.error('requestPermissions:', e);
          ToastAndroid.showWithGravity(
            'Oops! Something went wrong. Please report this issue to us.',
            5000,
            ToastAndroid.CENTER,
          );
        });
    }
  }

  static async assertPermissionsGranted(perms: Permission[]): Promise<boolean> {
    let granted = true;
    try {
      for (const perm of perms) {
        granted &&= await PermissionsAndroid.check(perm);
      }
    } catch (e) {
      console.error('assertPermissionsGranted:', e);
    }
    return granted;
  }
}

export {PermissionsManager};
