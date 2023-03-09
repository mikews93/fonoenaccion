export type Video = {
  id: number;
  title: string;
  spielId: number;
  uri: string;
  createdAt: string;
  wistiaId?: string;
};

export type WistiaConfig = {
  ProjectID: string;
  AccessToken: string;
};
