export class FileManagerHelper {
  static imageDir = 'images';
  static audioDir = 'audio';
  static filesDir = 'files';
  static videosDir = 'videos';
  static DirsForMimetypes: {[key: string]: string} = {
    'image/jpg': this.imageDir,
    'image/jpeg': this.imageDir,
    'image/png': this.imageDir,
    'audio/mpeg': this.audioDir,
    'video/mp4': this.videosDir,
  };

  static ExtForMimetypes: {[key: string]: string} = {
    "video/mp4" : '.mp4',
    "image/jpeg" : '.jpg',
    "image/jpg" : '.jpg',
    "image/png" : '.png',
    "audio/mpeg" : '.mp3',
    "video/mpeg" : '.mpeg'
  };

  rootDir = '';
  constructor(rootDir: string){
    this.rootDir = rootDir;
  }

  getFilePath(b64url: string, mimeType?: string): string {
    return this.getDirForMimetype(mimeType)
      .concat('/')
      .concat(b64url)
      .concat(this.getExtForMimetype(mimeType));
  }

  getExtForMimetype(mimeType?: string) {
    if (!mimeType) return '';
    const extForMime = FileManagerHelper.ExtForMimetypes[mimeType];
    return extForMime ?? '';
  }

  getDirForMimetype(mimeType?: string): string {
    if (!mimeType) return `${this.rootDir}/${FileManagerHelper.filesDir}`;

    const mimeDir = FileManagerHelper.DirsForMimetypes[mimeType];
    if (mimeDir) return `${this.rootDir}/${mimeDir}`;

    return `${this.rootDir}/${FileManagerHelper.filesDir}`;
  }
}