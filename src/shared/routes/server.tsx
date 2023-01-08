const serverUrls: Readonly<Record<string, string>> = {
  LOCAL: 'http://10.0.2.2:8000/naf/api',
  PROD: 'https://www.thaborlabs.com/naf/api',
};
export const SERVER_URL =
  process.env.NODE_ENV === 'production' ? serverUrls.PROD : serverUrls.LOCAL;
