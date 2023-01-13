import axios from 'axios';
import Stream from 'stream';
import {SERVER_URL} from '../../../../../src/shared/routes/server';
import eventPublisher from '../../../../../src/shared/utils/eventPublisher';
import {
  getAuthNValidationConfig,
  RemoteRepository,
} from '../../../../../src/shared/repository/remote';

jest.mock('../../../../../src/shared/utils/eventPublisher');
jest.useRealTimers();

describe(RemoteRepository, () => {
  describe(RemoteRepository.getNotifications, () => {
    const mockGet = jest.fn().mockName('mockGet');
    const mockEventPublisher = eventPublisher;
    const mockController = new AbortController();
    mockController.abort = jest.fn().mockName('mockAbortRequest');
    axios.get = mockGet;
    const credentials = {
      handle: '',
      token: '',
    };
    const getNotifications = () =>
      RemoteRepository.getNotifications(
        mockEventPublisher,
        mockController,
        credentials,
      );
    beforeEach(() => {
      jest.clearAllMocks();
      mockGet.mockClear();
    });
    it('makes a streamed response fetch request with the given abort controller', async () => {
      const notificationsURL = SERVER_URL.concat('/notifications');
      const expectedFetchConfig = {
        responseType: 'stream',
        signal: mockController.signal,
        ...getAuthNValidationConfig(credentials),
      };
      mockGet.mockResolvedValue({
        data: new Stream(),
      });
      await getNotifications();
      expect(mockGet).toBeCalledTimes(1);
      expect(mockGet).toBeCalledWith(notificationsURL, expectedFetchConfig);
    });
    it(
      'publishes the START_NOTIFICATION_LISTENER event and aborts the fetch request when ' +
        'the fetch output stream ends',
      async () => {
        const stream = new Stream();
        mockGet.mockResolvedValue({
          data: stream,
        });
        await getNotifications();
        stream.emit('end');
        expect(mockEventPublisher.publish).toBeCalledTimes(1);
        expect(mockEventPublisher.publish).toBeCalledWith(
          'START_NOTIFICATION_LISTENER',
        );
        expect(mockController.abort).toBeCalledTimes(1);
      },
    );
    it(
      'publishes the NEW_MESSAGE event and aborts the fetch request when the output stream ' +
        "emits a '1'",
      async () => {
        const stream = new Stream();
        mockGet.mockResolvedValueOnce({
          data: stream,
        });
        await getNotifications();
        stream.emit('data', '1');
        expect(mockEventPublisher.publish).toBeCalledTimes(1);
        expect(mockEventPublisher.publish).toBeCalledWith('NEW_MESSAGE');
        expect(mockController.abort).toBeCalledTimes(1);
      },
    );
    it('publishes the IDLE event when the output stream emits any other result', async () => {
      const stream = new Stream();
      mockGet.mockResolvedValueOnce({
        data: stream,
      });
      await getNotifications();
      const anyOtherResult = '3';
      stream.emit('data', anyOtherResult);
      expect(mockEventPublisher.publish).toBeCalledTimes(1);
      expect(mockEventPublisher.publish).toBeCalledWith('IDLE');
    });
    it('rethrows any error thrown during the fetch request', () => {
      const error = new Error('a test fetch error');
      mockGet.mockRejectedValueOnce(error);
      expect(getNotifications).rejects.toThrow(error);
    });
  });
});
