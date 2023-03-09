export type Environment = {
  id: number;
  name: string;
  projectid: number;
  clientid: number;
  hosts?: string;
  proxy?: string;
  notes?: string;
  deletedAt?: string;
  deletedBy?: number;
};
