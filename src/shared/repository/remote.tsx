import {Buffer} from 'buffer';

class RemoteRepository {
  handle = '';
  token = '';
  basicAuthHeader: Record<string, string | number> = {};

  setCredentials(token: string, handle: string): void {
    this.handle = handle;
    this.token = token;
    const encodedCredentials = Buffer.from(`${handle}:${token}`).toString(
      'base64',
    );
    this.basicAuthHeader = {
      Authorization: `Basic ${encodedCredentials}`,
    };
  }
}

export {RemoteRepository};
