import { AliasToken } from 'antd/es/theme';

export enum THEMES {
  DARK = 'dark',
  LIGHT = 'light',
}

export interface Theme extends AliasToken {
  name?: THEMES;
}
