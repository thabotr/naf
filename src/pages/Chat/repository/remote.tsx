import axios, {AxiosRequestConfig} from 'axios';
import {RemoteRepository} from '../../../shared/repository/remote';
import {SERVER_URL} from '../../../shared/routes/server';
import {
  handleFetchError,
  handleUnsuccessfulResponse,
} from '../../../shared/utils/remoteRepository';
import {Chat} from '../../../types/chat';
import {ChatRepository} from '../repository';
import {Message} from '../types/Message';

class RemoteChatRepository extends RemoteRepository implements ChatRepository {
  async getChats(): Promise<Chat[] | null> {
    let response;
    try {
      response = await axios.get(`${SERVER_URL}/chats`, {
        headers: RemoteRepository.basicAuthHeader,
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

  async postMessage(message: Message): Promise<Message> {
    let response;
    try {
      const config: AxiosRequestConfig<Message> = {
        headers: RemoteRepository.basicAuthHeader,
        validateStatus: (status: number) => status >= 200 && status < 600,
      };
      const sanitizedMessage: Omit<Message, 'timestamp'> = message;
      response = await axios.post(
        `${SERVER_URL}/messages`,
        sanitizedMessage,
        config,
      );
      if (response.status === 201) {
        const remoteMessage: Pick<Message, 'timestamp'> = response.data;
        return {
          ...sanitizedMessage,
          ...remoteMessage,
        };
      }
    } catch (e) {
      handleFetchError(e);
    }
    return handleUnsuccessfulResponse(response);
  }
}

export {RemoteChatRepository};
