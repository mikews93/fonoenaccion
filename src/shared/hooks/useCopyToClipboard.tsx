// @ts-ignore: types for dashboard
import copyToClipboard from 'clipboard-copy';
import { useCallback } from 'react';

/**
 * Copies text param into the clipboard
 * @param Options what to execute after success and error functions
 * @returns void
 */
export const useCopyToClipboard = ({
  onSuccess,
  onError,
}: {
  onSuccess: Function;
  onError: Function;
}) => {
  const copyToClipboardFn = useCallback(
    async (text: string) => {
      try {
        await copyToClipboard(text);
        onSuccess('Copied to clipboard!');
      } catch (error) {
        onError('Could not copy to clipboard', { error });
      }
    },
    [onSuccess, onError]
  );

  return [copyToClipboardFn];
};
