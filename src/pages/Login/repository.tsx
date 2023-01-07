import {Profile} from '../../types/user';

export interface LoginRepository {
  getUserProfile: (profileLastModified?: number) => Promise<Profile | null>;
}
