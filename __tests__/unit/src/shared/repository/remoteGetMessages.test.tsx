import axios from 'axios';
import {Credentials} from '../../../../../src/pages/Login/Login';
import {
  getAuthNValidationConfig,
  RemoteRepository,
} from '../../../../../src/shared/repository/remote';
import {SERVER_URL} from '../../../../../src/shared/routes/server';
import {HelperText} from '../../../../../src/shared/middleware';
import {Message} from '../../../../../src/pages/Chat/types/Message';

jest.useRealTimers();

describe(RemoteRepository, () => {
  describe(RemoteRepository.getMessages, () => {
    const mockGet = jest.fn().mockName('mockGet');
    axios.get = mockGet;
    beforeEach(() => {
      mockGet.mockClear();
    });
    const credentials: Credentials = {
      handle: 'w/testHandle',
      token: 'testToken',
    };
    const getMessages = (since?: Date) =>
      RemoteRepository.getMessages(credentials, since);
    test(
      "calls fetch with the stringified 'since' header in the format '%Y-%m-%d %H:%M:%S' if " +
        "and only if it the 'since' argument is defined",
      async () => {
        expect.assertions(4);
        const messagesURL = SERVER_URL.concat('/messages');
        const configWithoutSinceHeader = getAuthNValidationConfig(credentials);
        mockGet.mockResolvedValueOnce({
          status: 200,
          data: [],
        });
        await getMessages();
        expect(mockGet).toBeCalledTimes(1);
        expect(mockGet).toBeCalledWith(messagesURL, configWithoutSinceHeader);
        mockGet.mockClear();
        const since = new Date();
        const sinceHeader = {
          since: since.toJSON().replace('T', ' ').replace('Z', ''),
        };
        const configWithSinceHeader = getAuthNValidationConfig(
          credentials,
          sinceHeader,
        );
        mockGet.mockResolvedValueOnce({
          status: 200,
          data: [],
        });
        await getMessages(since);
        expect(mockGet).toBeCalledTimes(1);
        expect(mockGet).toBeCalledWith(messagesURL, configWithSinceHeader);
      },
    );
    test("returns the messages when fetch status is 'OK'", async () => {
      expect.assertions(1);
      const text = 'Test.POSTNofitications.testNewMessageEventCodeOnNewMessage';
      mockGet.mockResolvedValueOnce({
        status: 200,
        data: [
          {
            text: text,
            timestamp: '2023-01-16 03:15:11',
            fromHandle: 'w/testHandle2',
            toHandle: 'w/testHandle',
          },
        ],
      });
      const expectedMessages: Message[] = [
        {
          text: text,
          fromHandle: 'w/testHandle2',
          toHandle: 'w/testHandle',
          timestamp: new Date('2023-01-16T03:15:11Z'),
        },
      ];
      await expect(getMessages()).resolves.toStrictEqual(expectedMessages);
    });
    test('throws unknown error when the fetch throws an error', async () => {
      expect.assertions(1);
      mockGet.mockRejectedValueOnce(
        'some expected error for testing getMessages',
      );
      await expect(getMessages()).rejects.toStrictEqual(
        new Error(HelperText.unknownError),
      );
    });
    test("throws unknown error if the fetch status is not 'OK'", async () => {
      expect.assertions(1);
      mockGet.mockResolvedValueOnce({
        status: 401,
      });
      await expect(getMessages()).rejects.toStrictEqual(
        new Error(HelperText.unknownError),
      );
    });
  });
});
