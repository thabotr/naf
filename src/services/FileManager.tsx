import RNFetchBlob from 'rn-fetch-blob';
import {FileManagerHelper} from './FileManagerHelper';

export class FileManager {
  static RootDir = RNFetchBlob.fs.dirs.CacheDir;
  static fmHelper = new FileManagerHelper(this.RootDir);

  static removeFile(uri: string): void {
    RNFetchBlob.fs.unlink(uri)
    .catch(e=>console.error('file removal failed:', e));
  }

  static async InitFilePaths(): Promise<boolean> {
    try {
      const directories = [
        FileManagerHelper.imageDir,
        FileManagerHelper.audioDir,
        FileManagerHelper.videosDir,
        FileManagerHelper.filesDir,
      ].map(dir => this.RootDir.concat('/').concat(dir));
      
      const mkdirDirPromises = directories.map(dir=>RNFetchBlob.fs.mkdir(dir));
      for(let ind in mkdirDirPromises){
        try{
          await mkdirDirPromises[ind];
        }catch(e){
          if(!`${e}`.includes('already exists'))
            throw e;
        }
      }
    } catch (e) {
      console.error('failed to create directories:', e);
      return false;
    }
    return true;
  }

  static async getFileURI(
    source: string,
    mimeType?: string,
  ): Promise<string | undefined> {
    if (!source.includes('http')) {
      return source;
    }

    const localFilePath = this.fmHelper.getFilePath(this.b64URL(source), mimeType);
    try {
      const cached = await RNFetchBlob.fs.exists(localFilePath);
      if (cached) {
        return localFilePath;
      }
    } catch (e) {
      console.error(
        'encountered error while checking if file',
        localFilePath,
        'exists:',
        e,
      );
      return;
    }

    try {
      const remoteResult = await RNFetchBlob.config({
        path: localFilePath,
      }).fetch('GET', source);
      if (remoteResult.info().status === 200) {
        return localFilePath;
      }
      console.log(
        'got remote response status code ',
        remoteResult.info().status,
        'TODO handle',
      );
      return;
    } catch (e) {
      console.error(
        'encountered error while getting file from remote source',
        source,
        ':',
        e,
      );
      return;
    }
  }

  static b64URL(url: string): string {
    return RNFetchBlob.base64.encode(url);
  }
}
