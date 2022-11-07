import RNFetchBlob from "rn-fetch-blob";

export const getFilePath = async (url: string, extension?: string, headers?:{[key:string]:string}):Promise<string|undefined> => {
  const b64URL = RNFetchBlob.base64.encode(url);
  const path = RNFetchBlob.fs.dirs.CacheDir.concat('/files/').concat(b64URL).concat(extension ?? '');
  try{
    const cached = await RNFetchBlob.fs.exists(path);
    if(cached)
      return path;
  } catch( e ) {
    console.error( 'file check failed ' + e);
  }

  try {
    const resp = await RNFetchBlob.config({fileCache: true,}).fetch('GET', url, headers);
    if(resp.info().status === 200){
      const tempFilePath = resp.data;
      await RNFetchBlob.fs.mv(tempFilePath, path);
      return path;
    }else {
      console.log(`status ${resp.info().status} returned when fetching resource ${url}`);
    }
  }catch(e){
    console.error('getting file path with URL [' +url+'] '+ e);
  }
}