import axios from 'axios';
import {RemoteLoginRepository} from '../../../../../../src/pages/Login/repository/remote';
import {Profile} from '../../../../../../src/types/user';
import {Buffer} from 'buffer';

jest.useRealTimers();
const mockFetch = jest.fn().mockName('mockFetch');
describe(RemoteLoginRepository, () => {
  const repo = new RemoteLoginRepository();
  const fetchErrorMessage = 'intentional testing error';
  const expectedFetchURL = /.+/;
  const token = 'someTestToken';
  const handle = 'w/someTestHandle';
  repo.setCredentials(token, handle);
  const encodedCredentials = Buffer.from(`${handle}:${token}`).toString(
    'base64',
  );
  const profileLastModified = 10;
  const expectedFetchConfig = {
    headers: {
      Authorization: `Basic ${encodedCredentials}`,
      lastmodified: profileLastModified,
    },
    validateStatus: expect.anything(),
  };
  beforeAll(() => {
    axios.get = mockFetch;
  });
  beforeEach(() => {
    mockFetch.mockReset();
  });
  describe('getUserProfile', () => {
    test(
      'should include lastmodified header in the fetch request if ' +
        'and only if the profileLastModified argument is specified',
      async () => {
        expect.assertions(2);
        mockFetch.mockResolvedValueOnce({status: 204});
        mockFetch.mockResolvedValueOnce({status: 204});
        await repo.getUserProfile();
        const fetchConfigWithoutLastModified = {
          headers: {
            Authorization: expect.anything(),
          },
          validateStatus: expect.anything(),
        };
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringMatching(expectedFetchURL),
          fetchConfigWithoutLastModified,
        );

        const fetchConfigWithLastModified = expectedFetchConfig;
        await repo.getUserProfile(expectedFetchConfig.headers.lastmodified);
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringMatching(expectedFetchURL),
          fetchConfigWithLastModified,
        );
      },
    );
    test(
      'returns a null profile result when the ' +
        "fetch response status is 'No Content'",
      async () => {
        expect.assertions(2);
        mockFetch.mockResolvedValueOnce({status: 204});
        const profileResult = await repo.getUserProfile(profileLastModified);
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringMatching(expectedFetchURL),
          expectedFetchConfig,
        );
        expect(profileResult).toBeNull();
      },
    );
    // eslint-disable-next-line require-await
    test("throws login error 'AUTH_ERROR' when server returns a client error", async () => {
      expect.assertions(2);
      mockFetch.mockResolvedValueOnce({
        status: 403,
        data: fetchErrorMessage,
      });
      expect(repo.getUserProfile(profileLastModified)).rejects.toThrow(
        'AUTH_ERROR',
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringMatching(expectedFetchURL),
        expectedFetchConfig,
      );
    });
    // eslint-disable-next-line require-await
    test("throws login error 'SERVER_ERROR' when server returns a server error", async () => {
      expect.assertions(2);
      mockFetch.mockResolvedValueOnce({
        status: 500,
        data: fetchErrorMessage,
      });
      expect(repo.getUserProfile(profileLastModified)).rejects.toThrow(
        'SERVER_ERROR',
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringMatching(expectedFetchURL),
        expectedFetchConfig,
      );
    });
    // eslint-disable-next-line require-await
    test("throws login error 'NET_ERROR' when connection times out", async () => {
      expect.assertions(2);
      mockFetch.mockRejectedValueOnce(
        'intentional testing network error: connection timedout',
      );
      expect(repo.getUserProfile(profileLastModified)).rejects.toThrow(
        'NET_ERROR',
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringMatching(expectedFetchURL),
        expectedFetchConfig,
      );
    });
    // eslint-disable-next-line require-await
    test("throws login error 'APP_ERROR' when fetch encounters an unknown error", async () => {
      expect.assertions(2);
      mockFetch.mockRejectedValue('some intentional testing error');
      expect(repo.getUserProfile(profileLastModified)).rejects.toThrow(
        'APP_ERROR',
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringMatching(expectedFetchURL),
        expectedFetchConfig,
      );
    });
    test("returns a valid user profile result when the fetch response status is 'OK'", async () => {
      expect.assertions(2);
      const expectedUserProfile: Profile = {
        avatarURI: '',
        connections: {},
        handle: handle,
        initials: '',
        landscapeURI: '',
        lastModified: 0,
        listenWithMeURI: '',
        name: '',
        surname: '',
        waitingForThem: {},
        token: token,
        waitingForYou: {},
      };
      mockFetch.mockResolvedValueOnce({
        status: 200,
        data: expectedUserProfile,
      });
      const profileResult = await repo.getUserProfile();
      const expectedProfileFetchConfig = {
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
        },
        validateStatus: expect.anything(),
      };
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringMatching(expectedFetchURL),
        expectedProfileFetchConfig,
      );
      expect(profileResult).toMatchObject(expectedUserProfile);
    });
  });
});
