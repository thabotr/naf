import axios, {AxiosRequestConfig} from 'axios';
import {Buffer} from 'buffer';
import {Credentials} from '../../pages/Login/Login';
import {HelperText} from '../middleware';
import {SERVER_URL} from '../routes/server';
import {EventTypeString} from '../utils/eventPublisher';
import {log} from '../utils/logger';

class RemoteRepository {
  static handle = '';
  static token = '';
  static basicAuthHeader: Record<string, string | number> = {};
  static profilesURL = SERVER_URL.concat('/profiles');

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

  static async createProfile(credentials: Credentials): Promise<Credentials> {
    const config = getAuthNValidationConfig(credentials);
    const data = undefined;
    let response;
    try {
      response = await axios.post(this.profilesURL, data, config);
    } catch (e) {
      log('ERROR', 'RemoteRepository.createProfile', e);
      throw new Error(HelperText.unknownError);
    }

    if (response.status === HttpStatusCode.Conflict) {
      throw new Error(HelperText.handleAlreadyTaken);
    }

    if (response.status === HttpStatusCode.Created) {
      return credentials;
    }

    throw new Error(HelperText.unknownError);
  }

  static async getNotifications(
    credentials: Credentials,
    selectors: Record<string, string>,
  ): Promise<EventTypeString> {
    const config: AxiosRequestConfig<unknown> = {
      ...getAuthNValidationConfig(credentials, selectors),
    };
    const response = await axios.get(`${SERVER_URL}/notifications`, config);

    if (response.status === HttpStatusCode.Ok) {
      return toEventTypeString(response.data);
    }
    return 'IDLE';
  }
}

const validateAllStatuses = (status: HttpStatusCode): boolean => {
  return status >= 200 && status < 600;
};

const getAuthNValidationConfig = (
  credentials: Credentials,
  additionalHeaders?: Record<string, string>,
): AxiosRequestConfig<unknown> => {
  const encodedCredentials = Buffer.from(
    `${credentials.handle}:${credentials.token}`,
  ).toString('base64');
  const config = {
    headers: {
      Authorization: 'Basic '.concat(encodedCredentials),
      ...additionalHeaders,
    },
    validateStatus: validateAllStatuses,
  };
  return config;
};

const toEventTypeString = (codeString: string): EventTypeString => {
  switch (codeString) {
    case '1':
      return 'NEW_MESSAGE';
    default:
      return 'IDLE';
  }
};

export enum HttpStatusCode {
  Continue = 100,
  SwitchingProtocols = 101,
  Processing = 102,
  EarlyHints = 103,
  Ok = 200,
  Created = 201,
  Accepted = 202,
  NonAuthoritativeInformation = 203,
  NoContent = 204,
  ResetContent = 205,
  PartialContent = 206,
  MultiStatus = 207,
  AlreadyReported = 208,
  ImUsed = 226,
  MultipleChoices = 300,
  MovedPermanently = 301,
  Found = 302,
  SeeOther = 303,
  NotModified = 304,
  UseProxy = 305,
  Unused = 306,
  TemporaryRedirect = 307,
  PermanentRedirect = 308,
  BadRequest = 400,
  Unauthorized = 401,
  PaymentRequired = 402,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  NotAcceptable = 406,
  ProxyAuthenticationRequired = 407,
  RequestTimeout = 408,
  Conflict = 409,
  Gone = 410,
  LengthRequired = 411,
  PreconditionFailed = 412,
  PayloadTooLarge = 413,
  UriTooLong = 414,
  UnsupportedMediaType = 415,
  RangeNotSatisfiable = 416,
  ExpectationFailed = 417,
  ImATeapot = 418,
  MisdirectedRequest = 421,
  UnprocessableEntity = 422,
  Locked = 423,
  FailedDependency = 424,
  TooEarly = 425,
  UpgradeRequired = 426,
  PreconditionRequired = 428,
  TooManyRequests = 429,
  RequestHeaderFieldsTooLarge = 431,
  UnavailableForLegalReasons = 451,
  InternalServerError = 500,
  NotImplemented = 501,
  BadGateway = 502,
  ServiceUnavailable = 503,
  GatewayTimeout = 504,
  HttpVersionNotSupported = 505,
  VariantAlsoNegotiates = 506,
  InsufficientStorage = 507,
  LoopDetected = 508,
  NotExtended = 510,
  NetworkAuthenticationRequired = 511,
}

export {RemoteRepository, validateAllStatuses, getAuthNValidationConfig};
