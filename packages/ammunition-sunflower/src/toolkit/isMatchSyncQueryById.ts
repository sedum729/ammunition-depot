import { getAnchorElementQueryMap, anchorElementGenerator } from 'toolkit';

export const isMatchSyncQueryById = (appName: string): boolean => {
  const queryMap = getAnchorElementQueryMap(anchorElementGenerator(window.location.href));
  return Object.keys(queryMap).includes(appName);
};