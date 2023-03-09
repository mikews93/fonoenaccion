import { useCallback, useEffect } from 'react';
import { useRef } from 'react';
import { useSharedDataContext } from 'shared/context/useSharedData';
import { setLocalStorage } from 'shared/utils/LocalStorage';

const POPUP_KEY_LOCAL_STORAGE = 'VIDEATE_PREVIEWER';

type OpenPreviewerType = (spielId?: string, target?: string, features?: string) => void;

export const usePreviewerPopup = () => {
  const [sharedData] = useSharedDataContext();
  const popupInstance = useRef<any>(null);

  useEffect(() => {
    const onStorageChange = (event: StorageEvent) => {
      if (event.key === POPUP_KEY_LOCAL_STORAGE && popupInstance.current) {
        popupInstance.current.close();
      }
    };

    const onBeforeUnload = (_event: BeforeUnloadEvent) => {
      if (popupInstance.current) {
        popupInstance.current.close();
      }
    };

    window.addEventListener('storage', onStorageChange);
    window.addEventListener('beforeunload', onBeforeUnload);

    return () => {
      window.removeEventListener('storage', onStorageChange);
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, []);

  /** Private methods */
  const _getUrl = (spielId?: string) => {
    let baseURL = `${sharedData.settings.previewerUrl}/`;
    if (spielId) {
      return baseURL.concat(`?spielId=${spielId}`);
    }
    return baseURL;
  };

  const _setLocalStoragePopupState = useCallback(() => {
    setLocalStorage({
      key: POPUP_KEY_LOCAL_STORAGE,
      value: Date.now(),
    });
  }, []);

  const _createPreviewer: OpenPreviewerType = useCallback(
    (spielId, target, features) => {
      popupInstance.current = window.open(_getUrl(spielId), target, features);
    },
    [popupInstance]
  );

  const _reloadPreviewer = useCallback(
    (spielId?: string) => {
      if (popupInstance.current) {
        popupInstance.current.focus();
        popupInstance.current.location.href = _getUrl(spielId);
      }
    },
    [popupInstance]
  );

  /** Public methods */
  const openPreviewer: OpenPreviewerType = useCallback(
    (spielId, target = 'previewer', features = 'popup') => {
      _setLocalStoragePopupState();
      const existIntance = popupInstance.current && !popupInstance.current.closed;
      return existIntance ? _reloadPreviewer(spielId) : _createPreviewer(spielId, target, features);
    },
    [_setLocalStoragePopupState, _reloadPreviewer, _createPreviewer]
  );

  return { openPreviewer };
};
