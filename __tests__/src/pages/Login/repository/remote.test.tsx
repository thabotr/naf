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
    test(
      'returns an undefined profile result when there ' +
        "is an error or fetch response status is neither 'OK' nor 'No Content'",
      async () => {
        expect.assertions(4);
        const profileLastModified = 10;
        const mockFetch = jest
          .fn()
          .mockResolvedValueOnce({status: 403})
          .mockRejectedValueOnce('an error')
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
        const profileResult2 = await repo.getUserProfile(
          'someToken',
          'someHandle',
          profileLastModified,
        );
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringMatching(expectedFetchURL),
          expectedFetchConfig,
        );
        expect(profileResult2).toBeUndefined();
      },
    );
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
