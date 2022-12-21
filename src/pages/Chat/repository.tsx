import {Chat} from '../../types/chat';

export interface ChatRepository {
  getChats(userToken: string, userHandle: string): Promise<Chat[] | null>;
}
