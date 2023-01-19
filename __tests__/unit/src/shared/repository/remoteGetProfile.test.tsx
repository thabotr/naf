import axios from 'axios';
import {
  getAuthNValidationConfig,
  RemoteRepository,
} from '../../../../../src/shared/repository/remote';
import {HelperText} from '../../../../../src/shared/middleware';
import {SERVER_URL} from '../../../../../src/shared/routes/server';

jest.useRealTimers();
const mockFetch = jest.fn().mockName('mockFetch');
describe(RemoteRepository, () => {
  const fetchErrorMessage = 'intentional testing error';
  const expectedFetchURL = SERVER_URL.concat('/profiles');
  const token = 'someTestToken';
  const handle = 'w/someTestHandle';
  RemoteRepository.setCredentials(token, handle);
  beforeEach(() => {
    mockFetch.mockClear();
    axios.get = mockFetch;
  });
  const getUserProfile = () =>
    RemoteRepository.getUserProfile({handle: handle, token: token});
  describe('getUserProfile', () => {
    test('should call the fetch function with the correct arguments', async () => {
      expect.assertions(1);
      mockFetch.mockResolvedValueOnce({status: 200, data: {}});
      await getUserProfile();
      const fetchConfig = getAuthNValidationConfig({
        handle: handle,
        token: token,
      });
      expect(mockFetch).toHaveBeenCalledWith(expectedFetchURL, fetchConfig);
    });
    test("throws an authorization error when server returns status 'Unauthorized'", async () => {
      expect.assertions(1);
      mockFetch.mockResolvedValueOnce({
        status: 401,
      });
      await expect(getUserProfile()).rejects.toThrow(
        HelperText.authorizationError,
      );
    });
    test('throws unkown error when fetch throws an error', async () => {
      expect.assertions(1);
      mockFetch.mockRejectedValue('some intentional testing error');
      await expect(getUserProfile()).rejects.toThrow(HelperText.unknownError);
    });
    test("returns a valid user profile result when the fetch response status is 'OK'", async () => {
      expect.assertions(1);
      const expectedUserProfile = {
        token: token,
        handle: handle,
      };
      mockFetch.mockResolvedValueOnce({
        status: 200,
        data: expectedUserProfile,
      });
      await expect(getUserProfile()).resolves.toMatchObject(
        expectedUserProfile,
      );
    });
    test(
      "throws unknown error when fetch returns any other status besides 'OK' or " +
        "'Unauthorized'",
      async () => {
        expect.assertions(1);
        mockFetch.mockResolvedValueOnce({status: 404});
        await expect(getUserProfile()).rejects.toThrow(HelperText.unknownError);
      },
    );
  });
});
