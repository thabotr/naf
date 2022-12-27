import axios from 'axios';
import {RemoteChatProfileRepository} from '../../../../../../src/pages/ChatProfile/repository/remote';
import {SERVER_URL} from '../../../../../../src/shared/routes/server';
import {CHATS} from '../../../../../mockdata/chat';
import {PROFILE} from '../../../../../mockdata/profile';

jest.useRealTimers();
const mockDelete = jest.fn().mockName('mockDelete');
const repo = new RemoteChatProfileRepository();
describe(RemoteChatProfileRepository, () => {
  describe(repo.deleteConnection, () => {
    const currentChat = CHATS[0];
    const expectedDeleteURL = `${SERVER_URL}/connections/${encodeURIComponent(
      currentChat.user.handle,
    )}`;
    const expectedDeleteConfig = {
      headers: {
        token: PROFILE.token,
        handle: PROFILE.handle,
      },
      validateStatus: expect.anything(),
    };
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
      const deleteResult = await repo.deleteConnection(
        PROFILE.token,
        PROFILE.handle,
        currentChat.user.handle,
      );
      expect(mockDelete).toHaveBeenCalledWith(
        expect.stringMatching(expectedDeleteURL),
        expectedDeleteConfig,
      );
      expect(deleteResult).toBeTruthy();
    });
  });
});
