import axios from 'axios';
import {SERVER_URL} from '../../../../../src/shared/routes/server';
import {
  getAuthNValidationConfig,
  RemoteRepository,
} from '../../../../../src/shared/repository/remote';

jest.useRealTimers();

describe(RemoteRepository, () => {
  describe(RemoteRepository.getNotifications, () => {
    const mockGet = jest.fn().mockName('mockGet');
    axios.get = mockGet;
    const credentials = {
      handle: '',
      token: '',
    };
    const selectors = {
      messageSince: '2011/1/1',
    };
    const getNotifications = () =>
      RemoteRepository.getNotifications(credentials, selectors);
    beforeEach(() => {
      jest.clearAllMocks();
      mockGet.mockClear();
    });
    it('makes a get request with the given selectors and credentials as headers', async () => {
      const notificationsURL = SERVER_URL.concat('/notifications');
      const expectedFetchConfig = getAuthNValidationConfig(
        credentials,
        selectors,
      );
      mockGet.mockResolvedValueOnce({
        status: 204,
      });
      await getNotifications();
      expect(mockGet).toBeCalledTimes(1);
      expect(mockGet).toBeCalledWith(notificationsURL, expectedFetchConfig);
    });
    it("returns the NEW_MESSAGE event when fetch response is 'OK' and body is '1'", () => {
      mockGet.mockResolvedValue({
        status: 200,
        data: '1',
      });
      expect(getNotifications()).resolves.toEqual('NEW_MESSAGE');
    });
    it("returns the IDLE event when the reponse is not 'OK'", () => {
      mockGet.mockResolvedValueOnce({
        status: 204,
      });
      expect(getNotifications()).resolves.toEqual('IDLE');
    });
    it('rethrows any error thrown during the fetch request', () => {
      const error = new Error('a test fetch error');
      mockGet.mockRejectedValueOnce(error);
      expect(getNotifications()).rejects.toThrow(error);
    });
  });
});
