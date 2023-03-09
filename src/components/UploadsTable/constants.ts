import {
  FONT_EXTENSIONS,
  IMAGE_EXTENSIONS,
  UPPY_GLOBAL_RESTRICTIONS,
  VIDEO_EXTENSIONS,
  AUDIO_EXTENSIONS,
} from 'shared/constants';

export const REPLACEMENT_TEXT = '{link_url}';
export const VIDEO_MARKUP_TEMPLATE = `<video href="${REPLACEMENT_TEXT}">`;
export const IMAGE_MARKUP_TEMPLATE = `<image href="${REPLACEMENT_TEXT}"/>`;
export const AUDIO_MARKUP_TEMPLATE = `<audio href="${REPLACEMENT_TEXT}"/>`;

export const UPPY_CONFIG = {
  restrictions: {
    // FILE_EXTENSION: This needs to be kept in sync with backend
    ...UPPY_GLOBAL_RESTRICTIONS,
    allowedFileTypes: [
      AUDIO_EXTENSIONS.AAC,
      AUDIO_EXTENSIONS.MP3,
      AUDIO_EXTENSIONS.WAV,
      VIDEO_EXTENSIONS.MP4,
      IMAGE_EXTENSIONS.JPG,
      IMAGE_EXTENSIONS.PNG,
      IMAGE_EXTENSIONS.JPEG,
      IMAGE_EXTENSIONS.SVG,
      FONT_EXTENSIONS.TTF,
      FONT_EXTENSIONS.OTF,
      FONT_EXTENSIONS.WOFF,
      FONT_EXTENSIONS.WOFF2,
    ],
  },
};

export const ASSETS_PATH = '/assets';

export enum TAG_MODES {
  VIDEATE = 'VIDEATE',
  XML = 'XML',
  XML_COMMENT = 'XML_COMMENT',
}

export const MARKUP_TYPES: {
  [key in TAG_MODES]: { label: string; template: { video: string; image: string; audio: string } };
} = {
  [TAG_MODES.VIDEATE]: {
    label: 'Videate <native>',
    template: {
      video: `${VIDEO_MARKUP_TEMPLATE}</video>`,
      image: IMAGE_MARKUP_TEMPLATE,
      audio: AUDIO_MARKUP_TEMPLATE,
    },
  },
  [TAG_MODES.XML]: {
    label: 'XML <? processing instruction ?>',
    template: {
      video: `<?videate ${VIDEO_MARKUP_TEMPLATE} ?><?videate </video> ?>`,
      image: `<?videate ${IMAGE_MARKUP_TEMPLATE}/> ?>`,
      audio: `<?videate ${AUDIO_MARKUP_TEMPLATE} ?>`,
    },
  },
  [TAG_MODES.XML_COMMENT]: {
    label: 'XML <!-- comment -->',
    template: {
      video: `<!-- ${VIDEO_MARKUP_TEMPLATE} --><!-- </video> -->`,
      image: `<!-- ${IMAGE_MARKUP_TEMPLATE} -->`,
      audio: `<!-- ${AUDIO_MARKUP_TEMPLATE} -->`,
    },
  },
};
