import { Message, MessageThread } from "./message"
import { User } from "./user"

export type Chat = {
  user: User,
  messages: Message[],
  messageThreads: MessageThread[]
}