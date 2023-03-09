import { useCallback, useEffect, useRef, useState } from 'react';
import useSwr, { mutate, useSWRConfig } from 'swr';

// @api
import { fetchCall, getFetcher, requestCall, RequestObject, SWR_CONFIG } from 'shared/api/api';

// @utils
import { log } from 'shared/utils/Log';

// @context
import { useSharedDataContext } from 'shared/context/useSharedData';
import { isArray, isEqual, isObject } from 'lodash';

interface OptionsType extends Omit<RequestObject, 'url' | 'method' | 'data'> {
  injectProject?: boolean;
  useFetchApi?: boolean;
  revalidate?: boolean;
}

type UseGetRequestReturn<T> = [
  T,
  {
    isLoading: boolean;
    error: any;
    mutate: (data: T) => void;
  }
];

type useMutationRequestReturn<T, K> = [
  mutation: (
    data: T,
    method?: RequestObject['method'],
    url?: string,
    options?: OptionsType
  ) => Promise<
    | {
        data: K | undefined;
        error: null;
      }
    | {
        data: null;
        error: any;
      }
  >,
  options: { isLoading: boolean; error: any }
];

/**
 * Gets data from api
 * @param url string
 * @param options RequestOptions
 * @returns data and request states
 */
export const useGetRequest = <T,>(
  url: string,
  filter?: any,
  options?: Omit<RequestObject, 'url'>,
  swrOptions?: any
): UseGetRequestReturn<T> => {
  /**
   * Context
   */
  const [sharedData, setContext] = useSharedDataContext();
  const projectIdRef = useRef(sharedData.selectedProject?.id);

  if (!url) {
    throw new Error('url is required');
  }

  if (!options) {
    switch (filter) {
      case null:
        options = {};
        break;
      case undefined:
        options = {
          params: {
            filter: {
              where: {
                projectid: sharedData.selectedProject?.id || 0,
              },
            },
          },
        };
        break;
      default:
        options = {
          params: {
            filter,
          },
        };
        break;
    }
  }

  const { data, error, isValidating, mutate } = useSwr(
    url,
    getFetcher({ ...options, setContext }),
    { ...SWR_CONFIG, ...swrOptions }
  );

  /**
   * effects
   */
  useEffect(() => {
    if (!isEqual(sharedData.selectedProject?.id, projectIdRef.current)) {
      mutate();
    }

    return () => {};
  }, [sharedData.selectedProject?.id]);

  return [data, { mutate, error, isLoading: (!data && !error) || isValidating }];
};

/**
 * Make mutation to swr cache
 * @param url string
 * @returns function to make a mutation
 */
export const useMutationRequest = <T, K>(
  defaultUrl: string = '',
  defaultMethod: RequestObject['method'] = 'POST'
): useMutationRequestReturn<T, K> => {
  /**
   * hooks
   */
  const { cache } = useSWRConfig();

  /**
   * Context
   */
  const [sharedData, setContext] = useSharedDataContext();

  /**
   * State
   */
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const mutateFunction = useCallback(
    async (
      data?: T,
      method: RequestObject['method'] = defaultMethod,
      url: string = defaultUrl,
      options: OptionsType = {
        injectProject: true,
        revalidate: true,
      }
    ) => {
      const { injectProject, useFetchApi, revalidate } = options;
      try {
        setIsLoading(true);
        const isArrayType = isArray(data);
        const requestOptions = {
          method,
          url,
          data: isArrayType
            ? data
            : {
                ...data,
                projectid: injectProject ? sharedData.selectedProject?.id : undefined,
              },
          ...options,
          setContext,
        };
        let response;
        if (useFetchApi) {
          response = await fetchCall(requestOptions);
        } else {
          const { data } = await requestCall(requestOptions);
          response = data;
        }
        const cacheData = cache.get(url);

        if (revalidate) {
          const mutatedData =
            isArray(cacheData) && isObject(response) ? [response, ...cacheData] : response;

          mutate(url, mutatedData, {
            optimisticData: mutatedData,
            rollbackOnError: true,
          });
        }
        return { data: response as K, error: null };
      } catch (err: any) {
        setError(err);
        log.error(url, err);
        return { data: null, error: err };
      } finally {
        setIsLoading(false);
      }
    },
    [defaultUrl]
  );

  return [mutateFunction, { isLoading, error }];
};

const mutateCache = (method: RequestObject['method'], lookupKey: string, data: any) => {};
