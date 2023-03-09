export type UserType = {
  id: number;
  name: string;
  fullName: string;
  email: string;
  userID: number;
  avatarUrl?: string;
  roles: string[];
  token: string;
  refreshToken: string;
  sessions: { guid: string; projectId: number }[];
  clientID?: number;
  clientConfig?: {
    hasWistiaConfig: boolean;
  };
};
