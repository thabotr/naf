import {log} from './logger';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
const handleFetchError = (e: any) => {
  log('ERROR', 'RemoteChatRepository', e);
  const errorString = e.message.toLocaleLowerCase();
  if (errorString.match(/timedout/) || errorString.match(/network error/)) {
    throw new Error('NET_ERROR');
  } else {
    throw new Error('APP_ERROR');
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
const handleUnsuccessfulResponse = (response: any) => {
  log(
    'ERROR',
    'RemoteChatRepository',
    'server response status: '
      .concat(response.status.toString())
      .concat('. Reason: ')
      .concat(response.data),
  );
  if (response.status >= 500) {
    throw new Error('SERVER_ERROR');
  }
  if (response.status >= 400) {
    throw new Error('AUTH_ERROR');
  }
  throw new Error('APP_ERROR');
};

export {handleFetchError, handleUnsuccessfulResponse};
