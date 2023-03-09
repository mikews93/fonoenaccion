import { EN_US } from 'shared/constants';
import { useSharedDataContext } from 'shared/context/useSharedData';
import { LanguagePretty } from 'shared/types/languages';
import { useGetRequest } from './useRequest';

export const useGetLanguages = (): LanguagePretty[] => {
  const [sharedData] = useSharedDataContext();

  /**
   * Queries
   */
  const [languages] = useGetRequest<LanguagePretty[]>(
    `clients/${sharedData.selectedClient}/languages?pretty=1`
  );

  if (!languages.length) {
    languages.push(EN_US);
  }

  return languages;
};
