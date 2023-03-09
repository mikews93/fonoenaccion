import { MouseEvent } from 'react';

/**
 * prevents other listeners from being triggered after current call
 * @param event triggered event
 */
export const preventDefaultBehavior = (event?: MouseEvent<HTMLElement>) => {
  event?.preventDefault();
  event?.stopPropagation();
};
