export type Product = {
  id: number;
  envid: number;
  name: string;
  loginUrl: string;
  loginJs: string;
  css?: string;
  version?: string;
  lastModified: string;
  createdAt: string;
  browserProfile: string;
  deletedAt?: string;
  deletedBy?: string;
  defaultTab?: boolean;
  username?: string;
  password?: string;
};
