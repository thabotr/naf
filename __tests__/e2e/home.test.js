import {device, element, expect} from 'detox';
import {PROFILE, PROFILES} from '../mockdata/profile';
describe('Home Page', () => {
  describe('As a logged in user', () => {
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
    it(
      "I should be able to navigate to the 'preferences page' by " +
        "pressing the 'open preferences' menu icon button on the navigation bar",
      async () => {
        await expect(element(by.label('preferences page'))).not.toExist();
        await element(by.label('open preferences')).tap();
        await expect(element(by.label('preferences page'))).toExist();
      },
    );

    it(
      "I should be able to navigate to the 'my profile page' by " +
        "pressing the 'open my profile' area on the navigation bar",
      async () => {
        await expect(element(by.label('my profile page'))).not.toExist();
        await element(by.label('open my profile')).tap();
        await expect(element(by.label('my profile page'))).toExist();
      },
    );
    describe('Who has a connected chat', () => {
      it(
        "I should be able to navigate to the 'chat <connectedChatHandle> page' by " +
          "pressing the 'open chat <connectedChatHandle>' link",
        async () => {
          const connectedChatHandle = PROFILES[1].handle;
          await expect(
            element(by.label(`chat ${connectedChatHandle} page`)),
          ).not.toExist();
          await element(by.label(`open chat ${connectedChatHandle}`)).tap();
          await expect(
            element(by.label(`chat ${connectedChatHandle} page`)),
          ).toExist();
        },
      );
    });
  });
});
