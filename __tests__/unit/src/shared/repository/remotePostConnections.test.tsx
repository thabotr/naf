import axios from 'axios';
import {HelperText} from '../../../../../src/shared/middleware';
import {
  getAuthNValidationConfig,
  RemoteRepository,
} from '../../../../../src/shared/repository/remote';
import {SERVER_URL} from '../../../../../src/shared/routes/server';

jest.useRealTimers();

describe(RemoteRepository, () => {
  describe(RemoteRepository.connectToUser, () => {
    const mockPost = jest.fn().mockName('mockPost');
    beforeEach(() => {
      mockPost.mockClear();
      axios.post = mockPost;
    });
    const userToConnect = 'w/someUser';
    const credentials = {
      handle: 'w/dummyHandle',
      token: 'token',
    };
    const timestampStr = '2021-11-01 17:50:11';
    const connectToUser = () =>
      RemoteRepository.connectToUser(userToConnect, credentials);
    it('calls fetch with the correct arguments', async () => {
      expect.assertions(2);
      const postConnectionsURL = `${SERVER_URL}/connections/${userToConnect}`;
      mockPost.mockReturnValueOnce({
        status: 201,
        data: {
          timestamp: timestampStr,
        },
      });
      await connectToUser();
      expect(mockPost).toBeCalledTimes(1);
      const noRequestBody = undefined;
      const config = getAuthNValidationConfig(credentials);
      expect(mockPost).toBeCalledWith(
        postConnectionsURL,
        noRequestBody,
        config,
      );
    });
    it('throws the user not found error when fetch returns 404', async () => {
      expect.assertions(1);
      mockPost.mockReturnValueOnce({
        status: 404,
      });
      await expect(connectToUser()).rejects.toThrow(HelperText.userNotFound);
    });
    it('throws the unknown error when fetch throws as error', async () => {
      expect.assertions(1);
      mockPost.mockRejectedValueOnce(
        new Error('connectToUser intentionally thrown testing error'),
      );
      await expect(connectToUser()).rejects.toThrow(HelperText.unknownError);
    });
    it(
      'throws the unknown error if fetch returns a status which ' +
        'is neither 404 nor 201',
      async () => {
        expect.assertions(1);
        const unexpectedStatus = 303;
        mockPost.mockReturnValueOnce({
          status: unexpectedStatus,
        });
        await expect(connectToUser()).rejects.toThrow(HelperText.unknownError);
      },
    );
    it('returns a connection request object when the fetch returns 201', async () => {
      expect.assertions(1);
      const dateTime = new Date(timestampStr.replace(' ', 'T').concat('Z'));
      const requestObject = {
        toHandle: userToConnect,
        timestamp: dateTime,
      };
      mockPost.mockResolvedValueOnce({
        status: 201,
        data: {
          timestamp: timestampStr,
        },
      });
      await expect(connectToUser()).resolves.toStrictEqual(requestObject);
    });
  });
});
