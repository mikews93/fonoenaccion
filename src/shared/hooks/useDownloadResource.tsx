// @vendors
import { useCallback, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

// @hooks
import { useSharedDataContext } from 'shared/context/useSharedData';

// @utils
import { getResourceUrl, ResourceUrl } from 'shared/utils/Resources';
import { downloadURI } from 'shared/utils/Miscellaneous';

type ReturnType = [
  (args: ResourceUrl) => Promise<{ success: boolean; error: unknown }>,
  { isDownloadingResource: boolean }
];

export const useDownloadResource = (baseUrl?: string): ReturnType => {
  /**
   * hooks
   */
  const [sharedData] = useSharedDataContext();

  /**
   * state
   */
  const [isDownloadingResource, setIsDownloadingVideo] = useState(false);

  const downloadVideo = useCallback(
    async ({ clientId, fileName, projectId, search }: ResourceUrl) => {
      const ERROR_MESSAGE = 'Resource could not be downloaded!';
      try {
        setIsDownloadingVideo(true);
        const result = await fetch(
          getResourceUrl({
            baseUrl: baseUrl ?? sharedData.settings.videateVideoUrl,
            clientId,
            fileName,
            projectId,
            search: search ?? `?v=${uuidv4()}`, // Add `v` param to url to force load from network
          })
        );
        if (!result.ok) {
          throw Error(ERROR_MESSAGE);
        }
        const blob = await result.blob();
        downloadURI(window.URL.createObjectURL(blob), blob, fileName);
        return { success: true, error: null };
      } catch (error) {
        return { success: false, error };
      } finally {
        setIsDownloadingVideo(false);
      }
    },
    []
  );

  return [downloadVideo, { isDownloadingResource }];
};
