import axios from 'axios';
import {Buffer} from 'buffer';
import {Credentials} from '../../../../../src/pages/Login/Login';
import {HelperText} from '../../../../../src/shared/middleware';
import {
  HttpStatusCode,
  RemoteRepository,
} from '../../../../../src/shared/repository/remote';

jest.useRealTimers();

describe('Repository', () => {
  describe('RemoteRepository', () => {
    describe('createProfile', () => {
      const mockPost = jest.fn().mockName('mockPost');
      beforeEach(() => {
        mockPost.mockClear();
        axios.post = mockPost;
      });
      const credentials: Credentials = {
        handle: 'w/handle',
        token: 'tokentoken',
      };
      it('should call axios post with the correct arguments', () => {
        expect.assertions(2);
        const url = RemoteRepository.profilesURL;
        const data = undefined;
        const encodedCredentials = Buffer.from(
          `${credentials.handle}:${credentials.token}`,
        ).toString('base64');
        const config = {
          headers: {
            Authorization: 'Basic '.concat(encodedCredentials),
          },
          validateStatus: RemoteRepository.validateAllStatuses,
        };
        RemoteRepository.createProfile(credentials);
        expect(mockPost).toHaveBeenCalledTimes(1);
        expect(mockPost).toHaveBeenCalledWith(url, data, config);
      });
      it(
        'throws error to indicate that the given handle is already registered on ' +
          "fetch status 'Conflict'",
        async () => {
          expect.assertions(1);
          mockPost.mockResolvedValueOnce({
            status: HttpStatusCode.Conflict,
          });
          await expect(
            RemoteRepository.createProfile(credentials),
          ).rejects.toThrow(HelperText.handleAlreadyTaken);
        },
      );
      it('throws an unkown error when axios post throws any error', async () => {
        expect.assertions(1);
        mockPost.mockRejectedValueOnce(
          'some expected error for testing createProfile',
        );
        await expect(
          RemoteRepository.createProfile(credentials),
        ).rejects.toThrow(HelperText.unknownError);
      });
      it("returns the user credentials on fetch status 'Created'", async () => {
        expect.assertions(1);
        mockPost.mockResolvedValueOnce({
          status: HttpStatusCode.Created,
        });
        await expect(RemoteRepository.createProfile(credentials)).resolves.toBe(
          credentials,
        );
      });
      it(
        'throws error to indicate that an unknown error occurred on ' +
          "any other status that is not 'Conflict' or 'Created'",
        async () => {
          expect.assertions(1);
          mockPost.mockResolvedValueOnce({
            status: HttpStatusCode.NotFound,
          });
          await expect(
            RemoteRepository.createProfile(credentials),
          ).rejects.toThrow(HelperText.unknownError);
        },
      );
    });
  });
});
