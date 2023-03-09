import { AUDIO_EXTENSIONS, IMAGE_EXTENSIONS, VIDEO_EXTENSIONS } from 'shared/constants';

/**
 * @description Returns the extension base on filename
 * @param string fileName
 * @returns string
 */
export const getExtension = (filename = '') => {
  const parts = filename.split('.');
  return `.${parts[parts.length - 1]}`;
};

/**
 * @description Checks an extension against some know image extensions
 * @param string fileName
 * @returns string
 */
export const isImage = (filename = '') => {
  const ext = getExtension(filename);
  switch (ext.toLowerCase()) {
    case IMAGE_EXTENSIONS.JPG:
    case IMAGE_EXTENSIONS.GIF:
    case IMAGE_EXTENSIONS.BMP:
    case IMAGE_EXTENSIONS.PNG:
    case IMAGE_EXTENSIONS.SVG:
      return true;
    default:
      return false;
  }
};

/**
 * @description Checks an extension against some know video extensions
 * @param string fileName
 * @returns string
 */
export const isVideo = (filename = '') => {
  const ext = getExtension(filename);
  switch (ext.toLowerCase()) {
    case VIDEO_EXTENSIONS.MP4:
    case VIDEO_EXTENSIONS.AVI:
    case VIDEO_EXTENSIONS.MPG:
    case VIDEO_EXTENSIONS.M4V:
      return true;
    default:
      return false;
  }
};

/**
 * @description Checks an extension against some know audio extensions
 * @param string fileName
 * @returns string
 */
export const isAudio = (filename = '') => {
  const ext = getExtension(filename);
  switch (ext.toLowerCase()) {
    case AUDIO_EXTENSIONS.AAC:
    case AUDIO_EXTENSIONS.MP3:
    case AUDIO_EXTENSIONS.WAV:
      return true;
    default:
      return false;
  }
};
