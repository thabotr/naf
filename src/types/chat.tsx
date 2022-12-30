import {Message} from '../pages/Chat/types/Message';
import {MessageThread} from './message';
import {User} from './user';

export type Chat = {
  user: User;
  messages: Message[];
  messageThreads: MessageThread[];
  lastModified: number;
};
