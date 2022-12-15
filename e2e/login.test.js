import {device, element, expect} from 'detox';
describe('Login Page', () => {
  beforeAll(async () => {
    await device.launchApp({newInstance: true});
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('as a registered user I should be able to log into the application', async () => {
    const registeredAccessToken = 'token1';
    await element(by.label('your access token')).typeText(
      registeredAccessToken,
    );
    const registeredUserHandle = 'w/unodosthreenfour';
    await element(by.label('your handle')).typeText(registeredUserHandle);
    await element(by.label('login')).tap();
    await expect(element(by.text('TODO navigate to home page'))).toExist();
  });
  it('as an unregistered user I should not be able to log into the application', async () => {
    const unregisteredAccessToken = 'token';
    await element(by.label('your access token')).typeText(
      unregisteredAccessToken,
    );
    const registeredUserHandle = 'w/unodosthreenfour';
    await element(by.label('your handle')).typeText(registeredUserHandle);
    await element(by.label('login')).tap();
    await expect(element(by.text('Login failed!'))).toExist();
  });
});
