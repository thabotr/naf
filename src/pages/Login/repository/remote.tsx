import {log} from '../../../shared/utils/logger';
import {Profile} from '../../../types/user';
import {LoginRepository} from '../repository';

class RemoteLoginRepository implements LoginRepository {
  async getUserProfile(
    userToken: string,
    userHandle: string,
    profileLastModified?: number,
  ): Promise<Profile | undefined> {
    const headers: string[][] = [
      ['token', userToken],
      ['handle', userHandle],
    ];
    profileLastModified &&
      headers.push(['lastmodified', `${profileLastModified}`]);
    let response;
    try {
      response = await fetch('http://10.0.2.2:3000/profile', {
        method: 'GET',
        headers: headers,
      });
      if (response.status === 200) {
        const body = await response.json();
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
      if (`${e}`.includes('timeout')) {
        throw new Error('NET_ERROR');
      } else {
        throw new Error('APP_ERROR');
      }
    }
    if (response.status >= 500) {
      throw new Error('SERVER_ERROR');
    }
    throw new Error('AUTH_ERROR');
  }
}

export {RemoteLoginRepository};
