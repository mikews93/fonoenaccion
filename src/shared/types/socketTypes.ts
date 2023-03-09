import { SPIEL_JOB_TYPE } from 'shared/constants';
import { STATUS_TYPE } from './instanceTypes';

export type SocketMessageType = {
  message: {
    id: Number;
    jobId: Number;
    line?: number;
    percent?: number;
    type?: SPIEL_JOB_TYPE;
    error: string;
    initial_launch: boolean;
  };
  channel: STATUS_TYPE;
};
