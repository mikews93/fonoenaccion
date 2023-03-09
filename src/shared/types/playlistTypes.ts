export type Playlist = {
  id: number;
  name: string;
  lastModified: string;
  createdAt: string;
  expires: null;
  slug: string;
  projectid: number;
  members: {
    id: number;
    ordinal: number;
    title: string;
    videos: string;
    spiel_id: number;
  }[];
};
