import {device, expect, by} from 'detox';
import {PROFILE, PROFILES} from '../mockdata/profile';

describe('Chat page', () => {
  describe('As a logged in user', () => {
    describe('coming from the home page', () => {
      const chat = {
        user: PROFILES[1],
      };
      beforeAll(async () => {
        await device.launchApp({newInstance: true});
      });
      const getHomePage = () => element(by.label('home page'));
      beforeEach(async () => {
        await device.reloadReactNative();
        const registeredAccessToken = PROFILE.token;
        await element(by.label('your access token')).typeText(
          registeredAccessToken,
        );
        const registeredUserHandle = PROFILE.handle;
        await element(by.label('your handle')).typeText(registeredUserHandle);
        await element(by.label('login')).tap();
        await expect(getHomePage()).toExist();
        await element(by.label(`open chat ${chat.user.handle}`)).tap();
        await expect(
          element(by.label(`chat ${chat.user.handle} page`)),
        ).toExist();
      });
      test('I should be able to navigate back home by clicking the back to home button', async () => {
        await expect(getHomePage()).not.toExist();
        await element(by.label('back to home')).tap();
        await expect(getHomePage()).toExist();
      });
      test("I should be able to view the chat's profile by clicking the open chat profile field", async () => {
        const getChatProfilePage = () =>
          element(by.label(`${chat.user.handle} profile page`));
        await expect(getChatProfilePage()).not.toExist();
        await element(by.label('open chat profile')).tap();
        await expect(getChatProfilePage()).toExist();
      });
      const getMessageComposer = () => element(by.label('message composer'));
      const getComposeButton = () => element(by.label('compose message'));
      const sampleMessageText = 'some test text';
      describe('during message composition', () => {
        beforeEach(async () => {
          await getComposeButton().tap();
          await expect(getMessageComposer()).toExist();
          await element(by.label('message text input')).typeText(
            sampleMessageText,
          );
        });
        test(
          'when I click the send message button then the message composer should become ' +
            'invisible, the compose message button should become visible, and I should see ' +
            'a new message with the contents of the composed message on screen',
          async () => {
            await element(by.label('send message')).tap();
            await expect(getMessageComposer()).not.toBeVisible();
            await expect(getComposeButton()).toBeVisible();
            await expect(element(by.text(sampleMessageText))).toExist();
          },
        );
        test(
          'when I click the discard message button then the message composer should become ' +
            'invisible and the compose message button should become visible',
          async () => {
            await element(by.label('discard message')).tap();
            await expect(getMessageComposer()).not.toBeVisible();
            await expect(getComposeButton()).toBeVisible();
          },
        );
      });
    });
  });
});
