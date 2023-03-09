import { ProjectType } from './projectType';
import { UserType } from './userType';

export enum MOUSE_TYPES {
  Mouse = 'DG Mouse',
  Trackball = 'DG Trackball',
  Synthetic = 'synthetic',
}

export type PersonaType = {
  id: number;
  name: string;
  language: string;
  voice: string;
  mousePersona: MOUSE_TYPES;
  voiceEngine: string;
  mouseAcceleration?: number;
  voicePace?: number;
  updatedAt: string;
  createdAt: string;
  deletedAt?: string;
  deletedBy?: Partial<UserType>;
  defaultFor?: string;
  projectId?: ProjectType['id'];
};
