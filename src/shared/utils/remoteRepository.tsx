import {log} from './logger';

const handleFetchError = (e: any) => {
  log('ERROR', 'RemoteChatRepository', e);
  if (`${e}`.includes('timedout')) {
    throw new Error('NET_ERROR');
  } else {
    throw new Error('APP_ERROR');
  }
};

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
