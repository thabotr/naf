import {PROFILE} from '../mockdata/profile';

describe('Preferences Page', () => {
  describe('As a logged in user', () => {
    describe('coming from the home page', () => {
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
        await element(by.label('open preferences')).tap();
        await expect(element(by.label('preferences page'))).toExist();
      });
      it(
        "I should be able to navigate to the 'home page' by " +
          "pressing the 'back to home' icon button on the navigation bar",
        async () => {
          await expect(element(by.label('home page'))).not.toExist();
          await element(by.label('back to home')).tap();
          await expect(element(by.label('home page'))).toExist();
        },
      );
      it('I should be able to see the theme preferences section', async () => {
        await expect(element(by.label('theme preferences'))).toExist();
      });
    });
  });
});
