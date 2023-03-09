import { useCallback, useEffect, lazy, MutableRefObject, useState, useContext } from 'react';

import { useLocation, useNavigate, UNSAFE_NavigationContext } from 'react-router-dom';
import type { History, Blocker, Transition } from 'history';

// @Constants
import { ESCAPE_KEY } from 'shared/constants';

// TODO move this hooks to its own files

export function useBlocker(blocker: Blocker, when = true): void {
  const navigator = useContext(UNSAFE_NavigationContext).navigator as History;

  useEffect(() => {
    if (!when) return;

    const unblock = navigator.block((tx: Transition) => {
      const autoUnblockingTx = {
        ...tx,
        retry() {
          unblock();
          tx.retry();
        },
      };

      blocker(autoUnblockingTx);
    });

    return unblock;
  }, [navigator, blocker, when]);
}

/**
 * @param attachDialog whether to show the prompt or not
 * @param message custom message to display when the prompt shows up
 * @description prevents user from leaving a page without fulling a condition
 */
export const useCallbackPrompt = (when: boolean): [boolean, () => void, () => void] => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPrompt, setShowPrompt] = useState(false);
  const [lastLocation, setLastLocation] = useState<any>(null);
  const [confirmedNavigation, setConfirmedNavigation] = useState(false);

  const cancelNavigation = useCallback(() => {
    setShowPrompt(false);
  }, []);

  // handle blocking when user click on another route prompt will be shown
  const handleBlockedNavigation = useCallback(
    (nextLocation: any) => {
      // in if condition we are checking next location and current location are equals or not
      if (!confirmedNavigation && nextLocation.location.pathname !== location.pathname) {
        setShowPrompt(true);
        setLastLocation(nextLocation);
        return false;
      }
      return true;
    },
    [confirmedNavigation, location]
  );

  const confirmNavigation = useCallback(() => {
    setShowPrompt(false);
    setConfirmedNavigation(true);
  }, []);

  useEffect(() => {
    if (confirmedNavigation && lastLocation) {
      navigate(lastLocation.location.pathname);

      // Clean-up state on confirmed navigation
      setConfirmedNavigation(false);
    }
  }, [confirmedNavigation, lastLocation]);

  useBlocker(handleBlockedNavigation, when);

  return [showPrompt, confirmNavigation, cancelNavigation];
};

/**
 * Creates an anchor tag with a link to the resource and click it to trigger a download
 * @param uri path to the resource
 * @param mime mime type for the resource
 * @param name
 */
export function downloadURI(uri: string, mime: string | Blob, name: string) {
  const anchor = document.createElement('a');
  document.body.appendChild(anchor);
  anchor.style.display = 'none';

  anchor.setAttribute('href', uri);
  if (mime) anchor.setAttribute('type', mime as string);
  if (name) anchor.setAttribute('download', name);
  anchor.click();

  document.body.removeChild(anchor);
}

/**
 * Attaches a function to the document that will execute when escape key is pressed
 * @param {function} callback
 */
export const useEscape = (callback: Function) => {
  const escFunction = useCallback(
    (event: KeyboardEvent) => {
      if (event.keyCode === ESCAPE_KEY && callback) {
        callback();
      }
    },
    [callback]
  );

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false);
    return () => {
      document.removeEventListener('keydown', escFunction, false);
    };
  }, [callback, escFunction]);
};

/**
 * Executes the function callback when clicking outside of passed ref
 * @param {component} ref
 * @param {function} callback
 */
export const useClickOutside = (ref: MutableRefObject<HTMLElement | null>, callback: Function) => {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: any) {
      if (ref?.current && ref?.current?.contains && !ref?.current?.contains(event.target)) {
        callback();
      }
    }

    <div onClick={() => {}}></div>;

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback]);
};

/**
 * Allow to lazy import named exported components
 * @param loader component
 * @returns component promise
 */
export const lazily = (loader: any) =>
  new Proxy(
    {},
    {
      get: (_, componentName) => {
        if (typeof componentName === 'string') {
          return lazy(() =>
            loader(componentName).then((x: any) => ({
              default: x[componentName],
            }))
          );
        }
      },
    }
  );
