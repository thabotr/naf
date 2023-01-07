import {Buffer} from 'buffer';

class RemoteRepository {
  static handle = '';
  static token = '';
  static basicAuthHeader: Record<string, string | number> = {};

  static setCredentials(token: string, handle: string): void {
    RemoteRepository.handle = handle;
    RemoteRepository.token = token;
    const encodedCredentials = Buffer.from(`${handle}:${token}`).toString(
      'base64',
    );
    RemoteRepository.basicAuthHeader = {
      Authorization: `Basic ${encodedCredentials}`,
    };
  }
}

export {RemoteRepository};
