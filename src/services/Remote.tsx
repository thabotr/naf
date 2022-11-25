import RNFetchBlob from 'rn-fetch-blob';
import {Chat} from '../types/chat';
import {Profile, WaiterType, WaitingForYouType} from '../types/user';

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

  static async acceptConnection(
    token: string,
    handle: string,
    wfy: WaitingForYouType,
    wt: WaiterType,
  ): Promise<Chat | undefined> {
    try {
      const res = await RNFetchBlob.fetch(
        'POST',
        'http://10.0.2.2:3000/connection',
        {
          token: token,
          handle: handle,
          'Content-Type': 'application/json',
        },
        JSON.stringify({
          ...wfy.at,
          userHandle: wt.user.handle,
        }),
      );

      if (res.info().status === 200) {
        return res.json() as Chat;
      }
    } catch (e) {
      console.error('Remote.acceptConnection:', e);
    }
    return;
  }

  static async getChats(
    token: string,
    handle: string,
    lastModified?: number,
  ): Promise<Chat[] | undefined> {
    try {
      const res = await RNFetchBlob.fetch('GET', 'http://10.0.2.2:3000/chats', {
        token: token,
        handle: handle,
      });
      if (res.info().status === 200) {
        return res.json() as Chat[];
      }
      console.error('Remote.getChats:', 'did not get status 200');
    } catch (e) {
      console.error('Remote.getChats:', e);
    }
    return;
  }
  static async deleteConnection(
    token: string,
    handle: string,
    userHandle: string,
  ): Promise<boolean> {
    try {
      const res = await RNFetchBlob.fetch(
        'GET',
        'http://10.0.2.2:3000/chats',
        {
          token: token,
          handle: handle,
          'Content-Type': 'application/json',
        },
        JSON.stringify({userHandle: userHandle}),
      );
      if (res.info().status === 200) {
        return true;
      }
      console.error('Remote.getChats:', 'did not get status 200');
    } catch (e) {
      console.error('Remote.getChats:', e);
    }
    return false;
  }
}

export {Remote};
