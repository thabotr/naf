import RNFetchBlob from 'rn-fetch-blob';
import {Chat} from '../types/chat';
import {URLS} from '../types/routes';

const remoteGetChats = async (): Promise<Chat[] | undefined> => {
  try {
    const res = await RNFetchBlob.fetch('GET', URLS.CHATS);
    if (res.info().status === 200) {
      const cs = res.json() as Chat[];
      cs.forEach(c => {
        c.messages.forEach(m => {
          if (!m.files) m.files = [];
          if (!m.voiceRecordings) m.voiceRecordings = [];
        });
      });
      return cs;
    }
  } catch (e) {
    console.log('error fetching chats:', e);
  }
};

export {remoteGetChats};
