export type Replacement = {
  id: number;
  clientid: number;
  strategy: string;
  target: string;
  replacement: string;
  repltype: string;
  replxml: string;
  languages: string | string[];
  created_at: string;
};
