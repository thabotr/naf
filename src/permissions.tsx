import {Platform, PermissionsAndroid, ToastAndroid, Permission} from 'react-native';

export const requestPermissions = async (requiredPerms: Permission[]) => {
  if (Platform.OS === 'android') {
    PermissionsAndroid.requestMultiple(requiredPerms).then( grants => {
      const permsGranted = requiredPerms.every( rp => grants[rp] === PermissionsAndroid.RESULTS.GRANTED)
      if( permsGranted) {
        ToastAndroid.showWithGravity("Permissions granted", 5_000, ToastAndroid.TOP);
      }else {
        ToastAndroid.showWithGravity("Permissions required", 5_000, ToastAndroid.TOP);
      }
    })
    .catch( e => {
      console.error("permissions request error: " + e);
      ToastAndroid.showWithGravity("Oops! Something went wrong. Please report this issue to us.", 5_000, ToastAndroid.CENTER)}
    );
  }
}

export const permissionsGranted = async (requiredPerms: Permission[]) => {
  let granted = true;
  for( let i=0; i < 3; ++i){
    granted = granted && await PermissionsAndroid.check(requiredPerms[i]);
  }
  return granted;
}