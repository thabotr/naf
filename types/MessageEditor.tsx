import { Message } from "../context/messageEditor";

export type MessageEditorContextType = {
  message: Message;
  composing: boolean,
  setComposeOn: (b: boolean) => void;
  saveMessage: (m: Message) => void;
}