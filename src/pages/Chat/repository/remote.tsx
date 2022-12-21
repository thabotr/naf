import axios from 'axios';
import {SERVER_URL} from '../../../shared/routes/server';
import {
  handleFetchError,
  handleUnsuccessfulResponse,
} from '../../../shared/utils/remoteRepository';
import {Chat} from '../../../types/chat';
import {ChatRepository} from '../repository';

class RemoteChatRepository implements ChatRepository {
  async getChats(
    userToken: string,
    userHandle: string,
  ): Promise<Chat[] | null> {
    const headers: any = {
      token: userToken,
      handle: userHandle,
    };

    let response;
    try {
      response = await axios.get(`${SERVER_URL}/chats`, {
        headers: headers,
        validateStatus: status => status >= 200 && status < 600,
      });
      if (response.status === 200) {
        const chats: Chat[] = response.data;
        return chats;
      } else if (response.status === 204) {
        return null;
      }
    } catch (e) {
      handleFetchError(e);
    }
    handleUnsuccessfulResponse(response);
    return null;
  }
}

export {RemoteChatRepository};
