export type VoicePretty = {
  label: string;
  options: {
    value: string;
    label: string;
  }[];
};

export type Voice = {
  id: number;
  name: string;
  gender: string;
  description: string;
  language: string;
  engine: string;
  voice: string;
  customerVisible: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
  deletedBy: null;
};
