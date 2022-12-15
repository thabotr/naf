import {RemoteLoginRepository} from '../../../../../src/pages/Login/repository/remote';
import {Profile} from '../../../../../src/types/user';

jest.useRealTimers();

describe(RemoteLoginRepository, () => {
  const repo = new RemoteLoginRepository();
  describe('getUserProfile', () => {
    test(
      'should include lastmodified header in the fetch request if ' +
        'and only if the profileLastModified argument is specified',
      async () => {
        expect.assertions(2);
        const mockFetch = jest
          .fn()
          .mockResolvedValue({status: 204})
          .mockName('mockFetch');
        global.fetch = mockFetch;

        await repo.getUserProfile('', '');
        const fetchConfigWithoutLastModified = {
          method: 'GET',
          headers: [
            ['token', ''],
            ['handle', ''],
          ],
        };
        const expectedFetchURL = /.+/;
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringMatching(expectedFetchURL),
          fetchConfigWithoutLastModified,
        );

        const profileLastModified = 10;
        const fetchConfigWithLastModified = {
          method: 'GET',
          headers: [
            ['token', ''],
            ['handle', ''],
            ['lastmodified', `${profileLastModified}`],
          ],
        };
        await repo.getUserProfile('', '', profileLastModified);
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringMatching(expectedFetchURL),
          fetchConfigWithLastModified,
        );
      },
    );
    test(
      'returns an undefined profile result when the ' +
        "fetch response status is 'No Content'",
      async () => {
        expect.assertions(2);
        const profileLastModified = 10;
        const mockFetch = jest
          .fn()
          .mockResolvedValue({status: 204})
          .mockName('mockFetch');
        global.fetch = mockFetch;
        const profileResult = await repo.getUserProfile(
          'someToken',
          'someHandle',
          profileLastModified,
        );
        const expectedFetchURL = /.+/;
        const expectedFetchConfig = {
          method: 'GET',
          headers: [
            ['token', 'someToken'],
            ['handle', 'someHandle'],
            ['lastmodified', `${profileLastModified}`],
          ],
        };
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringMatching(expectedFetchURL),
          expectedFetchConfig,
        );
        expect(profileResult).toBeUndefined();
      },
    );
    // eslint-disable-next-line require-await
    test("throws login error 'AUTH_ERROR' when server returns a client error", async () => {
      expect.assertions(2);
      const profileLastModified = 10;
      const mockFetch = jest
        .fn()
        .mockResolvedValueOnce({status: 403})
        .mockName('mockFetch');
      global.fetch = mockFetch;
      expect(
        repo.getUserProfile('someToken', 'someHandle', profileLastModified),
      ).rejects.toThrow('AUTH_ERROR');
      const expectedFetchURL = /.+/;
      const expectedFetchConfig = {
        method: 'GET',
        headers: [
          ['token', 'someToken'],
          ['handle', 'someHandle'],
          ['lastmodified', `${profileLastModified}`],
        ],
      };
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringMatching(expectedFetchURL),
        expectedFetchConfig,
      );
    });
    // eslint-disable-next-line require-await
    test("throws login error 'SERVER_ERROR' when server returns a server error", async () => {
      expect.assertions(2);
      const profileLastModified = 10;
      const mockFetch = jest
        .fn()
        .mockResolvedValueOnce({status: 500})
        .mockName('mockFetch');
      global.fetch = mockFetch;
      expect(
        repo.getUserProfile('someToken', 'someHandle', profileLastModified),
      ).rejects.toThrow('SERVER_ERROR');
      const expectedFetchURL = /.+/;
      const expectedFetchConfig = {
        method: 'GET',
        headers: [
          ['token', 'someToken'],
          ['handle', 'someHandle'],
          ['lastmodified', `${profileLastModified}`],
        ],
      };
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringMatching(expectedFetchURL),
        expectedFetchConfig,
      );
    });
    // eslint-disable-next-line require-await
    test("throws login error 'NET_ERROR' when connection times out", async () => {
      expect.assertions(2);
      const profileLastModified = 10;
      const mockFetch = jest
        .fn()
        .mockRejectedValue('network error: connection timeout')
        .mockName('mockFetch');
      global.fetch = mockFetch;
      expect(
        repo.getUserProfile('someToken', 'someHandle', profileLastModified),
      ).rejects.toThrow('NET_ERROR');
      const expectedFetchURL = /.+/;
      const expectedFetchConfig = {
        method: 'GET',
        headers: [
          ['token', 'someToken'],
          ['handle', 'someHandle'],
          ['lastmodified', `${profileLastModified}`],
        ],
      };
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringMatching(expectedFetchURL),
        expectedFetchConfig,
      );
    });
    // eslint-disable-next-line require-await
    test("throws login error 'APP_ERROR' when fetch encounters an unknown error", async () => {
      expect.assertions(2);
      const profileLastModified = 10;
      const mockFetch = jest
        .fn()
        .mockRejectedValue('some error')
        .mockName('mockFetch');
      global.fetch = mockFetch;
      expect(
        repo.getUserProfile('someToken', 'someHandle', profileLastModified),
      ).rejects.toThrow('APP_ERROR');
      const expectedFetchURL = /.+/;
      const expectedFetchConfig = {
        method: 'GET',
        headers: [
          ['token', 'someToken'],
          ['handle', 'someHandle'],
          ['lastmodified', `${profileLastModified}`],
        ],
      };
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
        handle: 'someHandle',
        initials: '',
        landscapeURI: '',
        lastModified: 0,
        listenWithMeURI: '',
        name: '',
        surname: '',
        waitingForThem: {},
        token: 'someToken',
        waitingForYou: {},
      };
      const mockFetch = jest
        .fn()
        .mockResolvedValue({
          status: 200,
          json: jest.fn().mockResolvedValue(expectedUserProfile),
        })
        .mockName('mockFetch');
      global.fetch = mockFetch;
      const profileResult = await repo.getUserProfile(
        expectedUserProfile.token,
        expectedUserProfile.handle,
      );
      const expectedFetchURL = /.+/;
      const expectedFetchConfig = {
        method: 'GET',
        headers: [
          ['token', expectedUserProfile.token],
          ['handle', expectedUserProfile.handle],
        ],
      };
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringMatching(expectedFetchURL),
        expectedFetchConfig,
      );
      expect(profileResult).toMatchObject(expectedUserProfile);
    });
  });
});
