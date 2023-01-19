import {faker} from '@faker-js/faker';
import {device, element, expect} from 'detox';
import {PROFILE} from '../mockdata/profile';
describe('Login Page', () => {
  beforeAll(async () => {
    await device.launchApp({newInstance: true});
  });

  beforeEach(async () => {
    await device.reloadReactNative();
    await expect(element(by.label('login page'))).toExist();
    await expect(element(by.label('home page'))).not.toExist();
    await expect(element(by.label('registration page'))).not.toExist();
  });

  it('as an unauthorized user I should not be able to log into the application', async () => {
    const unregisteredAccessToken = faker.internet.password(8, true);
    await element(by.label('your access token')).typeText(
      unregisteredAccessToken,
    );
    const registeredUserHandle = 'w/testHandle';
    await element(by.label('your handle')).typeText(registeredUserHandle);
    await element(by.label('login')).tap();
    await expect(element(by.text('Login failed!'))).toExist();
    await expect(
      element(by.text('please check credentials and try again')),
    ).toExist();
  });
  it('as a registered user I should be able to log into the application', async () => {
    const registeredAccessToken = PROFILE.token;
    await element(by.label('your access token')).typeText(
      registeredAccessToken,
    );
    const registeredUserHandle = PROFILE.handle;
    await element(by.label('your handle')).typeText(registeredUserHandle);
    await element(by.label('login')).tap();
    await expect(element(by.label('home page'))).toExist();
  });
  test("I should be able to navigate to the 'registration page' by pressing the 'to registration' link", async () => {
    await element(by.label('to registration')).tap();
    await expect(element(by.label('registration page'))).toExist();
  });
});
