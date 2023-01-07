import axios from 'axios';
import {Buffer} from 'buffer';
import {RemoteChatProfileRepository} from '../../../../../../src/pages/ChatProfile/repository/remote';
import {RemoteRepository} from '../../../../../../src/shared/repository/remote';
import {SERVER_URL} from '../../../../../../src/shared/routes/server';
import {CHATS} from '../../../../../mockdata/chat';
import {PROFILE} from '../../../../../mockdata/profile';

jest.useRealTimers();
const mockDelete = jest.fn().mockName('mockDelete');
const repo = new RemoteChatProfileRepository();
describe(RemoteChatProfileRepository, () => {
  describe(repo.deleteConnection, () => {
    const currentChat = CHATS[0];
    const expectedDeleteURL = `${SERVER_URL}/connections/${currentChat.user.handle}`;
    const encodedCredentials = Buffer.from(
      `${PROFILE.handle}:${PROFILE.token}`,
    ).toString('base64');
    const expectedDeleteConfig = {
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
      },
      validateStatus: expect.anything(),
    };
    RemoteRepository.setCredentials(PROFILE.token, PROFILE.handle);
    beforeAll(() => {
      axios.delete = mockDelete;
    });
    beforeEach(() => {
      mockDelete.mockReset();
    });
    test("returns true when the delete response status is 'OK'", async () => {
      expect.assertions(2);
      mockDelete.mockResolvedValueOnce({
        status: 200,
      });
      const deleteResult = await repo.deleteConnection(currentChat.user.handle);
      expect(mockDelete).toHaveBeenCalledWith(
        expect.stringMatching(expectedDeleteURL),
        expectedDeleteConfig,
      );
      expect(deleteResult).toBeTruthy();
    });
  });
});
