import {logger} from 'react-native-logs';
const logData = logger.createLogger();
function log(
  logLevel: 'DEBUG' | 'INFO' | 'ERROR' | 'FIXME' | 'TODO',
  functionName: string,
  message: any,
) {
  logData.debug(functionName, message);
}

export {log};
