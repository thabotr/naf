import {faker} from '@faker-js/faker';
import {device, expect, by} from 'detox';
import 'isomorphic-fetch';
import {expect as jExpect} from '@jest/globals';
import {Buffer} from 'buffer';
import {PROFILE, PROFILES} from '../mockdata/profile';

const SERVER_URL = 'http://localhost:8000';

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
      test(
        'I should be able to navigate back home by clicking the `back to `home ' +
          'button',
        async () => {
          await expect(getHomePage()).not.toExist();
          await element(by.label('back to home')).tap();
          await expect(getHomePage()).toExist();
        },
      );
      test(
        "I should be able to view the chat's profile by clicking the open chat " +
          'profile field',
        async () => {
          const getChatProfilePage = () =>
            element(by.label(`${chat.user.handle} profile page`));
          await expect(getChatProfilePage()).not.toExist();
          await element(by.label('open chat profile')).tap();
          await expect(getChatProfilePage()).toExist();
        },
      );
      const getAuthHeader = user => {
        const encodedCredentials = Buffer.from(
          `${user.handle}:${user.token}`,
        ).toString('base64');
        return {
          Authorization: `Basic ${encodedCredentials}`,
        };
      };
      const ourUser = PROFILES[0];
      test('I should be able to see all the messages between the chat and I', async () => {
        // const response = await axios.get(
        //   SERVER_URL.concat('/naf/api/messages'),
        //   getAuthHeader(ourUser),
        // );
        // jExpect(response.status).toBe(200);
        // const messagesFromApi = response.data;
        const messagesFromApi = [
          {
            text: 'test text',
            timestamp: '2023-01-10 04:34:32',
            fromHandle: 'w/testHandle',
            toHandle: 'w/testHandle2',
          },
          {
            text: 'hey',
            timestamp: '2023-01-14 20:57:20',
            fromHandle: 'w/testHandle2',
            toHandle: 'w/testHandle',
          },
          {
            text: 'Test.POSTNofitications.testNewMessageEventCodeOnNewMessage',
            timestamp: '2023-01-16 03:15:11',
            fromHandle: 'w/testHandle2',
            toHandle: 'w/testHandle',
          },
        ];
        for (const message of messagesFromApi) {
          const messageTimestamp = new Date(
            message.timestamp.replace(' ', 'T').concat('Z'),
          ).getTime();
          await expect(
            element(
              by.label(
                `message from ${message.fromHandle} to ${message.toHandle}` +
                  ` @ ${messageTimestamp}`,
              ),
            ),
          ).toExist();
        }
      });
      test('I should be able to see a message sent by the chat', async () => {
        const authHeader = getAuthHeader(chat.user);
        const message = {
          text: faker.hacker.phrase(),
          toHandle: ourUser.handle,
        };
        const res = await fetch(SERVER_URL.concat('/naf/api/messages'), {
          method: 'POST',
          headers: authHeader,
          body: JSON.stringify(message),
        });
        console.log('BEcause here', await res.text());
        jExpect(res.status).toBe(201);
        const greaterThanPollingFrequency = 5000;
        await waitFor(element(by.text(message.text)))
          .toExist()
          .withTimeout(greaterThanPollingFrequency);
      });
      const getMessageComposer = () => element(by.label('message composer'));
      const getComposeButton = () => element(by.label('compose message'));
      const sampleMessageText = faker.hacker.phrase();
      describe('during message composition', () => {
        beforeEach(async () => {
          await getComposeButton().tap();
          await expect(getMessageComposer()).toExist();
          await element(by.label('message text input')).replaceText(
            sampleMessageText,
          );
        });
        test(
          'when I click the send message button then the message composer should ' +
            'become invisible, the compose message button should become ' +
            'visible, and I should see a new message with the contents of ' +
            'the composed message on screen',
          async () => {
            await element(by.label('send message')).tap();
            await expect(getMessageComposer()).not.toBeVisible();
            await expect(getComposeButton()).toBeVisible();
            await expect(element(by.text(sampleMessageText))).toExist();
          },
        );
        test(
          'when I click the discard message button then the message composer should ' +
            'become invisible and the compose message button should become visible',
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
