import axios, {AxiosRequestConfig} from 'axios';
import {SERVER_URL} from '../../../shared/routes/server';
import {
  handleFetchError,
  handleUnsuccessfulResponse,
} from '../../../shared/utils/remoteRepository';
import {Chat} from '../../../types/chat';
import {ChatRepository} from '../repository';
import {Message} from '../types/Message';

class RemoteChatRepository implements ChatRepository {
  async getChats(
    userToken: string,
    userHandle: string,
  ): Promise<Chat[] | null> {
    const headers: Record<string, string> = {
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

  async postMessage(
    userToken: string,
    userHandle: string,
    message: Message,
  ): Promise<Message> {
    const headers: Record<string, string> = {
      token: userToken,
      handle: userHandle,
    };
    let response;
    try {
      const config: AxiosRequestConfig<Message> = {
        headers: headers,
        validateStatus: (status: number) => status >= 200 && status < 600,
      };
      const sanitizedMessage: Omit<Message, 'timestamp'> = message;
      console.log(sanitizedMessage);
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
