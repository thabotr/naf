import {device, expect, by} from 'detox';
import {PROFILE, PROFILES} from '../mockdata/profile';

describe('Chat Profile page', () => {
  describe('As a logged in user', () => {
    describe('coming from the chat page', () => {
      beforeAll(async () => {
        await device.launchApp({newInstance: true});
      });
      beforeEach(async () => {
        await device.reloadReactNative();
        const registeredAccessToken = PROFILE.token;
        await element(by.label('your access token')).typeText(
          registeredAccessToken,
        );
        const registeredUserHandle = PROFILE.handle;
        await element(by.label('your handle')).typeText(registeredUserHandle);
        await element(by.label('login')).tap();
        await expect(element(by.label('home page'))).toExist();
      });
      const openChatProfilePage = async chat => {
        await element(by.label(`open chat ${chat.user.handle}`)).tap();
        await expect(
          element(by.label(`chat ${chat.user.handle} page`)),
        ).toExist();
        await element(by.label('open chat profile')).tap();
        await expect(
          element(by.label(`${chat.user.handle} profile page`)),
        ).toExist();
      };
      test(
        'I should be able to navigate back to the chat by clicking the back to ' +
          'home button',
        async () => {
          const chat = {
            user: PROFILES[1],
          };
          await openChatProfilePage(chat);
          await expect(
            element(by.label(`chat ${chat.user.handle} page`)),
          ).not.toExist();
          await element(by.label('back to home')).tap();
          await expect(
            element(by.label(`chat ${chat.user.handle} page`)),
          ).toExist();
        },
      );
      test(
        'coming from the chat page when I disconnect from a user I should be navigated back to the home page where ' +
          'the user has been removed from the links of chat previews',
        async () => {
          const chatToDisconnectFrom = {
            user: PROFILES[2],
          };
          await openChatProfilePage(chatToDisconnectFrom);
          await expect(element(by.label('home page'))).not.toExist();
          await element(
            by.label(
              `disconnect from chat ${chatToDisconnectFrom.user.handle}`,
            ),
          ).longPress();
          await expect(element(by.label('home page'))).toExist();
          await expect(
            element(by.label(`open chat ${chatToDisconnectFrom.user.handle}`)),
          ).not.toExist();
        },
      );
    });
  });
});
