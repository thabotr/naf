import {device, element, expect} from 'detox';
describe('Registration Page', () => {
  describe('as a user coming from the login page', () => {
    beforeAll(async () => {
      await device.launchApp({newInstance: true});
    });

    beforeEach(async () => {
      await device.reloadReactNative();
      await expect(element(by.label('login page'))).toExist();
      await expect(element(by.label('registration page'))).not.toExist();
      await element(by.label('to registration')).tap();
      await expect(element(by.label('registration page'))).toExist();
    });
    test("I should be able to navigate back to the 'login page' by pressing the 'back to login' link", async () => {
      await element(by.label('back to login')).tap();
      await expect(element(by.label('login page'))).toExist();
    });
    test(
      'When I try to register an existing user handle it should fail and inform me that ' +
        'the user already exists',
      async () => {
        const alreadyRegisteredCredentials = {
          handle: 'w/testHandle',
          token: 'testTokenForMe',
        };
        await element(by.label('your new access token')).typeText(
          alreadyRegisteredCredentials.token,
        );
        await element(by.label('your new handle')).typeText(
          alreadyRegisteredCredentials.handle,
        );
        await element(by.label('register')).tap();
        await expect(element(by.text('Registration failed!'))).toExist();
        await expect(element(by.text('handle already taken'))).toExist();
      },
    );
    test(
      'When I successfully register a new account, I should be taken to the login page where ' +
        'where there will be a successful registration confirmation',
      async () => {
        const validCredentials = {
          handle: 'w/testHandleNewRegistrant',
          token: 'testTokenForMe',
        };
        await element(by.label('your new access token')).typeText(
          validCredentials.token,
        );
        await element(by.label('your new handle')).typeText(
          validCredentials.handle,
        );
        await element(by.label('register')).tap();
        await expect(element(by.label('login page'))).toExist();
        await expect(
          element(by.text("You're now a citizen. Login!")),
        ).toExist();
      },
    );
  });
});
