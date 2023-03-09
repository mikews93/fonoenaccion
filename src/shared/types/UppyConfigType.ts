import { UppyOptions, Restrictions } from '@uppy/core';

export interface ConfigType extends UppyOptions<Record<string, unknown>> {
  allowedFileTypes?: string[];
  restrictions: Restrictions;
  endpoint: string;
  metaFields?: any;
}
