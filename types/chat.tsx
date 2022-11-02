import { Message } from "../context/messageEditor"
import { MessageThread } from "./message"
import { User } from "./user"

export type Chat = {
  user: User,
  messages: Message[],
  messageThreads: MessageThread[]
}