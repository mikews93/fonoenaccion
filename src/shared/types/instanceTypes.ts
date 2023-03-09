import { INSTANCE_STATUS, SPIEL_JOB_TYPE, SPIEL_MESSAGES } from 'shared/constants';
import { SocketMessageType } from './socketTypes';

export type STATUS_TYPE = INSTANCE_STATUS | SPIEL_MESSAGES;

type Message = SocketMessageType['message'];

export type Instance = {
  id: string;
  host: string;
  hostname: string;
  address: string;
  status: INSTANCE_STATUS;
  environment: {
    id: number;
    client_id: number;
    name: string;
  };
  clientPodName: string;
  job: {
    id: Message['jobId'];
    status?: STATUS_TYPE;
    percent: number;
    type?: SPIEL_JOB_TYPE;
  };
};
