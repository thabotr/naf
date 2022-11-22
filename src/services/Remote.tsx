import RNFetchBlob from 'rn-fetch-blob';
import {Chat} from '../types/chat';
import {Profile} from '../types/user';

class Remote {
  static async getProfile(
    token: string,
    handle: string,
    lastModified?: number,
  ): Promise<Profile | undefined> {
    try {
      const res = await RNFetchBlob.fetch(
        'GET',
        'http://10.0.2.2:3000/profile',
        {
          token: token,
          handle: handle,
          lastModified: (lastModified ?? 0).toString(),
        },
      );
      if (res.info().status === 200) {
        return {
          ...res.json(),
          credentials: {
            token: token,
            handle: handle,
          },
        } as Profile;
      } else if (res.info().status === 204) {
        return;
      }
      console.error('Remote.getProfile:', 'did not get status 200');
    } catch (e) {
      console.error('Remote.getProfile:', e);
    }
    return;
  }

  static async getChats(
    token: string,
    handle: string,
    lastModified?: number,
  ): Promise<Chat[] | undefined> {
    try {
      const res = await RNFetchBlob.fetch(
        'GET',
        'http://localhost:3000/chats',
        {
          token: token,
          handle: handle,
          lastModified: (lastModified ?? 0).toString(),
        },
      );
      if (res.info().status === 200) {
        return res.json() as Chat[];
      }
      console.error('Remote.getChats:', 'did not get status 200');
    } catch (e) {
      console.error('Remote.getChats:', e);
    }
    return;
  }
}

export {Remote};
