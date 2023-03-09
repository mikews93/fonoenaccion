export type ParagraphMap = { [key: number]: number };

export enum HIGHLIGHT_TYPE {
  INFO = 'info',
  ERROR = 'error',
}

export type HighlightType = {
  line: number;
  type: HIGHLIGHT_TYPE;
  errorMessage?: string;
};

export type PickEnum<T, K extends T> = {
  [P in keyof K]: P extends K ? P : never;
};
