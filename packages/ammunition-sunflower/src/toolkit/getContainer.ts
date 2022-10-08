import { isString } from 'toolkit';

export const getContainer = (container: string | HTMLElement): HTMLElement => {
  return isString(container) ? (document.querySelector((container as string)) as HTMLElement) : (container as HTMLElement);
};