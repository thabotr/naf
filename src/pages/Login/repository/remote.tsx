import axios from 'axios';
import {log} from '../../../shared/utils/logger';
import {Profile} from '../../../types/user';
import {LoginRepository} from '../repository';

class RemoteLoginRepository implements LoginRepository {
  async getUserProfile(
    userToken: string,
    userHandle: string,
    profileLastModified?: number,
  ): Promise<Profile | undefined> {
    const headers: any = {
      token: userToken,
      handle: userHandle,
    };

    if (profileLastModified !== undefined) {
      headers.lastmodified = profileLastModified;
    }

    let response;
    try {
      response = await axios.get('http://10.0.2.2:3000/profile', {
        headers: headers,
      });
      if (response.status === 200) {
        const body = response.data;
        const profile: Profile = {
          ...body,
          token: userToken,
        };
        return profile;
      } else if (response.status === 204) {
        return;
      }
    } catch (e) {
      log('ERROR', 'RemoteLoginRepository', e);
      if (`${e}`.includes('timedout')) {
        throw new Error('NET_ERROR');
      } else {
        throw new Error('APP_ERROR');
      }
    }
    log(
      'ERROR',
      'RemoteLoginRepository',
      'server response status: '
        .concat(response.status.toString())
        .concat('. Reason: ')
        .concat(response.data),
    );
    if (response.status >= 500) {
      throw new Error('SERVER_ERROR');
    }
    throw new Error('AUTH_ERROR');
  }
}

export {RemoteLoginRepository};
