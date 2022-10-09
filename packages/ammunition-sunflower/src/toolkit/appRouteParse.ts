import { anchorElementGenerator } from 'toolkit';

export const appRouteParse = (url: string): {
  urlElement: HTMLAnchorElement;
  appHostPath: string;
  appRoutePath: string;
} => {
  const urlElement = anchorElementGenerator(url);
  const appHostPath = urlElement.protocol + "//" + urlElement.host;
  const appRoutePath = urlElement.pathname + urlElement.search + urlElement.hash;

  return { urlElement, appHostPath, appRoutePath };
};