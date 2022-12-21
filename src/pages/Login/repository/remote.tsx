import axios from 'axios';
import {SERVER_URL} from '../../../shared/routes/server';
import {
  handleFetchError,
  handleUnsuccessfulResponse,
} from '../../../shared/utils/remoteRepository';
import {Profile} from '../../../types/user';
import {LoginRepository} from '../repository';

class RemoteLoginRepository implements LoginRepository {
  async getUserProfile(
    userToken: string,
    userHandle: string,
    profileLastModified?: number,
  ): Promise<Profile | null> {
    const headers: any = {
      token: userToken,
      handle: userHandle,
    };

    if (profileLastModified !== undefined) {
      headers.lastmodified = profileLastModified;
    }

    let response;
    try {
      response = await axios.get(`${SERVER_URL}/profile`, {
        headers: headers,
        validateStatus: status => status >= 200 && status < 600,
      });
      if (response.status === 200) {
        const body = response.data;
        const profile: Profile = {
          ...body,
          token: userToken,
        };
        return profile;
      } else if (response.status === 204) {
        return null;
      }
    } catch (e) {
      handleFetchError(e);
    }
    handleUnsuccessfulResponse(response);
    return null;
  }
}

export {RemoteLoginRepository};
