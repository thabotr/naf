import axios from 'axios';
import {SERVER_URL} from '../../../shared/routes/server';
import {
  handleFetchError,
  handleUnsuccessfulResponse,
} from '../../../shared/utils/remoteRepository';

class RemoteChatProfileRepository {
  async deleteConnection(
    userToken: string,
    userHandle: string,
    chatUserHandle: string,
  ): Promise<boolean> {
    const headers: any = {
      token: userToken,
      handle: userHandle,
    };

    let response;
    try {
      const encodedChatHandle = encodeURIComponent(chatUserHandle);
      response = await axios.delete(
        `${SERVER_URL}/connections/${encodedChatHandle}`,
        {
          headers: headers,
          validateStatus: status => status >= 200 && status < 600,
        },
      );
      if (response.status === 200) {
        return true;
      }
    } catch (e) {
      handleFetchError(e);
    }
    handleUnsuccessfulResponse(response);
    return false;
  }
}

export {RemoteChatProfileRepository};
