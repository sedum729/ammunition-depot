export const getAnchorElementQueryMap = (anchorElement: HTMLAnchorElement): { [key: string]: string } => {
  const queryList = anchorElement.search.replace("?", "").split("&");
  const queryMap = {};
  queryList.forEach((query) => {
    const [key, value] = query.split("=");
    if (key && value) queryMap[key] = value;
  });
  return queryMap;
}