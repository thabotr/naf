export enum DeliveryStatusType {
  ERROR,
  UNSEEN,
  SEEN,
  NONE,
}

export type Link = {id: string; nextIds: string[]; prevIds: string[]};

export type MessageThread = {id: string; title: string; messageLinks: Link[]};

export type VoiceNoteType = FileType & {duration: number};

export type FileType = {size: number; name?: string; type: string; uri: string};

export type Message = {
  from: string;
  to: string;
  id: number;
  text?: string;
  voiceRecordings: VoiceNoteType[];
  files: FileType[];
  status?: 'NONE' | 'SENT' | 'DELIVERED' | 'SEEN' | 'REPLIED' | 'ERROR';
  unread?: boolean;
  draft?: boolean;
};

export type MessagePK = {toHandle: string; fromHandle: string; id: number};
