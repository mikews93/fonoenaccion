import { ClientType } from 'shared/types/clientType';
import { ProjectType } from 'shared/types/projectType';

export type ResourceUrl = {
  baseUrl?: string;
  clientId?: ClientType['id'];
  projectId?: ProjectType['id'];
  path?: string;
  fileName: string;
  search?: string;
};

/**
 * @description This function returns the url needed download a media
 * @param Object { clientId, projectId, path, fileName, search }
 * @returns string
 */
export const getResourceUrl = ({
  baseUrl,
  clientId,
  projectId,
  path,
  fileName,
  search = '',
}: ResourceUrl) => {
  return `${baseUrl}/${clientId ? `${clientId}/` : ''}${projectId ? `${projectId}/` : ''}${
    path ? `${path}/` : ''
  }${encodeURI(fileName)}${encodeURI(search)}`;
};
