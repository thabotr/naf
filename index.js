/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import App from './App';
import {RemoteRepository} from './src/shared/repository/remote';
import Publisher from './src/shared/utils/publisher';
let taskRunning = false;
AppRegistry.registerComponent(appName, () => App);

const dateToString = messageSince =>
  messageSince.toJSON().replace('T', ' ').replace('Z', '');

AppRegistry.registerHeadlessTask(
  'naf-notifier',
  // eslint-disable-next-line require-await
  () => async loggedInUserStr => {
    if (taskRunning) {
      console.log('task already registered');
      return;
    }
    if (!loggedInUser) {
      console.log('no user to get notifications for');
      return;
    }
    taskRunning = true;
    const loggedInUser = JSON.parse(loggedInUserStr);
    console.log('notifications', loggedInUser.handle);
    const messageSince = new Date();
    let messageSinceStr = dateToString(messageSince);
    Publisher.subscribe('MESSAGE_SINCE', {
      id: 'naf-notifier',
      callback: latestSince => (messageSinceStr = dateToString(latestSince)),
    });
    const pollingFrequencyMillisecs = 3000;
    setInterval(async () => {
      try {
        const event = await RemoteRepository.getNotifications(loggedInUser, {
          messagessince: messageSinceStr,
        });
        console.log(event);
        if (event !== 'IDLE') {
          Publisher.publish(event);
        }
      } catch (e) {
        console.log('listenForNotifications->getNotifications: ', e);
      }
    }, pollingFrequencyMillisecs);
    return undefined;
  },
);
