import {Profile} from '../../types/user';

export interface LoginRepository {
  getUserProfile: (
    userToken: string,
    userHandle: string,
    profileLastModified?: number,
  ) => Promise<Profile | null>;
}
