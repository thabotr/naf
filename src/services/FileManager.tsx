import {Platform} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import ImageColors from 'react-native-image-colors';
import {launchCamera} from 'react-native-image-picker';
import DocumentPicker, {
  DocumentPickerResponse,
  isInProgress,
} from 'react-native-document-picker';

import {FileManagerHelper} from './FileManagerHelper';
import {FileType} from '../types/message';

class FileManager {
  static RootDir = RNFetchBlob.fs.dirs.CacheDir;
  static fmHelper = new FileManagerHelper(this.RootDir);

  static removeFile(uri: string): void {
    RNFetchBlob.fs
      .unlink(uri)
      .catch(e => console.error('file removal failed:', e));
  }

  static async InitFilePaths(): Promise<boolean> {
    try {
      const directories = [
        FileManagerHelper.imageDir,
        FileManagerHelper.audioDir,
        FileManagerHelper.videosDir,
        FileManagerHelper.filesDir,
      ].map(dir => this.RootDir.concat('/').concat(dir));

      const mkdirDirPromises = directories.map(dir =>
        RNFetchBlob.fs.mkdir(dir),
      );
      for (let ind in mkdirDirPromises) {
        try {
          await mkdirDirPromises[ind];
        } catch (e) {
          if (!`${e}`.includes('already exists')) throw e;
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
    headers?: {[key: string]: string},
  ): Promise<string | undefined> {
    if (!source.includes('http')) {
      return source;
    }

    const localFilePath = this.fmHelper.getFilePath(
      this.b64URL(source),
      mimeType,
    );
    try {
      const cached = await RNFetchBlob.fs.exists(localFilePath);
      if (cached) {
        return (
          Platform.select({android: 'file://'.concat(localFilePath)}) ??
          localFilePath
        );
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
      }).fetch('GET', source, headers);
      if (remoteResult.info().status === 200) {
        return (
          Platform.select({android: 'file://'.concat(localFilePath)}) ??
          localFilePath
        );
      }
      console.error(
        'FileManager.getFileURI:',
        'got remote response status code',
        remoteResult.info().status,
        'on account of',
        remoteResult.text(),
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

  static async getImageColors(
    localURI: string,
    cachable?: boolean,
  ): Promise<Colors | undefined> {
    const b64key = this.b64URL(localURI);
    let colors = ImageColors.cache.getItem(b64key);

    try {
      if (!colors) {
        colors = await ImageColors.getColors(localURI, {cache: cachable});
        colors && ImageColors.cache.setItem(b64key, colors);
      }

      switch (colors?.platform) {
        case 'android':
          return {
            darkPrimary: colors.darkVibrant,
            darkSecondary: colors.darkMuted,
            lightPrimary: colors.average,
            lightSecondary: colors.dominant,
          };
        case 'ios':
          return {
            darkPrimary: colors.primary,
            darkSecondary: colors.secondary,
            lightPrimary: colors.detail,
            lightSecondary: colors.background,
          };
      }
    } catch (e) {
      console.error('failed to get image colors:', e);
    }
  }

  static async getCameraMedia(mode: 'video' | 'photo') {
    try {
      const cameraRes = await launchCamera({
        mediaType: mode,
        quality: 1,
        maxHeight: 7680,
        maxWidth: 4320,
        videoQuality: 'high',
        durationLimit: 10 * 60,
        includeExtra: true,
      });

      if (cameraRes.didCancel) return;
      if (cameraRes.errorCode) throw new Error(cameraRes.errorMessage);

      const resultAsset: {
        id?: string;
        fileName?: string;
        bitrate?: number;
        duration?: number;
        fileSize?: number;
        height?: number;
        width?: number;
        timestamp?: string;
        type?: string;
        uri?: string;
      } = (cameraRes.assets ?? [])[0];

      return {
        name:
          resultAsset.type &&
          `${new Date().getTime()}`.concat(
            FileManagerHelper.ExtForMimetypes[resultAsset.type],
          ),
        uri: resultAsset.uri ?? '',
        type: resultAsset.type ?? '',
        size: resultAsset.fileSize ?? 0,
      };
    } catch (e) {
      console.error('camera error', e);
    }
  }

  static #handleError = (err: unknown) => {
    if (DocumentPicker.isCancel(err)) {
      // User cancelled the picker, exit any dialogs or menus and move on
    } else if (isInProgress(err)) {
      console.warn(
        'multiple pickers were opened, only the last will be considered',
      );
    } else {
      throw err;
    }
  };

  static async pickFiles(): Promise<FileType[] | undefined> {
    try {
      const dprs: Array<DocumentPickerResponse> | null | undefined =
        await DocumentPicker.pick({
          allowMultiSelection: true,
          copyTo: 'cachesDirectory',
        });
      if (dprs) {
        return dprs.map((dpr: DocumentPickerResponse): FileType => {
          return {
            name: dpr.name ?? undefined,
            size: dpr.size ?? 0,
            type: dpr.type ?? '',
            uri: dpr.fileCopyUri ?? dpr.uri,
          };
        });
      }
    } catch (e) {
      this.#handleError(e);
    }
  }
}

export type Colors = {
  darkPrimary?: string;
  darkSecondary?: string;
  lightPrimary?: string;
  lightSecondary?: string;
};

export {FileManager};
