import axios from 'axios';
import {RemoteRepository} from '../../../shared/repository/remote';
import {SERVER_URL} from '../../../shared/routes/server';
import {
  handleFetchError,
  handleUnsuccessfulResponse,
} from '../../../shared/utils/remoteRepository';

class RemoteChatProfileRepository {
  async deleteConnection(chatUserHandle: string): Promise<boolean> {
    let response;
    try {
      response = await axios.delete(
        `${SERVER_URL}/connections/${chatUserHandle}`,
        {
          headers: RemoteRepository.basicAuthHeader,
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
