import {FileManagerHelper} from '../../../src/services/FileManagerHelper';

describe(FileManagerHelper, () => {
  const fmHelper = new FileManagerHelper('some/root/dir');
  describe(fmHelper.getDirForMimetype, () => {
    test('given a video mimetype it should return the videos directory', () => {
      const mimetype = 'video/mp4';
      const videosDir = fmHelper.rootDir.concat('/').concat('videos');
      expect(fmHelper.getDirForMimetype(mimetype)).toBe(videosDir);
    });
    test('given an audio mimetype it should return the audio directory', () => {
      const mimetype = 'audio/mpeg';
      const audioDir = fmHelper.rootDir.concat('/').concat('audio');
      expect(fmHelper.getDirForMimetype(mimetype)).toBe(audioDir);
    });
    test('given an image mimetype it should return the images directory', () => {
      const mimetype = 'image/jpeg';
      const imgsDir = fmHelper.rootDir.concat('/').concat('images');
      expect(fmHelper.getDirForMimetype(mimetype)).toBe(imgsDir);
    });
    test('given any other mimetype it should return the files directory', () => {
      const mimetype = 'any/mimetype';
      const filesDir = fmHelper.rootDir.concat('/').concat('files');
      expect(fmHelper.getDirForMimetype(mimetype)).toBe(filesDir);
    });
    test('when mimetype is undefined it should return the files direcoty', () => {
      const filesDir = fmHelper.rootDir.concat('/').concat('files');
      expect(fmHelper.getDirForMimetype(undefined)).toBe(filesDir);
    });
  });
  describe(fmHelper.getExtForMimetype, () => {
    test('given audio/mpeg mimetype it should return the .mp3 extension', () => {
      const mimetype = 'audio/mpeg';
      const extension = '.mp3';
      expect(fmHelper.getExtForMimetype(mimetype)).toBe(extension);
    });
    test('given image/jpeg mimetype it should return the .jpg extension', () => {
      const mimetype = 'image/jpeg';
      const extension = '.jpg';
      expect(fmHelper.getExtForMimetype(mimetype)).toBe(extension);
    });
    test('given image/jpg mimetype it should return the .jpg extension', () => {
      const mimetype = 'image/jpg';
      const extension = '.jpg';
      expect(fmHelper.getExtForMimetype(mimetype)).toBe(extension);
    });
    test('given image/png mimetype it should return the .png extension', () => {
      const mimetype = 'image/png';
      const extension = '.png';
      expect(fmHelper.getExtForMimetype(mimetype)).toBe(extension);
    });
    test('given video/mp4 mimetype it should return the .mp4 extension', () => {
      const mimetype = 'video/mp4';
      const extension = '.mp4';
      expect(fmHelper.getExtForMimetype(mimetype)).toBe(extension);
    });
    test('given an unsupported mimetype it should return no extension', () => {
      const mimetype = 'unsupported/mimetype';
      const extension = '';
      expect(fmHelper.getExtForMimetype(mimetype)).toBe(extension);
    });
    test('given video/mpeg mimetype it should return the .mpeg extension', () => {
      const mimetype = 'video/mpeg';
      const extension = '.mpeg';
      expect(fmHelper.getExtForMimetype(mimetype)).toBe(extension);
    });
    test('when mimetype is undefined it should return no extension', () => {
      const noExtension = '';
      expect(fmHelper.getExtForMimetype(undefined)).toBe(noExtension);
    });
  });
});
