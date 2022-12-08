// describe('Example', () => {
//   beforeAll(async () => {
//     await device.launchApp();
//   });

//   beforeEach(async () => {
//     await device.reloadReactNative();
//   });

//   it('should have welcome screen', async () => {
//     await expect(element(by.id('welcome'))).toBeVisible();
//   });

//   it('should show hello screen after tap', async () => {
//     await element(by.id('hello_button')).tap();
//     await expect(element(by.text('Hello!!!'))).toBeVisible();
//   });

//   it('should show world screen after tap', async () => {
//     await element(by.id('world_button')).tap();
//     await expect(element(by.text('World!!!'))).toBeVisible();
//   });
// });
describe('Login Page', () => {
  beforeAll(async () => {
    await device.launchApp({newInstance: true});
  });

  beforeEach(async () => {
    // await device.launchApp({newInstance: true});
    await device.reloadReactNative();
  });

  it('should disable login when access token input is empty', async () => {
    await element(by.label('your access token')).clearText();
    const attributes = await element(by.label('login')).getAttributes();
    console.log(attributes);
    await element(by.label('login')).tap();
  });
});
// should disable login when handle input is empty
// should display error when login fails
