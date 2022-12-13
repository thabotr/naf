import {log} from '../../shared/utils/logger';
import {Profile} from '../../types/user';

class LoginRepository {
  static async getUserProfile(
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
    try {
      const response = await fetch('http://10.0.2.2:3000/profile', {
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
      log('INFO', this.name, 'did not get status 200/204');
    } catch (e) {
      log('ERROR', this.name, e);
    }
    return;
  }
}

export {LoginRepository};
