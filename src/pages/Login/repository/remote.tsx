/* eslint-disable brace-style */
import axios from 'axios';
import {SERVER_URL} from '../../../shared/routes/server';
import {
  handleFetchError,
  handleUnsuccessfulResponse,
} from '../../../shared/utils/remoteRepository';
import {Profile} from '../../../types/user';
import {LoginRepository} from '../repository';
import {RemoteRepository} from '../../../shared/repository/remote';

class RemoteLoginRepository
  extends RemoteRepository
  implements LoginRepository
{
  async getUserProfile(profileLastModified?: number): Promise<Profile | null> {
    const credentialsDefined = this.handle && this.token;
    if (!credentialsDefined) {
      throw new Error('credentials missing');
    }
    const headers: Record<string, string | number> = {
      ...this.basicAuthHeader,
    };

    if (profileLastModified !== undefined) {
      headers.lastmodified = profileLastModified;
    }

    let response;
    try {
      response = await axios.get(`${SERVER_URL}/profiles`, {
        headers: headers,
        validateStatus: status => status >= 200 && status < 600,
      });
      if (response.status === 200) {
        const body = response.data;
        const profile: Profile = {
          ...body,
          token: this.token,
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
