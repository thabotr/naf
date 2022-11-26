import RNFetchBlob from 'rn-fetch-blob';
import {Chat} from '../types/chat';
import {Profile, WFTType, WFYType} from '../types/user';

class Remote {
  static async getProfile(
    token: string,
    handle: string,
    lastModified?: number,
  ): Promise<Profile | undefined> {
    const headers: {[key: string]: any} = {
      token: token,
      handle: handle,
    };
    if (lastModified !== undefined) {
      headers['lastmodified'] = lastModified;
    }
    try {
      const res = await RNFetchBlob.fetch(
        'GET',
        'http://10.0.2.2:3000/profile',
        headers,
      );
      if (res.info().status === 200) {
        return {
          ...res.json(),
          token: token,
        } as Profile;
      } else if (res.info().status === 204) {
        return;
      }
      console.error('Remote.getProfile:', 'did not get status 200/204');
    } catch (e) {
      console.error('Remote.getProfile:', e);
    }
    return;
  }

  static async acceptConnection(
    token: string,
    handle: string,
    at: string,
    waiterHandle: string,
  ): Promise<Chat | undefined> {
    try {
      const body = JSON.stringify({
        at: at,
        waiterHandle: waiterHandle,
      });
      const res = await fetch('http://10.0.2.2:3000/connection',{
        method: 'POST',
        headers: {
          token: token,
          handle: handle,
          'Content-Type': 'application/json',
        },
        body: body,
      });

      if (res.status === 200) {
        const chat = await res.json();
        return {
          ...chat,
          messages: [],
          messageThreads: [],
        } as Chat;
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
    const headers: {[key: string]: any} = {
      token: token,
      handle: handle,
    };
    if (lastModified !== undefined) {
      headers['lastmodified'] = lastModified;
    }
    try {
      const res = await RNFetchBlob.fetch(
        'GET',
        'http://10.0.2.2:3000/chats',
        headers,
      );
      if (res.info().status === 200) {
        const chats = res.json() as Chat[];
        chats.forEach(c=>{
          if(!c.messages){
            c.messages = [];
          }
          if(!c.messageThreads){
            c.messageThreads = [];
          }
        })
        return chats;
      } else if (res.info().status === 204) {
        return;
      }
      console.error('Remote.getChats:', 'did not get status 200 or 204');
    } catch (e) {
      console.error('Remote.getChats:', e);
    }
    return;
  }

  static async deleteWaitForYouUser(
    token: string,
    handle: string,
    at: string,
    waiterHandle: string,
  ): Promise<boolean> {
    try {
      const res = await fetch('http://10.0.2.2:3000/waitforyou/user',{
        method: 'DELETE',
        headers: {
          token: token,
          handle: handle,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({at: at, waiterHandle: waiterHandle}),
      })
      if (res.status === 200) {
        return true;
      }
      console.error('Remote.deleteWaitForYouUser:', 'did not get status 200. got status', res.status);
    } catch (e) {
      console.error('Remote.deleteWaitForYouUser:', e);
    }
    return false;
  }

  static async deleteWaitForYou(
    token: string,
    handle: string,
    at: string,
  ): Promise<boolean> {
    try {
      const res = await fetch('http://10.0.2.2:3000/waitforyou',{
        method: 'DELETE',
        headers: {
          token: token,
          handle: handle,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({at: at}),
      })
      if (res.status === 200) {
        return true;
      }
      console.error('Remote.deleteWaitForYou:', 'did not get status 200. got status', res.status);
    } catch (e) {
      console.error('Remote.deleteWaitForYou:', e);
    }
    return false;
  }
  static async deleteWaitForThem(
    token: string,
    handle: string,
    userHandle: string,
  ): Promise<boolean> {
    try {
      const res = await fetch('http://10.0.2.2:3000/waitforthem',{
        method: 'DELETE',
        headers: {
          token: token,
          handle: handle,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({to: userHandle}),
      })
      if (res.status === 200) {
        return true;
      }
      console.error('Remote.deleteWaitForThem:', 'did not get status 200. got status', res.status);
    } catch (e) {
      console.error('Remote.deleteWaitForThem:', e);
    }
    return false;
  }
  static async addWaitForThem(
    token: string,
    handle: string,
    at: string,
    userHandle: string,
  ): Promise<WFTType|undefined> {
    try {
      const res = await fetch('http://10.0.2.2:3000/waitforthem',{
        method: 'POST',
        headers: {
          token: token,
          handle: handle,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({at: at, to: userHandle}),
      })
      if (res.status === 201) {
        return await res.json() as WFTType;
      }
      console.log(await res.text());
      console.error('Remote.addWaitForThem:', 'did not get status 201. got status', res.status);
    } catch (e) {
      console.error('Remote.addWaitForThem:', e);
    }
    return;
  }
  static async addWaitForYou(
    token: string,
    handle: string,
    at: string,
  ): Promise<WFYType|undefined> {
    try {
      const res = await fetch('http://10.0.2.2:3000/waitforyou',{
        method: 'POST',
        headers: {
          token: token,
          handle: handle,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({at: at}),
      })
      if (res.status === 200) {
        const wfy = await res.json() as WFYType;
        if(!wfy[at].waiters){
          wfy[at].waiters = {};
        }
        return wfy;
      }
      console.error('Remote.addWaitForYou:', 'did not get status 200. got status', res.status);
    } catch (e) {
      console.error('Remote.addWaitForYou:', e);
    }
    return;
  }
}

export {Remote};
