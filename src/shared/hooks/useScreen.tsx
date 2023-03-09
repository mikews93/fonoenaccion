import { debounce } from 'lodash';
import { useLayoutEffect, useState } from 'react';
import { DEBOUNCE_TIME } from 'shared/constants';

const checkScreenType = () =>
  matchMedia('screen and (max-width: 600px)').matches || navigator.userAgent?.includes('Mobi');

export const useScreen = () => {
  /**
   * State
   */
  const [screenState, setScreenState] = useState({
    isMobile: checkScreenType(),
    height: screen.availHeight,
    width: screen.availWidth,
  });

  /**
   * handlers
   */
  const handleResize = debounce(() => {
    const isMobileSizeScreen = checkScreenType();
    setScreenState({
      isMobile: isMobileSizeScreen,
      height: screen.availHeight,
      width: screen.availWidth,
    });
  }, DEBOUNCE_TIME);

  useLayoutEffect(() => {
    const eventName = 'resize';
    addEventListener(eventName, handleResize);
    return () => removeEventListener(eventName, handleResize);
  }, []);

  return { ...screenState };
};
