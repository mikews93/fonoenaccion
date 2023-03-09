export type ClientType = {
  id: number;
  name: string;
  createdAt: string;
  remoteId?: string;
  status: string;
  clientid?: number;
  domain?: string;
  autocreateUsers: boolean;
  oktaAudience?: string;
  oktaIssuer?: string;
  defaultAuthProvider?: string;
};
