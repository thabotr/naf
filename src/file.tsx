import RNFetchBlob from "rn-fetch-blob";

type PathAndMetadata = {
  filePath: string,
  metadata: {[key:string]: string},
}

export const getFilePath = async (url: string, headers?:{[key:string]:string}):Promise<PathAndMetadata|null> => {
  const b64URL = RNFetchBlob.base64.encode(url);
  const path = `${RNFetchBlob.fs.dirs.CacheDir}/files/${b64URL}`;
  const metaPath = path.concat('.json');
  try{
    const cached = await RNFetchBlob.fs.exists(path);
    const metadata = await RNFetchBlob.fs.readFile(metaPath, 'utf8', 1_000);
    if(cached)
      return {filePath: path, metadata: JSON.parse(metadata)};
  } catch( e ) {
    console.error( 'file check failed ' + e);
  }

  try {
    const resp = await RNFetchBlob.config({fileCache: true,}).fetch('GET', url, headers);
    if(resp.info().status === 200){
      const tempFilePath = resp.data;
      await RNFetchBlob.fs.mv(tempFilePath, path);
      const headers = resp.info().headers;
      const metadata = headers as {[key: string]: string};
      await RNFetchBlob.fs.createFile(metaPath, JSON.stringify(metadata), 'utf8');
      return {filePath: path, metadata: metadata};
    }else {
      console.log(`status ${resp.info().status} returned when fetching resource ${url}`);
      return null;
    }
  }catch(e){
    console.error('getting audio path with URL [' +url+'] '+ e);
  }
  return null;
}