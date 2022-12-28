import {device, expect, by} from 'detox';
import {CHATS} from '../mockdata/chat';
import {PROFILE} from '../mockdata/profile';

describe('Chat page', () => {
  describe('As a logged in user', () => {
    describe('coming from the home page', () => {
      const chat = CHATS[0];
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
        await element(by.label(`open chat ${chat.user.handle}`)).tap();
        await expect(
          element(by.label(`chat ${chat.user.handle} page`)),
        ).toExist();
      });
      test('I should be able to navigate back home by clicking the back to home button', async () => {
        await expect(element(by.label('home page'))).not.toExist();
        await element(by.label('back to home')).tap();
        await expect(element(by.label('home page'))).toExist();
      });
      test("I should be able to view the chat's profile by clicking the open chat profile field", async () => {
        await expect(
          element(by.label(`${chat.user.handle} profile page`)),
        ).not.toExist();
        await element(by.label('open chat profile')).tap();
        await expect(
          element(by.label(`${chat.user.handle} profile page`)),
        ).toExist();
      });
      test(
        'when I click the compose mesage button it should bring up a ' +
          'message composer and then disappear from view',
        async () => {
          await expect(element(by.label('message composer'))).not.toExist();
          await element(by.label('compose message')).tap();
          await expect(element(by.label('message composer'))).toExist();
          await expect(element(by.label('compose message'))).not.toExist();
        },
      );
    });
  });
});
